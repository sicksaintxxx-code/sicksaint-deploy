import { NextRequest } from 'next/server'
import { proxyLaravel } from '@/lib/laravel-proxy'
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) { return proxyLaravel(request, 'admin/newsletter') }
export async function POST(request: NextRequest) { return proxyLaravel(request, 'newsletter') }
