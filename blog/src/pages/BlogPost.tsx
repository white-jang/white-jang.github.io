import { useParams, Link } from "react-router-dom";
import { getPost } from "../utils/markdown";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPost(slug) : null;

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

      <div className="flex items-center gap-3 mb-2">
        <time className="text-sm text-gray-400">{post.date}</time>
        {post.tags.map((tag) => (
          <span key={tag} className="text-xs border border-black px-1.5 py-0.5">
            {tag}
          </span>
        ))}
      </div>

      <hr className="border-black my-6" />

      <div
        className="prose prose-sm max-w-none prose-headings:font-bold prose-a:text-black prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:rounded-none"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  );
}
