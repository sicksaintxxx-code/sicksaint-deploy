import { NextRequest } from 'next/server'
import { proxyLaravel } from '@/lib/laravel-proxy'
export async function POST(request: NextRequest) { return proxyLaravel(request, 'auth/reset-password') }
