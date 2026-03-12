'use client'

import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import Tag from '@/components/ui/Tag'
import { BlogPost } from '@/types'

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="glass-card hover-glow p-6 h-full flex flex-col group">
        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)] mb-3">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {format(new Date(post.date), 'yyyy/MM/dd', { locale: zhCN })}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readingTime}
          </span>
        </div>

        <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2 flex-1">
          {post.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <Tag key={tag} label={tag} size="sm" />
          ))}
        </div>
      </article>
    </Link>
  )
}
