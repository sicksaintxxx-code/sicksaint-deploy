import { NextResponse } from 'next/server'
import { getWordPressPosts } from '@/lib/wordpress'

export const dynamic = 'force-dynamic'

function xml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sicksaint.club'
  const result = await getWordPressPosts({ page: 1, perPage: 100 })
  const items = result.data.map((article) => {
    const articleUrl = `${siteUrl}/article/${encodeURIComponent(article.slug)}`
    return `<item><title>${xml(article.title)}</title><link>${articleUrl}</link><guid isPermaLink="true">${articleUrl}</guid><description>${xml(article.excerpt)}</description><category>${xml(article.category.name)}</category><dc:creator>${xml(article.author.name)}</dc:creator><pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate></item>`
  }).join('')

  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>SICKSAINT — The World, Without The Noise</title><link>${xml(siteUrl)}</link><description>Published editorial stories from SICKSAINT.</description><language>en-us</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate><atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${xml(siteUrl)}/api/feed/rss" rel="self" type="application/rss+xml"/>${items}</channel></rss>`
  return new NextResponse(body, {
    status: result.isWordPressLive ? 200 : 503,
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' },
  })
}
