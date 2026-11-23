import { NextRequest } from 'next/server'
import { proxyLaravel } from '@/lib/laravel-proxy'
export async function GET(request: NextRequest) { return proxyLaravel(request, 'submissions') }
export async function POST(request: NextRequest) { return proxyLaravel(request, 'submissions') }
