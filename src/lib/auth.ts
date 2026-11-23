import { cookies } from 'next/headers'

export const COOKIE_NAME = 'ss_auth'
const API_BASE = process.env.LARAVEL_API_URL?.replace(/\/$/, '')

function apiUrl(path: string) {
  if (!API_BASE) return null
  return `${API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`}/${path.replace(/^\//, '')}`
}

export interface AuthUser {
  userId: string; id: string; email: string; username: string; role: string; name: string
  avatarUrl?: string | null; bio?: string | null; title?: string | null; location?: string | null
  website?: string | null; twitter?: string | null; emailVerified?: boolean
}

export async function getAuthToken() {
  return (await cookies()).get(COOKIE_NAME)?.value ?? null
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const token = await getAuthToken()
    const url = apiUrl('auth/me')
    if (!token || !url) return null
    const response = await fetch(url, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }, cache: 'no-store' })
    if (!response.ok) return null
    const payload = await response.json()
    const user = payload.user
    return user ? { ...user, id: String(user.id), userId: String(user.id) } : null
  } catch { return null }
}

export function getAuthCookieOptions() {
  return { name: COOKIE_NAME, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, maxAge: 60 * 60 * 24 * 7, path: '/' }
}

export function getLaravelApiUrl(path: string) { return apiUrl(path) }
