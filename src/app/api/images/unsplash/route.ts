import { NextRequest, NextResponse } from 'next/server'

const CURATED_EDITORIAL_PHOTOS = [
  {
    id: 'arch-monolith-1',
    alt_description: 'Brutalist concrete radio observatory array under overcast skies',
    urls: {
      small: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?q=80&w=600&auto=format&fit=crop',
      regular: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?q=80&w=1600&auto=format&fit=crop',
      full: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?q=80&w=2400&auto=format&fit=crop',
    },
    user: { name: 'Viktor Forgacs', username: 'viktorforgacs' },
    links: { html: 'https://unsplash.com/@viktorforgacs' },
    keywords: ['brutalist', 'architecture', 'concrete', 'monolith', 'observatory'],
  },
  {
    id: 'tech-cables-1',
    alt_description: 'Deep-ocean telecommunication cable deployment vessel',
    urls: {
      small: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop',
      regular: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
      full: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2400&auto=format&fit=crop',
    },
    user: { name: 'Alexandre Debiève', username: 'alexandre_debieve' },
    links: { html: 'https://unsplash.com/@alexandre_debieve' },
    keywords: ['technology', 'subsea', 'hardware', 'compute', 'fiber', 'network'],
  },
  {
    id: 'ai-datacenter-1',
    alt_description: 'Subterranean server rack enclosure with water-cooling telemetry',
    urls: {
      small: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop',
      regular: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop',
      full: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2400&auto=format&fit=crop',
    },
    user: { name: 'Manuel Geissinger', username: 'manuel_g' },
    links: { html: 'https://unsplash.com' },
    keywords: ['datacenter', 'ai', 'servers', 'infrastructure', 'compute', 'silicon'],
  },
  {
    id: 'fashion-tailoring-1',
    alt_description: 'Heavyweight bespoke wool tailoring in minimalist daylight studio',
    urls: {
      small: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop',
      regular: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop',
      full: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2400&auto=format&fit=crop',
    },
    user: { name: 'Laura Chouette', username: 'laurachouette' },
    links: { html: 'https://unsplash.com/@laurachouette' },
    keywords: ['fashion', 'tailoring', 'wool', 'couture', 'minimalist', 'silhouette'],
  },
  {
    id: 'finance-darkpool-1',
    alt_description: 'Low-light quantitative trading floor display during settlement',
    urls: {
      small: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop',
      regular: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1600&auto=format&fit=crop',
      full: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2400&auto=format&fit=crop',
    },
    user: { name: 'Maxim Hopman', username: 'maximhopman' },
    links: { html: 'https://unsplash.com/@maximhopman' },
    keywords: ['finance', 'markets', 'capital', 'liquidity', 'trading', 'currency'],
  },
  {
    id: 'culture-cinema-1',
    alt_description: 'Silver halide 70mm analog film reels in archive vault',
    urls: {
      small: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop',
      regular: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop',
      full: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2400&auto=format&fit=crop',
    },
    user: { name: 'Felix Mooneeram', username: 'felixmooneeram' },
    links: { html: 'https://unsplash.com/@felixmooneeram' },
    keywords: ['cinema', 'film', 'analog', '70mm', 'celluloid', 'culture'],
  },
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').toLowerCase().trim()
  const page = searchParams.get('page') || '1'
  const per_page = searchParams.get('per_page') || '12'

  const accessKey = process.env.UNSPLASH_ACCESS_KEY

  // If no access key configured, return authentic curated editorial collection
  if (!accessKey) {
    let filtered = CURATED_EDITORIAL_PHOTOS
    if (q) {
      filtered = CURATED_EDITORIAL_PHOTOS.filter(
        p =>
          p.keywords.some(k => k.includes(q) || q.includes(k)) ||
          p.alt_description.toLowerCase().includes(q) ||
          p.user.name.toLowerCase().includes(q)
      )
    }
    return NextResponse.json({
      results: filtered,
      total: filtered.length,
      demo: false,
      curated: true,
      message: 'Showing curated licensed editorial photography. Add UNSPLASH_ACCESS_KEY in .env.local to search full 4M+ library.',
    })
  }

  try {
    const url = new URL('https://api.unsplash.com/search/photos')
    url.searchParams.set('query', q)
    url.searchParams.set('page', page)
    url.searchParams.set('per_page', per_page)
    url.searchParams.set('client_id', accessKey)

    const res = await fetch(url.toString(), {
      headers: { 'Accept-Version': 'v1' },
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `Unsplash API error: ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()

    // Return only the fields we need — never forward the full Unsplash payload
    const results = (data.results || []).map((photo: {
      id: string
      urls: { small: string; regular: string; full: string }
      alt_description: string | null
      user: { name: string; username: string }
      links: { html: string }
    }) => ({
      id: photo.id,
      urls: {
        small: photo.urls.small,
        regular: photo.urls.regular,
        full: photo.urls.full,
      },
      alt_description: photo.alt_description,
      user: {
        name: photo.user.name,
        username: photo.user.username,
      },
      links: {
        html: photo.links.html,
      },
    }))

    return NextResponse.json({ results, total: data.total ?? 0 })
  } catch (err) {
    console.error('[unsplash route] fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}
