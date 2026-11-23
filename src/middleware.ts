import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'ss_auth'
const PROTECTED = ['/dashboard', '/write', '/profile', '/admin']
const AUTH_PAGES = ['/login', '/signup']

function apiMeUrl() {
  const configured = process.env.LARAVEL_API_URL?.replace(/\/$/, '')
  if (!configured) return null
  return `${configured.endsWith('/api') ? configured : `${configured}/api`}/auth/me`
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get(COOKIE_NAME)?.value
  const protectedPath = PROTECTED.some((path) => pathname.startsWith(path))
  const authPage = AUTH_PAGES.some((path) => pathname.startsWith(path))
  if (!protectedPath && !authPage) return NextResponse.next()
  if (!token) {
    if (protectedPath) { const url = new URL('/login', req.url); url.searchParams.set('from', pathname); return NextResponse.redirect(url) }
    return NextResponse.next()
  }
  const url = apiMeUrl()
  if (!url) return protectedPath ? NextResponse.redirect(new URL('/login?error=auth-unavailable', req.url)) : NextResponse.next()
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }, cache: 'no-store' })
    if (!response.ok) return protectedPath ? NextResponse.redirect(new URL('/login', req.url)) : NextResponse.next()
    const { user } = await response.json()
    if (!user) return protectedPath ? NextResponse.redirect(new URL('/login', req.url)) : NextResponse.next()
    if (authPage) return NextResponse.redirect(new URL('/dashboard', req.url))
    if (pathname.startsWith('/admin') && !['ADMIN','EDITOR'].includes(user.role)) return NextResponse.redirect(new URL('/dashboard', req.url))
  } catch {
    if (protectedPath) return NextResponse.redirect(new URL('/login?error=auth-unavailable', req.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/dashboard/:path*', '/write/:path*', '/profile/:path*', '/admin/:path*', '/login', '/signup'] }
