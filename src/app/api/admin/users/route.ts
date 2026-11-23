import { NextRequest, NextResponse } from 'next/server'
import { proxyLaravel } from '@/lib/laravel-proxy'
export async function GET(request: NextRequest) { return proxyLaravel(request, 'admin/users') }
export async function PATCH(request: NextRequest) {
  let payload: Record<string, unknown>
  try { payload = await request.clone().json() } catch { return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 }) }
  if (typeof payload.userId !== 'string' || typeof payload.role !== 'string') return NextResponse.json({ error: 'userId and role are required.' }, { status: 400 })
  return proxyLaravel(request, `admin/users/${encodeURIComponent(payload.userId)}`)
}
