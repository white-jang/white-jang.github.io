import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiEye } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { getPost } from "../utils/markdown";
import { usePostStats } from "../hooks/usePostStats";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPost(slug) : null;
  const { stats, liked, likeLoading, handleLike } = usePostStats(slug ?? "");

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".mermaid-raw");
    if (elements.length === 0) return;

    import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        flowchart: { useMaxWidth: true },
        sequence: { useMaxWidth: true },
      });
      elements.forEach(async (el) => {
        const code = el.textContent ?? "";
        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        try {
          const { svg } = await mermaid.render(id, code);
          const wrapper = document.createElement("div");
          wrapper.className = "mermaid-wrapper";
          wrapper.innerHTML = svg;
          el.replaceWith(wrapper);
        } catch (e) {
          console.error("mermaid render error", e);
        }
      });
    });
  }, [post?.html]);

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <p className="text-sm text-gray-600">포스트를 찾을 수 없습니다.</p>
        <Link to="/" className="text-sm underline mt-4 block">
          ← 목록으로
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-2xl mx-auto px-4 py-12">
      <Link
        to="/"
        className="text-sm text-gray-500 hover:text-black transition-colors mb-8 block"
      >
        ← 목록으로
      </Link>

      <h1 className="text-3xl font-bold mb-3">{post.title}</h1>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <time className="text-sm text-gray-400">{post.date}</time>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs border border-black px-1.5 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <FiEye />
            {stats === null ? (
              <span className="w-3 h-3 bg-gray-200 rounded animate-pulse inline-block" />
            ) : (
              stats.views
            )}
          </span>
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`flex items-center gap-1 transition-colors disabled:opacity-50 ${
              liked ? "text-red-500" : "hover:text-red-400"
            }`}
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
            {stats === null ? (
              <span className="w-2 h-3 bg-gray-200 rounded animate-pulse inline-block" />
            ) : (
              stats.likes
            )}
          </button>
        </div>
      </div>

      <hr className="border-black my-6" />

      <div
        className="prose prose-sm max-w-none prose-headings:font-bold prose-a:text-black prose-code:bg-slate-200 prose-code:text-gray prose-code:p-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:rounded-none"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      <div className="flex flex-col items-center gap-2 mt-16">
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={`flex items-center gap-2 border px-6 py-3 text-sm transition-colors duration-150 disabled:opacity-50 ${
            liked
              ? "border-red-400 text-red-500 bg-red-50"
              : "border-black hover:bg-black hover:text-white"
          }`}
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
          {liked ? "좋아요" : "이 글이 도움됐다면 하트를!"}
          {stats === null ? (
            <span className="w-4 h-3 bg-gray-200 rounded animate-pulse inline-block" />
          ) : (
            <span className="font-bold">{stats.likes}</span>
          )}
        </button>
        {liked && (
          <p className="text-xs text-gray-400">
            버튼을 한 번 더 누르면 취소됩니다.
          </p>
        )}
      </div>
    </article>
  );
}
