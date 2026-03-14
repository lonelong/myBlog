'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import BlogCard from './BlogCard'
import Tag from '@/components/ui/Tag'
import { BlogPost } from '@/types'

const MAX_VISIBLE_TAGS = 20

interface BlogListProps {
  posts: BlogPost[]
  tags: string[]
}

export default function BlogList({ posts, tags }: BlogListProps) {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [showAllTags, setShowAllTags] = useState(false)

  // Sort tags by article count (descending)
  const sortedTags = useMemo(() => {
    const tagCount = new Map<string, number>()
    posts.forEach((post) =>
      post.tags.forEach((tag) => tagCount.set(tag, (tagCount.get(tag) || 0) + 1))
    )
    return [...tags].sort((a, b) => (tagCount.get(b) || 0) - (tagCount.get(a) || 0))
  }, [posts, tags])

  const visibleTags = showAllTags ? sortedTags : sortedTags.slice(0, MAX_VISIBLE_TAGS)
  const hasMoreTags = sortedTags.length > MAX_VISIBLE_TAGS

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
        {visibleTags.map((tag) => (
          <Tag
            key={tag}
            label={tag}
            active={activeTag === tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            size="md"
          />
        ))}
        {hasMoreTags && (
          <button
            onClick={() => setShowAllTags(!showAllTags)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
          >
            {showAllTags ? '收起' : `更多 +${sortedTags.length - MAX_VISIBLE_TAGS}`}
            {showAllTags ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
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
