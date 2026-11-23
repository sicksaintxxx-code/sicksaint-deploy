import { NextResponse } from 'next/server'
import { getWordPressPosts } from '@/lib/wordpress'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1)
  const perPage = Math.min(100, Math.max(1, Number.parseInt(searchParams.get('per_page') || searchParams.get('limit') || '20', 10) || 20))
  const category = searchParams.get('category') || undefined
  const search = searchParams.get('search') || undefined
  const format = searchParams.get('format') || undefined
  const result = await getWordPressPosts({ page, perPage, category, search })
  const articles = format ? result.data.filter((article) => article.format === format.toUpperCase()) : result.data

  return NextResponse.json({
    success: result.isWordPressLive,
    data: articles,
    pagination: { total: result.total, totalPages: result.totalPages, currentPage: result.currentPage, perPage },
    isWordPressLive: result.isWordPressLive,
    ...(result.error ? { error: 'Published articles are temporarily unavailable.' } : {}),
  }, { status: result.isWordPressLive ? 200 : 503 })
}

// Publishing goes through WordPress after an editorial review. Until a privileged
// WordPress integration is configured, never persist or publish client supplied content.
export async function POST() {
  return NextResponse.json({ error: 'Article creation is handled through editorial submissions.' }, { status: 405, headers: { Allow: 'GET' } })
}
