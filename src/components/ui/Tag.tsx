'use client'

import { clsx } from 'clsx'

interface TagProps {
  label: string
  active?: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
}

export default function Tag({ label, active, onClick, size = 'sm' }: TagProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'inline-flex items-center rounded-full border transition-all duration-200',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        active
          ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
          : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
        onClick && 'cursor-pointer'
      )}
    >
      {label}
    </button>
  )
}
