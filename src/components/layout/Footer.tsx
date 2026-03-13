'use client'

import { Github, Twitter, Mail, Send } from 'lucide-react'
import { siteConfig } from '@/lib/config'

const socialLinks = [
  {
    icon: Github,
    href: siteConfig.githubUrl,
    label: 'GitHub',
  },
  {
    icon: Twitter,
    href: siteConfig.twitterUrl,
    label: 'X (Twitter)',
  },
  {
    icon: Send,
    href: siteConfig.telegramUrl,
    label: 'Telegram',
  },
  {
    icon: Mail,
    href: `mailto:${siteConfig.email}`,
    label: 'Email',
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-secondary)]">
            &copy; {new Date().getFullYear()} {siteConfig.authorName}. All rights reserved.
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
