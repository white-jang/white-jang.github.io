import { Link } from 'react-router-dom'
import { getAllPosts } from '../utils/markdown'

export default function BlogList() {
  const posts = getAllPosts()

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8 border-b border-black pb-2">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-sm text-gray-500">아직 작성된 글이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-5">
          {posts.map(post => (
            <li key={post.slug}>
              <Link
                to={`/${post.slug}`}
                className="block bg-white border border-black shadow-pixel p-5 hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-base font-bold">{post.title}</h2>
                  <time className="text-xs text-gray-400 flex-shrink-0">{post.date}</time>
                </div>
                {post.description && (
                  <p className="text-sm text-gray-600 mt-1.5">{post.description}</p>
                )}
                {post.tags.length > 0 && (
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs border border-black px-1.5 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
