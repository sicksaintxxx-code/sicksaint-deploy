import { Article, Category, Author, Tag } from './types';

/**
 * SICKSAINT — WORDPRESS REST API HEADLESS CLIENT
 *
 * Architecture:
 *   - Public Next.js Website: https://sicksaint.club
 *   - WordPress CMS Backend:  https://cms.sicksaint.club
 *   - REST API Base:          https://cms.sicksaint.club/wp-json/wp/v2
 *
 * Implements native endpoints:
 *   - GET /posts
 *   - GET /posts/{id}
 *   - GET /categories
 *   - GET /tags
 *   - GET /media/{id}
 */

export const DEFAULT_WORDPRESS_CMS_URL = 'https://cms.sicksaint.club';
export const DEFAULT_WORDPRESS_API_URL = 'https://cms.sicksaint.club/wp-json/wp/v2';

/**
 * Checks whether WordPress is actively configured via environment variables or default.
 */
export function isWordPressConfigured(): boolean {
  if (
    process.env.WORDPRESS_DISABLED === 'true' ||
    process.env.WORDPRESS_DISABLED === '1'
  ) {
    return false;
  }
  const apiUrl = process.env.WORDPRESS_API_URL;
  const siteUrl = process.env.WORDPRESS_SITE_URL;
  if (!apiUrl?.trim() && !siteUrl?.trim()) {
    return false;
  }
  if (apiUrl === 'none' || siteUrl === 'none' || apiUrl === 'disabled') {
    return false;
  }
  return true;
}

/**
 * Resolves the root WordPress site URL (e.g. https://cms.sicksaint.club).
 * Strips any appended /wp-json paths to ensure clean links for admin or discovery.
 */
export function getWordPressSiteUrl(): string {
  const envUrl =
    process.env.WORDPRESS_SITE_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ||
    process.env.WORDPRESS_API_URL ||
    DEFAULT_WORDPRESS_CMS_URL;

  let clean = envUrl.trim().replace(/\/+$/, '');
  clean = clean.replace(/\/wp-json(?:\/wp\/v2)?\/?$/, '');
  return clean || DEFAULT_WORDPRESS_CMS_URL;
}

/**
 * Normalize WP Base URL (strips trailing slashes and handles both domain or full wp-json path).
 * Defaults to: https://cms.sicksaint.club/wp-json/wp/v2
 */
export function getWordPressApiUrl(): string {
  const envUrl =
    process.env.WORDPRESS_API_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    process.env.WORDPRESS_SITE_URL ||
    DEFAULT_WORDPRESS_API_URL;

  let clean = envUrl.trim().replace(/\/+$/, '');
  if (!clean.includes('/wp-json/wp/v2')) {
    if (clean.endsWith('/wp-json')) {
      clean = `${clean}/wp/v2`;
    } else {
      clean = `${clean}/wp-json/wp/v2`;
    }
  }
  return clean;
}

/**
 * Resolves the root REST API discovery endpoint (e.g. https://cms.sicksaint.club/wp-json).
 */
export function getWordPressDiscoveryUrl(): string {
  const api = getWordPressApiUrl();
  return api.replace(/\/wp\/v2\/?$/, '');
}

const WP_TIMEOUT_MS = 6000;

export interface WordPressFetchParams {
  page?: number;
  perPage?: number;
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
  slug?: string;
  format?: string;
  order?: 'asc' | 'desc';
  orderBy?: 'date' | 'title' | 'id' | 'modified';
}

export interface WordPressPaginationResult<T> {
  data: T;
  total: number;
  totalPages: number;
  currentPage: number;
  isWordPressLive: boolean;
  error?: string;
}

/**
 * Decode HTML entities in text (e.g. &amp;, &#8217;, &#8220;, &quot;)
 */
export function decodeHtmlEntities(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8212;/g, '—')
    .replace(/&#8211;/g, '–')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…');
}

/**
 * Strip HTML tags to make a clean, readable text excerpt
 */
export function cleanExcerpt(raw: string): string {
  if (!raw) return '';
  const noTags = raw.replace(/<[^>]*>/g, '');
  return decodeHtmlEntities(noTags).trim();
}

/**
 * Estimate reading time in minutes based on average 220 words per minute
 */
export function calculateReadingTime(text: string): number {
  const words = text.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

/**
 * Safe fetch wrapper that checks Content-Type is valid JSON
 * (prevents JSON parse errors when host returns HTML landing or 503 pages)
 */
async function fetchWpJson<T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T; headers: Headers }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), WP_TIMEOUT_MS);

  try {
    const fullUrl = `${getWordPressApiUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const res = await fetch(fullUrl, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'SICKSAINT-Headless-Client/2.0',
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const textPreview = (await res.text()).slice(0, 150);
      throw new Error(`WordPress endpoint returned non-JSON response (${res.status} ${contentType}): ${textPreview}`);
    }

    if (!res.ok) {
      throw new Error(`WordPress REST API error HTTP ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();
    return { data: json as T, headers: res.headers };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Transform a raw WordPress REST API post into a SICKSAINT Article
 */
export function transformWordPressPost(post: any): Article {
  const embedded = post._embedded || {};
  const authorData = embedded.author?.[0] || {};
  const mediaData = embedded['wp:featuredmedia']?.[0] || {};
  const termsData = embedded['wp:term'] || [];

  // Categories are in taxonomy index 0
  const categoriesList = termsData[0] || [];
  const primaryCat = categoriesList[0] || { id: 1, name: 'Editorial', slug: 'editorial' };

  // Tags are in taxonomy index 1
  const tagsList: Tag[] = (termsData[1] || []).map((t: any) => ({
    id: String(t.id),
    name: decodeHtmlEntities(t.name),
    slug: t.slug,
  }));

  // Resolve best featured image URL
  const coverUrl =
    mediaData.source_url ||
    mediaData.media_details?.sizes?.large?.source_url ||
    mediaData.media_details?.sizes?.full?.source_url ||
    mediaData.media_details?.sizes?.medium_large?.source_url ||
    undefined;

  const rawContent = post.content?.rendered || '';
  const cleanTitle = decodeHtmlEntities(cleanExcerpt(post.title?.rendered || 'Untitled Dispatch'));
  const cleanExc = cleanExcerpt(post.excerpt?.rendered || rawContent.slice(0, 240));

  // Determine editorial format based on tags or category
  let format: Article['format'] = 'DISPATCH';
  const tagSlugs = tagsList.map((t) => t.slug.toLowerCase());
  if (tagSlugs.includes('investigation') || tagSlugs.includes('dossier')) {
    format = 'DOSSIER';
  } else if (tagSlugs.includes('interview') || tagSlugs.includes('dialogue')) {
    format = 'DIALOGUE';
  } else if (tagSlugs.includes('essay') || tagSlugs.includes('opinion')) {
    format = 'ESSAY';
  } else if (tagSlugs.includes('photo-essay') || tagSlugs.includes('visual')) {
    format = 'VISUAL_STORY';
  }

  return {
    id: `wp-${post.id}`,
    title: cleanTitle,
    kicker: post.meta?.kicker || `${primaryCat.name.toUpperCase()} · DISPATCH`,
    subtitle: post.meta?.subtitle || undefined,
    slug: post.slug,
    excerpt: cleanExc,
    content: rawContent,
    coverImageUrl: coverUrl,
    coverImageCaption: decodeHtmlEntities(cleanExcerpt(mediaData.caption?.rendered || '')),
    coverImageCredit: mediaData.media_details?.image_meta?.credit || '',
    format,
    status: 'PUBLISHED',
    featured: Boolean(post.sticky),
    readingTimeMinutes: calculateReadingTime(rawContent),
    viewCount: Number(post.meta?.view_count) || 0,
    publishedAt: post.date_gmt ? `${post.date_gmt}Z` : post.date || new Date().toISOString(),
    author: {
      id: String(authorData.id || 1),
      name: decodeHtmlEntities(authorData.name || 'SICKSAINT Editorial Desk'),
      title: authorData.description ? decodeHtmlEntities(authorData.description.slice(0, 60)) : 'Staff Correspondent',
      avatarUrl: authorData.avatar_urls?.['96'] || undefined,
      bio: authorData.description
        ? decodeHtmlEntities(authorData.description)
        : 'Contributing writer for SICKSAINT.',
    },
    category: {
      id: String(primaryCat.id),
      name: decodeHtmlEntities(primaryCat.name),
      slug: primaryCat.slug,
      description: primaryCat.description ? decodeHtmlEntities(primaryCat.description) : '',
    },
    tags: tagsList,
  };
}

/**
 * 1. GET /posts — Retrieve paginated WordPress posts
 */
export async function getWordPressPosts(
  params: WordPressFetchParams = {}
): Promise<WordPressPaginationResult<Article[]>> {
  try {
    const query = new URLSearchParams();
    query.set('_embed', 'true');
    query.set('status', 'publish');
    query.set('per_page', String(params.perPage || 10));
    query.set('page', String(params.page || 1));
    query.set('order', params.order || 'desc');
    query.set('orderby', params.orderBy || 'date');

    if (params.category) {
      if (/^\d+$/.test(params.category)) query.set('categories', params.category);
      else {
        const { data: matches } = await fetchWpJson<any[]>(`/categories?slug=${encodeURIComponent(params.category)}`, {
          next: { revalidate: 120, tags: ['wordpress-categories'] },
        });
        if (!Array.isArray(matches)) throw new Error('WordPress category lookup returned an invalid payload.');
        if (matches.length === 0) return { data: [], total: 0, totalPages: 0, currentPage: params.page || 1, isWordPressLive: true };
        query.set('categories', String(matches[0].id));
      }
    }
    if (params.tag) {
      if (/^\d+$/.test(params.tag)) query.set('tags', params.tag);
      else {
        const { data: matches } = await fetchWpJson<any[]>(`/tags?slug=${encodeURIComponent(params.tag)}`, {
          next: { revalidate: 120, tags: ['wordpress-tags'] },
        });
        if (!Array.isArray(matches)) throw new Error('WordPress tag lookup returned an invalid payload.');
        if (matches.length === 0) return { data: [], total: 0, totalPages: 0, currentPage: params.page || 1, isWordPressLive: true };
        query.set('tags', String(matches[0].id));
      }
    }
    if (params.search) query.set('search', params.search);
    if (params.slug) query.set('slug', params.slug);
    if (params.author) query.set('author', params.author);

    const { data: rawPosts, headers } = await fetchWpJson<any[]>(`/posts?${query.toString()}`, {
      next: { revalidate: 30, tags: ['wordpress-posts'] },
    });

    if (!Array.isArray(rawPosts)) {
      throw new Error('WordPress posts payload is not an array.');
    }

    const total = parseInt(headers.get('x-wp-total') || '0', 10) || rawPosts.length;
    const totalPages = parseInt(headers.get('x-wp-totalpages') || '1', 10) || 1;
    const articles = rawPosts.map(transformWordPressPost);

    return {
      data: articles,
      total,
      totalPages,
      currentPage: params.page || 1,
      isWordPressLive: true,
    };
  } catch (error: any) {
    console.warn('[WordPress REST API] GET /posts Notice:', error?.message);
    return {
      data: [],
      total: 0,
      totalPages: 0,
      currentPage: params.page || 1,
      isWordPressLive: false,
      error: error?.message || 'WordPress connection offline or initializing.',
    };
  }
}

/** Fetch the complete published archive in WordPress-sized pages. Use for sitemap generation, not request-time page rendering. */
export async function getAllWordPressPosts(): Promise<WordPressPaginationResult<Article[]>> {
  const firstPage = await getWordPressPosts({ page: 1, perPage: 100 })
  if (!firstPage.isWordPressLive || firstPage.totalPages <= 1) return firstPage

  const pages: Article[][] = [firstPage.data]
  for (let start = 2; start <= firstPage.totalPages; start += 5) {
    const batch = await Promise.all(
      Array.from({ length: Math.min(5, firstPage.totalPages - start + 1) }, (_, index) =>
        getWordPressPosts({ page: start + index, perPage: 100 })
      )
    )
    if (batch.some((page) => !page.isWordPressLive)) {
      return { ...firstPage, data: [], isWordPressLive: false, error: 'Could not retrieve every WordPress archive page.' }
    }
    pages.push(...batch.map((page) => page.data))
  }

  return { ...firstPage, data: pages.flat(), total: firstPage.total, totalPages: firstPage.totalPages }
}

/**
 * 2. GET /posts?slug={slug} — Retrieve a single post by slug with related posts
 */
export async function getWordPressPostBySlug(slug: string): Promise<{
  article: Article | null;
  related: Article[];
  isWordPressLive: boolean;
  error?: string;
}> {
  try {
    const { data: posts } = await getWordPressPosts({ slug, perPage: 1 });
    if (posts.length > 0) {
      const article = posts[0];

      // Fetch up to 3 related posts
      let related: Article[] = [];
      try {
        const relatedRes = await getWordPressPosts({
          perPage: 4,
          category: article.category.id !== '1' ? article.category.id : undefined,
        });
        related = relatedRes.data.filter((a) => a.slug !== slug).slice(0, 3);
      } catch {
        related = [];
      }

      return {
        article,
        related,
        isWordPressLive: true,
      };
    }

    return {
      article: null,
      related: [],
      isWordPressLive: true,
    };
  } catch (error: any) {
    return {
      article: null,
      related: [],
      isWordPressLive: false,
      error: error?.message,
    };
  }
}

/**
 * 3. GET /posts/{id} — Retrieve a single post by numeric ID
 */
export async function getWordPressPostById(id: number | string): Promise<{
  article: Article | null;
  isWordPressLive: boolean;
}> {
  try {
    const { data: rawPost } = await fetchWpJson<any>(`/posts/${id}?_embed=true`, {
      next: { revalidate: 30 },
    });

    if (rawPost && rawPost.id) {
      return {
        article: transformWordPressPost(rawPost),
        isWordPressLive: true,
      };
    }
    return { article: null, isWordPressLive: true };
  } catch {
    return { article: null, isWordPressLive: false };
  }
}

/**
 * 4. GET /categories — Retrieve all WordPress categories
 */
export async function getWordPressCategories(): Promise<Category[]> {
  try {
    const { data: rawCats } = await fetchWpJson<any[]>('/categories?per_page=100&hide_empty=false', {
      next: { revalidate: 120, tags: ['wordpress-categories'] },
    });

    if (!Array.isArray(rawCats)) return [];

    return rawCats.map((c: any) => ({
      id: String(c.id),
      name: decodeHtmlEntities(c.name),
      slug: c.slug,
      description: decodeHtmlEntities(c.description || ''),
      articleCount: c.count,
    }));
  } catch (error: any) {
    console.warn('[WordPress REST API] GET /categories Notice:', error?.message);
    return [];
  }
}

/**
 * 5. GET /tags — Retrieve all WordPress tags
 */
export async function getWordPressTags(): Promise<Tag[]> {
  try {
    const { data: rawTags } = await fetchWpJson<any[]>('/tags?per_page=100&hide_empty=false', {
      next: { revalidate: 120, tags: ['wordpress-tags'] },
    });

    if (!Array.isArray(rawTags)) return [];

    return rawTags.map((t: any) => ({
      id: String(t.id),
      name: decodeHtmlEntities(t.name),
      slug: t.slug,
    }));
  } catch (error: any) {
    console.warn('[WordPress REST API] GET /tags Notice:', error?.message);
    return [];
  }
}

/**
 * 6. GET /media/{id} — Retrieve media details by ID
 */
export async function getWordPressMedia(mediaId: number | string): Promise<any | null> {
  try {
    const { data: media } = await fetchWpJson<any>(`/media/${mediaId}`, {
      next: { revalidate: 300 },
    });
    return media;
  } catch (error: any) {
    console.warn('[WordPress REST API] GET /media/{id} Notice:', error?.message);
    return null;
  }
}
