'use client'

import { Github, Twitter, Mail, Send } from 'lucide-react'

const socialLinks = [
  {
    icon: Github,
    href: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/lonelong',
    label: 'GitHub',
  },
  {
    icon: Twitter,
    href: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://x.com/SyLiu49577',
    label: 'X (Twitter)',
  },
  {
    icon: Send,
    href: process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/ninal_zw',
    label: 'Telegram',
  },
  {
    icon: Mail,
    href: `mailto:${process.env.NEXT_PUBLIC_EMAIL || 'longxiao2025@gmail.com'}`,
    label: 'Email',
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-secondary)]">
            &copy; {new Date().getFullYear()} ZW. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--bg-secondary)] transition-all"
                aria-label={link.label}
              >
                <link.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
