import type { Plugin } from "vite";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { createHighlighter } from "shiki";

type Highlighter = Awaited<ReturnType<typeof createHighlighter>>;

function parseFrontmatter(raw: string): {
  data: Record<string, string | string[]>;
  content: string;
} {
  if (!raw.startsWith("---\n")) return { data: {}, content: raw };
  const end = raw.indexOf("\n---\n", 4);
  if (end === -1) return { data: {}, content: raw };

  const yaml = raw.slice(4, end);
  const content = raw.slice(end + 5);
  const data: Record<string, string | string[]> = {};

  for (const line of yaml.split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim();
    if (val.startsWith("[") && val.endsWith("]")) {
      data[key] = val
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ""));
    } else {
      data[key] = val.replace(/^['"]|['"]$/g, "");
    }
  }

  return { data, content };
}

export function mdPlugin(): Plugin {
  let highlighter: Highlighter | null = null;

  async function getHighlighter() {
    if (!highlighter) {
      highlighter = await createHighlighter({
        themes: ["one-dark-pro"],
        langs: [
          "javascript",
          "typescript",
          "tsx",
          "jsx",
          "bash",
          "shell",
          "sh",
          "json",
          "yaml",
          "css",
          "html",
          "python",
          "java",
          "markdown",
          "text",
        ],
      });
    }
    return highlighter;
  }

  return {
    name: "vite-plugin-md",
    async transform(code, id) {
      if (!id.endsWith(".md")) return null;

      const { data, content } = parseFrontmatter(code);
      const hl = await getHighlighter();

      const file = await unified()
        .use(remarkParse)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeShikiFromHighlighter, hl, { theme: "one-dark-pro" })
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(content);

      const slug = id.split("/").pop()!.replace(/\.md$/, "");

      const post = {
        slug,
        title: (data.title as string) || slug,
        date: (data.date as string) || "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        description: (data.description as string) || "",
        html: String(file),
      };

      return {
        code: `export default ${JSON.stringify(post)}`,
        map: null,
      };
    },
  };
}
