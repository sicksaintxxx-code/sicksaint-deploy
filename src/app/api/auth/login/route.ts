import { NextRequest } from 'next/server'
import { laravelAuthAction } from '@/lib/laravel-proxy'

export async function POST(request: NextRequest) { return laravelAuthAction(request, 'auth/login') }
