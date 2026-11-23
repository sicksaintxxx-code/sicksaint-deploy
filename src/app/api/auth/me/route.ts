import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'

export async function GET() { return NextResponse.json({ user: await getAuthUser() }) }
