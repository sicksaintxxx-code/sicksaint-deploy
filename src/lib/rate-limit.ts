/**
 * In-memory rate limiter for auth endpoints.
 * Resets on server restart (acceptable for dev/small-scale prod).
 * For production at scale, replace with Redis-backed limiter.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up stale entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    store.forEach((entry, key) => {
      if (now > entry.resetAt) store.delete(key)
    })
  }, 5 * 60 * 1000)
}

/**
 * Check and increment rate limit for a given key.
 * @param key      Unique key (e.g. IP + endpoint)
 * @param limit    Max allowed requests in window
 * @param windowMs Window duration in milliseconds
 * @returns { allowed: boolean, remaining: number, resetAt: number }
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  let entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs }
    store.set(key, entry)
  }

  entry.count++
  const remaining = Math.max(0, limit - entry.count)
  const allowed = entry.count <= limit

  return { allowed, remaining, resetAt: entry.resetAt }
}

/**
 * Extract the real client IP from a Next.js request.
 */
export function getClientIp(req: Request): string {
  const headers = req instanceof Request ? req.headers : (req as any).headers
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  )
}
