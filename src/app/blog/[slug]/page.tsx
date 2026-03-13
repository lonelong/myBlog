import { notFound } from 'next/navigation'
import { getBlogPost, getBlogSlugs } from '@/lib/mdx'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Calendar, Clock } from 'lucide-react'
import Tag from '@/components/ui/Tag'
import TableOfContents from '@/components/blog/TableOfContents'
import { MDXContent } from '@/components/blog/MDXContent'
import { siteConfig } from '@/lib/config'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = getBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPost(params.slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
      images: post.cover ? [{ url: post.cover }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: siteConfig.authorName,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12">
          {/* Main content */}
          <div className="min-w-0">
            {/* Header */}
            <header className="mb-10">
              <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)] mb-4">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(post.date), 'yyyy年MM月dd日', { locale: zhCN })}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readingTime}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>

              <p className="text-lg text-[var(--text-secondary)] mb-6">
                {post.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Tag key={tag} label={tag} />
                ))}
              </div>
            </header>

            {/* MDX Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <MDXContent content={post.content} />
            </div>
          </div>

          {/* TOC Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents content={post.content} />
            </div>
          </aside>
        </div>
      </article>
    </>
  )
}
