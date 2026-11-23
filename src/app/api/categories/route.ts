import { NextResponse } from 'next/server'
import { getWordPressCategories } from '@/lib/wordpress'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ success: true, data: await getWordPressCategories() })
}
