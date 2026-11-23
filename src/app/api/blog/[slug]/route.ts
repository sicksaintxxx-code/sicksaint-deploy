import { NextRequest, NextResponse } from 'next/server';
import { getWordPressPostBySlug } from '@/lib/wordpress';

export const dynamic = 'force-dynamic';

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { article, related, isWordPressLive, error } = await getWordPressPostBySlug(slug);

    if (!isWordPressLive) {
      return NextResponse.json({ success: false, error: 'WordPress content is temporarily unavailable.' }, { status: 503 });
    }
    if (!article) {
      return NextResponse.json(
        {
          success: false,
          error: error || 'Article dispatch not found on WordPress CMS.',
          article: null,
          related: [],
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: article,
      related,
      isWordPressLive,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Error querying WordPress for post.',
      },
      { status: 500 }
    );
  }
}
