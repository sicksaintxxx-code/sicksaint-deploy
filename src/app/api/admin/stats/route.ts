import { NextRequest } from 'next/server'
import { proxyLaravel } from '@/lib/laravel-proxy'
export async function GET(request: NextRequest) { return proxyLaravel(request, 'admin/stats') }
