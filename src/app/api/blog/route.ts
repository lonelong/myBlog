import { NextResponse } from 'next/server'
import { getAllBlogPosts } from '@/lib/mdx'

export async function GET() {
  const posts = getAllBlogPosts()
  return NextResponse.json(posts)
}
