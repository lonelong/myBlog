'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MDXContentProps {
  content: string
}

export function MDXContent({ content }: MDXContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children, ...props }) => (
          <h1 id={slugify(String(children))} {...props}>{children}</h1>
        ),
        h2: ({ children, ...props }) => (
          <h2 id={slugify(String(children))} {...props}>{children}</h2>
        ),
        h3: ({ children, ...props }) => (
          <h3 id={slugify(String(children))} {...props}>{children}</h3>
        ),
        pre: ({ children }) => (
          <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto">
            {children}
          </pre>
        ),
        code: ({ className, children, ...props }) => {
          const isInline = !className
          if (isInline) {
            return (
              <code className="bg-[var(--bg-secondary)] text-[var(--accent)] px-1.5 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            )
          }
          return (
            <code className={`${className} text-sm`} {...props}>
              {children}
            </code>
          )
        },
        a: ({ children, href, ...props }) => (
          <a
            href={href}
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="text-[var(--accent)] hover:text-[var(--accent-hover)]"
            {...props}
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-[var(--accent)] pl-4 italic text-[var(--text-secondary)]">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
