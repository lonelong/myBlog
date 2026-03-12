'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Github,
  Twitter,
  Linkedin,
  ArrowRight,
  Code2,
  Palette,
  Zap,
  Database,
  Globe,
  Cpu,
} from 'lucide-react'
import BlogCard from '@/components/blog/BlogCard'
import ProjectCard from '@/components/projects/ProjectCard'
import ScrollToTop from '@/components/ui/ScrollToTop'
import { useEffect, useState } from 'react'
import { BlogPost, Project } from '@/types'

const techStack = [
  { name: 'React', icon: Code2, color: '#61DAFB' },
  { name: 'Next.js', icon: Globe, color: '#ffffff' },
  { name: 'TypeScript', icon: Zap, color: '#3178C6' },
  { name: 'Tailwind CSS', icon: Palette, color: '#06B6D4' },
  { name: 'Node.js', icon: Database, color: '#339933' },
  { name: 'AI/LLM', icon: Cpu, color: '#6366f1' },
]

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function HomePage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])

  useEffect(() => {
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => setPosts(data.slice(0, 3)))
      .catch(() => {})

    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => setFeaturedProjects(data.filter((p: Project) => p.featured).slice(0, 3)))
      .catch(() => {})
  }, [])

  return (
    <>
      <ScrollToTop />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--accent)]/5 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] text-sm text-[var(--text-secondary)] mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Open to opportunities
            </motion.div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Hi, I&apos;m{' '}
              <span className="gradient-text">ZW</span>
              <br />
              <span className="text-[var(--text-secondary)]">Frontend Developer</span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
              专注于 React / Next.js 生态的前端工程师，热爱开源，
              <br className="hidden sm:block" />
              分享技术文章和构建有趣的项目。
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors"
              >
                查看项目 <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--border)] text-[var(--text-primary)] font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
              >
                AI 对话
              </Link>
            </div>

            {/* Social links */}
            <div className="flex items-center justify-center gap-3 mt-10">
              {[
                { icon: Github, href: 'https://github.com/yourusername' },
                { icon: Twitter, href: 'https://twitter.com/yourhandle' },
                { icon: Linkedin, href: 'https://linkedin.com/in/yourname' },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl sm:text-3xl font-bold text-center mb-12"
            >
              技术栈
            </motion.h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {techStack.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  variants={fadeInUp}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card hover-glow p-6 flex flex-col items-center gap-3 group cursor-default"
                >
                  <tech.icon
                    className="w-8 h-8 transition-colors"
                    style={{ color: tech.color }}
                  />
                  <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                    {tech.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      {posts.length > 0 && (
        <section className="py-20 bg-[var(--bg-secondary)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <div className="flex items-center justify-between mb-12">
                <motion.h2
                  variants={fadeInUp}
                  className="text-2xl sm:text-3xl font-bold"
                >
                  最新文章
                </motion.h2>
                <motion.div variants={fadeInUp}>
                  <Link
                    href="/blog"
                    className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] inline-flex items-center gap-1"
                  >
                    查看全部 <ArrowRight className="w-3 h-3" />
                  </Link>
                </motion.div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, i) => (
                  <motion.div key={post.slug} variants={fadeInUp} transition={{ delay: i * 0.1 }}>
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <div className="flex items-center justify-between mb-12">
                <motion.h2
                  variants={fadeInUp}
                  className="text-2xl sm:text-3xl font-bold"
                >
                  精选项目
                </motion.h2>
                <motion.div variants={fadeInUp}>
                  <Link
                    href="/projects"
                    className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] inline-flex items-center gap-1"
                  >
                    查看全部 <ArrowRight className="w-3 h-3" />
                  </Link>
                </motion.div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects.map((project, i) => (
                  <motion.div key={project.id} variants={fadeInUp} transition={{ delay: i * 0.1 }}>
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </>
  )
}
