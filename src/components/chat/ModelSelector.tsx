'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AI_PROVIDERS } from '@/lib/ai-providers'

interface ModelSelectorProps {
  provider: string
  model: string
  onChange: (provider: string, model: string) => void
}

export default function ModelSelector({ provider, model, onChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const currentProvider = AI_PROVIDERS[provider]
  const currentModel = currentProvider?.models.find((m) => m.id === model)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all text-sm"
      >
        <span>{currentProvider?.logo}</span>
        <span className="font-medium">{currentModel?.name || '选择模型'}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-72 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] shadow-xl overflow-hidden z-50"
          >
            <div className="max-h-80 overflow-y-auto py-1">
              {Object.entries(AI_PROVIDERS).map(([providerId, providerConfig]) => (
                <div key={providerId}>
                  {/* Provider group header */}
                  <div className="px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] bg-[var(--bg-secondary)] flex items-center gap-2">
                    <span>{providerConfig.logo}</span>
                    {providerConfig.name}
                  </div>

                  {/* Models */}
                  {providerConfig.models.map((m) => {
                    const isActive = provider === providerId && model === m.id
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          onChange(providerId, m.id)
                          setOpen(false)
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-[var(--bg-secondary)] transition-colors ${
                          isActive ? 'bg-[var(--accent)]/10' : ''
                        }`}
                      >
                        <div>
                          <div className="text-sm font-medium text-[var(--text-primary)]">
                            {m.name}
                          </div>
                          <div className="text-xs text-[var(--text-secondary)]">
                            {m.description}
                          </div>
                        </div>
                        {isActive && (
                          <Check className="w-4 h-4 text-[var(--accent)] shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
