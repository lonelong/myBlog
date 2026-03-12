'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import BlogCard from './BlogCard'
import Tag from '@/components/ui/Tag'
import { BlogPost } from '@/types'

interface BlogListProps {
  posts: BlogPost[]
  tags: string[]
}

export default function BlogList({ posts, tags }: BlogListProps) {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filtered = posts.filter((post) => {
    const matchesSearch =
      !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.description.toLowerCase().includes(search.toLowerCase())

    const matchesTag = !activeTag || post.tags.includes(activeTag)

    return matchesSearch && matchesTag
  })

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
        <input
          type="text"
          placeholder="搜索文章..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      {/* Tag cloud */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Tag
          label="全部"
          active={!activeTag}
          onClick={() => setActiveTag(null)}
          size="md"
        />
        {tags.map((tag) => (
          <Tag
            key={tag}
            label={tag}
            active={activeTag === tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            size="md"
          />
        ))}
      </div>

      {/* Posts grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-[var(--text-secondary)]">
          没有找到匹配的文章
        </div>
      )}
    </div>
  )
}
