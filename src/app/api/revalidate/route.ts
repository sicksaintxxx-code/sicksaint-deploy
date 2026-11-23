import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * SICKSAINT Secure WordPress Revalidation Webhook
 * 
 * Invoked by WordPress when a post, page, or category is published/updated.
 * Validates secret token to prevent unauthorized cache purging.
 */
export async function POST(req: NextRequest) {
  try {
    const expectedSecret = process.env.WORDPRESS_WEBHOOK_SECRET;
    const secret = req.headers.get('x-webhook-secret');

    // If a webhook secret is set in environment, enforce strict verification
    if (!expectedSecret || expectedSecret.length < 32) {
      return NextResponse.json({ success: false, error: 'Webhook is not configured.' }, { status: 503 });
    }
    if (!secret || secret.length !== expectedSecret.length || !safeEqual(secret, expectedSecret)) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing webhook secret token.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const slugValue = body.slug || body.post?.post_name;
    const slug = typeof slugValue === 'string' && /^[a-z0-9-]{1,200}$/.test(slugValue) ? slugValue : undefined;
    const category = typeof body.category === 'string' && /^[a-z0-9-]{1,100}$/.test(body.category) ? body.category : undefined;
    const path = slug ? `/article/${slug}` : '/';

    // Revalidate post-specific tag and general paths
    revalidateTag('wordpress-posts');
    revalidatePath('/');
    revalidatePath('/latest');
    revalidatePath('/trending');
    revalidatePath('/category/[slug]', 'page');
    revalidatePath('/blog');
    revalidatePath('/sitemap.xml');
    if (slug) {
      revalidatePath(`/article/${slug}`);
    }
    if (category) revalidatePath(`/category/${category}`);

    return NextResponse.json({
      success: true,
      revalidated: true,
      path,
      timestamp: new Date().toISOString(),
      message: `Cache revalidated successfully for ${path}.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Revalidation failure' },
      { status: 500 }
    );
  }
}

function safeEqual(left: string, right: string): boolean {
  // Fixed-time comparison without pulling secrets into a URL or response.
  let difference = 0;
  for (let index = 0; index < right.length; index++) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405, headers: { Allow: 'POST' } });
}
