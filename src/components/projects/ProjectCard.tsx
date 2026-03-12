'use client'

import { Github, ExternalLink, Star } from 'lucide-react'
import Tag from '@/components/ui/Tag'
import { Project } from '@/types'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="glass-card hover-glow p-6 h-full flex flex-col group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold group-hover:text-[var(--accent)] transition-colors">
          {project.title}
        </h3>
        {project.stars !== undefined && (
          <span className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)]">
            <Star className="w-3 h-3" />
            {project.stars}
          </span>
        )}
      </div>

      <p className="text-sm text-[var(--text-secondary)] mb-2">
        {project.description}
      </p>

      <p className="text-xs text-[var(--text-secondary)] mb-4 flex-1 line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity">
        {project.longDescription}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tags.slice(0, 4).map((tag) => (
          <Tag key={tag} label={tag} size="sm" />
        ))}
      </div>

      <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)]">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
        >
          <Github className="w-4 h-4" />
          Source
        </a>
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Demo
          </a>
        )}
      </div>
    </div>
  )
}
