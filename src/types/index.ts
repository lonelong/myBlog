export interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  cover?: string
  content: string
  readingTime: string
}

export interface BlogFrontmatter {
  title: string
  date: string
  description: string
  tags: string[]
  cover?: string
}

export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  tags: string[]
  category: 'web' | 'mobile' | 'tool' | 'ai'
  githubUrl: string
  demoUrl?: string
  featured: boolean
  stars?: number
  image?: string
}

export interface AIModel {
  id: string
  name: string
  description: string
}

export interface AIProvider {
  name: string
  models: AIModel[]
  baseURL: string
  envKey: string
  logo: string
}

export interface AIProviders {
  [key: string]: AIProvider
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface ChatState {
  messages: ChatMessage[]
  provider: string
  model: string
  isLoading: boolean
}
