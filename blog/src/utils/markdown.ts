import type { Post, PostMeta } from '../types/post'

const modules = import.meta.glob<Post>('../posts/*.md', {
  eager: true,
  import: 'default',
})

const posts: Post[] = Object.values(modules).sort((a, b) =>
  b.date.localeCompare(a.date),
)

export function getAllPosts(): PostMeta[] {
  return posts.map(({ slug, title, date, tags, description }) => ({
    slug,
    title,
    date,
    tags,
    description,
  }))
}

export function getPost(slug: string): Post | null {
  return posts.find(p => p.slug === slug) ?? null
}
