import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAME, getAuthCookieOptions, getLaravelApiUrl } from '@/lib/auth'

export async function POST() {
  const token = (await cookies()).get(COOKIE_NAME)?.value
  const endpoint = getLaravelApiUrl('auth/logout')
  if (token && endpoint) await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }, cache: 'no-store' }).catch(() => undefined)
  const response = NextResponse.json({ success: true })
  response.cookies.set({ ...getAuthCookieOptions(), value: '', maxAge: 0 })
  return response
}
