import { Project } from '@/types'

export const projects: Project[] = [
  {
    id: 'ai-chat-hub',
    title: 'AI Chat Hub',
    description: '多模型 AI 聊天聚合平台',
    longDescription:
      '支持 Claude、GPT-4、DeepSeek、Gemini 等多种大语言模型的统一聊天界面。流式响应、Markdown 渲染、对话历史管理、模型快速切换。',
    tags: ['Next.js', 'TypeScript', 'OpenAI', 'Anthropic', 'Tailwind CSS'],
    category: 'ai',
    githubUrl: 'https://github.com/yourusername/ai-chat-hub',
    demoUrl: 'https://ai-chat-hub.vercel.app',
    featured: true,
    stars: 128,
  },
  {
    id: 'react-dashboard',
    title: 'React Admin Dashboard',
    description: '现代化后台管理系统模板',
    longDescription:
      '基于 React 18 + TypeScript 的企业级后台模板，包含权限管理、数据可视化、表格组件、暗色主题等功能。响应式设计，支持移动端。',
    tags: ['React', 'TypeScript', 'Ant Design', 'ECharts', 'Zustand'],
    category: 'web',
    githubUrl: 'https://github.com/yourusername/react-dashboard',
    demoUrl: 'https://react-dashboard-demo.vercel.app',
    featured: true,
    stars: 256,
  },
  {
    id: 'markdown-editor',
    title: 'Markdown Editor Pro',
    description: '在线 Markdown 编辑器',
    longDescription:
      '所见即所得的 Markdown 编辑器，支持实时预览、代码高亮、数学公式、Mermaid 图表、导出 PDF/HTML 等功能。',
    tags: ['Vue 3', 'TypeScript', 'CodeMirror', 'Vite'],
    category: 'tool',
    githubUrl: 'https://github.com/yourusername/markdown-editor',
    demoUrl: 'https://md-editor-pro.vercel.app',
    featured: true,
    stars: 89,
  },
  {
    id: 'portfolio-starter',
    title: 'Portfolio Starter',
    description: 'Next.js 作品集博客模板',
    longDescription:
      '开箱即用的个人作品集模板，含博客系统、项目展示、AI 聊天、SEO 优化、暗色主题。基于 Next.js 14 + MDX + Tailwind CSS。',
    tags: ['Next.js', 'MDX', 'Tailwind CSS', 'Vercel'],
    category: 'web',
    githubUrl: 'https://github.com/yourusername/portfolio-starter',
    demoUrl: 'https://portfolio-starter.vercel.app',
    featured: false,
    stars: 34,
  },
]

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured)
}

export function getProjectsByCategory(category?: string): Project[] {
  if (!category || category === 'all') return projects
  return projects.filter((p) => p.category === category)
}
