// 站点配置 - 从环境变量读取，带默认值
export const siteConfig = {
  authorName: process.env.NEXT_PUBLIC_AUTHOR_NAME || 'ZW',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://ninal.online',
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/lonelong',
  twitterUrl: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://x.com/SyLiu49577',
  telegramUrl: process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/ninal_zw',
  email: process.env.NEXT_PUBLIC_EMAIL || 'longxiao2025@gmail.com',
}
