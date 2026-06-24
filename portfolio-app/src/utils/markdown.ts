import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import type { Post, PostMeta } from '../types/post'

const rawFiles = import.meta.glob('../posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function parseFrontmatter(raw: string): {
  data: Record<string, string | string[]>
  content: string
} {
  if (!raw.startsWith('---\n')) return { data: {}, content: raw }
  const end = raw.indexOf('\n---\n', 4)
  if (end === -1) return { data: {}, content: raw }

  const yaml = raw.slice(4, end)
  const content = raw.slice(end + 5)
  const data: Record<string, string | string[]> = {}

  for (const line of yaml.split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const val = line.slice(colon + 1).trim()
    if (val.startsWith('[') && val.endsWith(']')) {
      data[key] = val
        .slice(1, -1)
        .split(',')
        .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
    } else {
      data[key] = val.replace(/^['"]|['"]$/g, '')
    }
  }

  return { data, content }
}

function slugFromPath(path: string): string {
  return path.split('/').pop()!.replace(/\.md$/, '')
}

export function getAllPosts(): PostMeta[] {
  return Object.entries(rawFiles)
    .map(([path, raw]) => {
      const { data } = parseFrontmatter(raw)
      return {
        slug: slugFromPath(path),
        title: (data.title as string) || slugFromPath(path),
        date: (data.date as string) || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        description: (data.description as string) || '',
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

export async function getPost(slug: string): Promise<Post | null> {
  const entry = Object.entries(rawFiles).find(
    ([path]) => slugFromPath(path) === slug,
  )
  if (!entry) return null

  const [path, raw] = entry
  const { data, content } = parseFrontmatter(raw)

  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content)

  return {
    slug: slugFromPath(path),
    title: (data.title as string) || slug,
    date: (data.date as string) || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    description: (data.description as string) || '',
    html: String(file),
  }
}
