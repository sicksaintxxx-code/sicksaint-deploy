import { NextResponse } from 'next/server'
import { getWordPressPostBySlug } from '@/lib/wordpress'

export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const result = await getWordPressPostBySlug(slug)
  if (!result.isWordPressLive) return NextResponse.json({ success: false, error: 'Published articles are temporarily unavailable.' }, { status: 503 })
  if (!result.article) return NextResponse.json({ success: false, error: 'Article not found.' }, { status: 404 })
  return NextResponse.json({ success: true, data: { ...result.article, related: result.related } })
}

export async function PUT() {
  return NextResponse.json({ error: 'Published content is managed in WordPress.' }, { status: 405, headers: { Allow: 'GET' } })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Published content is managed in WordPress.' }, { status: 405, headers: { Allow: 'GET' } })
}
