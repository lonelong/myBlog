import { AIProviders } from '@/types'

export const AI_PROVIDERS: AIProviders = {
  claude: {
    name: 'Claude',
    models: [
      { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', description: '最新 Sonnet，推荐' },
      { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku', description: '快速轻量' },
    ],
    baseURL: 'https://api.anthropic.com',
    envKey: 'ANTHROPIC_API_KEY',
    logo: '🤖',
  },
  openai: {
    name: 'OpenAI',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', description: '多模态旗舰' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: '经济高效' },
      { id: 'o1-mini', name: 'o1-mini', description: '推理模型' },
    ],
    baseURL: 'https://api.openai.com/v1',
    envKey: 'OPENAI_API_KEY',
    logo: '⚡',
  },
  deepseek: {
    name: 'DeepSeek',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek V3', description: '性价比极高' },
      { id: 'deepseek-reasoner', name: 'DeepSeek R1', description: '深度推理' },
    ],
    baseURL: 'https://api.deepseek.com/v1',
    envKey: 'DEEPSEEK_API_KEY',
    logo: '🔍',
  },
  gemini: {
    name: 'Gemini',
    models: [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Google 最新' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: '长上下文' },
    ],
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
    envKey: 'GEMINI_API_KEY',
    logo: '✨',
  },
  moonshot: {
    name: 'Moonshot (Kimi)',
    models: [
      { id: 'moonshot-v1-8k', name: 'Kimi 8K', description: '快速对话' },
      { id: 'moonshot-v1-128k', name: 'Kimi 128K', description: '超长上下文' },
    ],
    baseURL: 'https://api.moonshot.cn/v1',
    envKey: 'MOONSHOT_API_KEY',
    logo: '🌙',
  },
  qwen: {
    name: '通义千问',
    models: [
      { id: 'qwen-turbo', name: 'Qwen Turbo', description: '速度优先' },
      { id: 'qwen-plus', name: 'Qwen Plus', description: '均衡' },
      { id: 'qwen-max', name: 'Qwen Max', description: '最强效果' },
    ],
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    envKey: 'QWEN_API_KEY',
    logo: '🧠',
  },
}

export function getProviderConfig(providerId: string) {
  return AI_PROVIDERS[providerId]
}

export function getDefaultProvider(): string {
  return 'claude'
}

export function getDefaultModel(providerId: string): string {
  const provider = AI_PROVIDERS[providerId]
  return provider?.models[0]?.id || ''
}
