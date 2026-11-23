import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAME, getLaravelApiUrl } from '@/lib/auth'

export async function proxyLaravel(request: NextRequest, endpoint: string) {
  const target = getLaravelApiUrl(endpoint)
  if (!target) return NextResponse.json({ error: 'Laravel API is not configured.' }, { status: 503 })
  const token = (await cookies()).get(COOKIE_NAME)?.value
  const headers = new Headers({ Accept: 'application/json' })
  const contentType = request.headers.get('content-type')
  if (contentType) headers.set('Content-Type', contentType)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const url = new URL(target)
  url.search = new URL(request.url).search
  const method = request.method.toUpperCase()
  const response = await fetch(url, { method, headers, body: method === 'GET' || method === 'HEAD' ? undefined : await request.arrayBuffer(), cache: 'no-store' })
  const body = await response.arrayBuffer()
  const outHeaders = new Headers()
  const responseType = response.headers.get('content-type')
  if (responseType) outHeaders.set('content-type', responseType)
  return new NextResponse(body, { status: response.status, headers: outHeaders })
}

export async function laravelAuthAction(request: NextRequest, endpoint: 'auth/login' | 'auth/register') {
  const target = getLaravelApiUrl(endpoint)
  if (!target) return NextResponse.json({ error: 'Laravel API is not configured.' }, { status: 503 })
  let body: Record<string, unknown>
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 }) }
  if (endpoint === 'auth/login') body.identifier = body.identifier || body.email
  const response = await fetch(target, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(body), cache: 'no-store' })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const detail = payload.errors ? Object.values(payload.errors).flat()[0] : undefined
    return NextResponse.json({ ...payload, error: payload.error || payload.message || detail || 'Authentication request failed.' }, { status: response.status })
  }
  const token = payload.accessToken
  if (!token || !payload.user) return NextResponse.json({ error: 'Laravel returned an incomplete authentication response.' }, { status: 502 })
  const result = NextResponse.json({ user: payload.user }, { status: response.status })
  const options = { name: COOKIE_NAME, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, maxAge: 60 * 60 * 24 * 7, path: '/' }
  result.cookies.set(options.name, token, options)
  return result
}
