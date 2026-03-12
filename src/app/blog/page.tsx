import { getAllBlogPosts, getAllTags } from '@/lib/mdx'
import BlogList from '@/components/blog/BlogList'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '博客',
  description: '分享前端开发、React、Next.js 等技术文章',
}

export default function BlogPage() {
  const posts = getAllBlogPosts()
  const tags = getAllTags()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">博客</h1>
        <p className="text-[var(--text-secondary)] text-lg">
          分享技术心得、开发经验和学习笔记
        </p>
      </div>
      <BlogList posts={posts} tags={tags} />
    </div>
  )
}
