import { NextRequest } from 'next/server'
import { proxyLaravel } from '@/lib/laravel-proxy'
type Context = { params: Promise<{ id: string }> }
export async function POST(request: NextRequest, context: Context) { const { id } = await context.params; return proxyLaravel(request, `submissions/${encodeURIComponent(id)}/review`) }
