'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Trash2, MessageSquare } from 'lucide-react'
import ModelSelector from './ModelSelector'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { ChatMessage as ChatMessageType } from '@/types'
import { getDefaultProvider, getDefaultModel } from '@/lib/ai-providers'

const STORAGE_KEY = 'chat-history'
const PROVIDER_KEY = 'chat-provider'
const MODEL_KEY = 'chat-model'

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [provider, setProvider] = useState(getDefaultProvider())
  const [model, setModel] = useState(getDefaultModel(getDefaultProvider()))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as ChatMessageType[]
        // Migrate old messages that lack an id
        setMessages(parsed.map(msg => ({ ...msg, id: msg.id || crypto.randomUUID() })))
      }
      const savedProvider = localStorage.getItem(PROVIDER_KEY)
      const savedModel = localStorage.getItem(MODEL_KEY)
      if (savedProvider) setProvider(savedProvider)
      if (savedModel) setModel(savedModel)
    } catch {}
  }, [])

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {}
  }, [messages])

  useEffect(() => {
    try {
      localStorage.setItem(PROVIDER_KEY, provider)
      localStorage.setItem(MODEL_KEY, model)
    } catch {}
  }, [provider, model])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      setError(null)
      const userMessage: ChatMessageType = { id: crypto.randomUUID(), role: 'user', content: content.trim() }

      // Use functional update to get latest messages for API call
      let messagesForApi: ChatMessageType[] = []
      setMessages((prev) => {
        messagesForApi = [...prev, userMessage]
        return messagesForApi
      })
      setIsLoading(true)

      // Create abort controller
      abortRef.current = new AbortController()

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: messagesForApi.map(({ role, content }) => ({ role, content })),
            provider,
            model,
          }),
          signal: abortRef.current.signal,
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || '请求失败')
        }

        const reader = res.body?.getReader()
        if (!reader) throw new Error('无法读取响应流')

        const decoder = new TextDecoder()
        let assistantContent = ''

        // Add empty assistant message
        const assistantId = crypto.randomUUID()
        setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }])

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const text = decoder.decode(value)
          const lines = text.split('\n').filter((line) => line.startsWith('data: '))

          for (const line of lines) {
            const data = line.slice(6)
            if (data === '[DONE]') break

            try {
              const parsed = JSON.parse(data)
              if (parsed.error) throw new Error(parsed.error)
              if (parsed.content) {
                assistantContent += parsed.content
                setMessages((prev) => {
                  const updated = [...prev]
                  const last = updated[updated.length - 1]
                  updated[updated.length - 1] = {
                    ...last,
                    content: assistantContent,
                  }
                  return updated
                })
              }
            } catch (e) {
              if (e instanceof SyntaxError) continue
              throw e
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        const errorMessage = (err as Error).message || '发送消息失败'
        setError(errorMessage)
        // Remove the empty assistant message if there was an error
        setMessages((prev) => {
          if (prev.length > 0 && prev[prev.length - 1].role === 'assistant' && !prev[prev.length - 1].content) {
            return prev.slice(0, -1)
          }
          return prev
        })
      } finally {
        setIsLoading(false)
        abortRef.current = null
      }
    },
    [provider, model, isLoading]
  )

  const handleClear = () => {
    if (isLoading) {
      abortRef.current?.abort()
    }
    setMessages([])
    setError(null)
    setIsLoading(false)
  }

  const handleModelChange = (newProvider: string, newModel: string) => {
    setProvider(newProvider)
    setModel(newModel)
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <ModelSelector
          provider={provider}
          model={model}
          onChange={handleModelChange}
        />
        <button
          onClick={handleClear}
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 transition-all"
          title="清空对话"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)]">
            <MessageSquare className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-lg font-medium mb-1">开始对话</p>
            <p className="text-sm">选择模型后发送消息开始聊天</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage key={msg.id} message={msg} isLoading={isLoading && i === messages.length - 1 && msg.role === 'assistant'} />
        ))}

        {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-sm shrink-0">
              AI
            </div>
            <div className="glass-card px-4 py-3 rounded-lg">
              <div className="flex items-center gap-1">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-md p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  )
}
