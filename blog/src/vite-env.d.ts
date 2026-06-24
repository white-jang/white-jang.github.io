/// <reference types="vite/client" />

declare module '*.md' {
  import type { Post } from './types/post'
  const post: Post
  export default post
}
