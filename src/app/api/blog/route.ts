import { NextRequest, NextResponse } from 'next/server';
import { getWordPressPosts, getWordPressCategories } from '@/lib/wordpress';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get('per_page') || searchParams.get('limit') || '9', 10) || 9));
    const category = searchParams.get('category') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const search = searchParams.get('search') || searchParams.get('q') || undefined;

    const result = await getWordPressPosts({
      page,
      perPage,
      category,
      tag,
      search,
    });

    return NextResponse.json({
      success: result.isWordPressLive,
      data: result.data,
      pagination: {
        total: result.total,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        perPage,
      },
      isWordPressLive: result.isWordPressLive,
      ...(result.error ? { error: 'WordPress content is temporarily unavailable.' } : {}),
    }, { status: result.isWordPressLive ? 200 : 503 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to retrieve blog dispatches from WordPress.',
        data: [],
      },
      { status: 500 }
    );
  }
}
