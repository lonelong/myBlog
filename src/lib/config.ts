// 站点配置 - 从环境变量读取，带默认值
export const siteConfig = {
  authorName: process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Ninal_zw',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://ninal.online',
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL,
  twitterUrl: process.env.NEXT_PUBLIC_TWITTER_URL,
  telegramUrl: process.env.NEXT_PUBLIC_TELEGRAM_URL,
  email: process.env.NEXT_PUBLIC_EMAIL,
}
