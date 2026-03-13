import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://ninal.online'
  ),
  title: {
    default: 'ZW | 前端开发者',
    template: '%s | ZW',
  },
  description: '专注 React/Next.js 的前端工程师，分享技术文章与开源项目',
  keywords: ['前端开发', 'React', 'Next.js', 'TypeScript', '作品集', '博客'],
  authors: [{ name: 'ZW' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'ZW的博客',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@SyLiu49577',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
