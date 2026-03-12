'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { User } from 'lucide-react'
import { ChatMessage as ChatMessageType } from '@/types'

interface ChatMessageProps {
  message: ChatMessageType
  isLoading?: boolean
}

export default function ChatMessage({ message, isLoading }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${
          isUser
            ? 'bg-[var(--accent)] text-white'
            : 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)]'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : 'AI'}
      </div>

      {/* Content */}
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-[var(--accent)] text-white'
            : 'glass-card'
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                pre: ({ children }) => (
                  <pre className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 overflow-x-auto text-xs">
                    {children}
                  </pre>
                ),
                code: ({ className, children, ...props }) => {
                  const isInline = !className
                  if (isInline) {
                    return (
                      <code className="bg-[var(--bg-secondary)] text-[var(--accent)] px-1 py-0.5 rounded text-xs" {...props}>
                        {children}
                      </code>
                    )
                  }
                  return <code className={className} {...props}>{children}</code>
                },
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
              }}
            >
              {message.content}
            </ReactMarkdown>
            {isLoading && message.content && (
              <span className="inline-block w-2 h-4 bg-[var(--accent)] animate-pulse ml-0.5" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
