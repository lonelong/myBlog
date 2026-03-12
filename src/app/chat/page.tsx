'use client'

import ChatWindow from '@/components/chat/ChatWindow'

export default function ChatPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">AI 聊天</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          选择模型与 AI 助手对话，支持多种大语言模型
        </p>
      </div>
      <ChatWindow />
    </div>
  )
}
