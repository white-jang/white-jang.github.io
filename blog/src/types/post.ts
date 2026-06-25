export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
}

export interface Post extends PostMeta {
  html: string;
}
