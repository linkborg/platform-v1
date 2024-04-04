import type BlogAuthor from './blog-author'

type BlogPostType = {
  slug: string
  title: string
  date: string
  coverImage: string
  author: BlogAuthor
  excerpt: string
  ogImage: {
    url: string
  }
  content: string
}

export default BlogPostType