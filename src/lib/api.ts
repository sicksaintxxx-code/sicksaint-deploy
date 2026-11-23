import { Article, Category, Edition } from './types';

// Comprehensive, realistic demonstration editorial archive
export async function fetchArticles(params: {
  category?: string;
  format?: string;
  search?: string;
  limit?: number;
  page?: number;
} = {}): Promise<{ articles: Article[]; total: number }> {
  if (typeof window === 'undefined') {
    try {
      const { getWordPressPosts } = await import('./wordpress');
      const result = await getWordPressPosts({ page: params.page || 1, perPage: Math.min(params.limit || 50, 100), category: params.category, search: params.search });
      const articles = params.format ? result.data.filter((article) => article.format === params.format?.toUpperCase()) : result.data;
      return { articles, total: params.format ? articles.length : result.total };
    } catch {
      return { articles: [], total: 0 };
    }
  }

  // Client-side execution
  try {
    const query = new URLSearchParams();
    if (params.category) query.set('category', params.category);
    if (params.format) query.set('format', params.format);
    if (params.search) query.set('search', params.search);
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.page) query.set('page', params.page.toString());

    const res = await fetch(`/api/articles?${query.toString()}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('API fetch failed');
    const json = await res.json();
    return { articles: json.data, total: json.pagination.total };
  } catch {
    return { articles: [], total: 0 };
  }
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  if (typeof window === 'undefined') {
    try {
      const { getWordPressPostBySlug } = await import('./wordpress');
      const result = await getWordPressPostBySlug(slug);
      return result.article ? { ...result.article, related: result.related } : null;
    } catch {
      return null;
    }
  }

  try {
    const res = await fetch(`/api/articles/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('API fetch failed');
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  if (typeof window === 'undefined') {
    try {
      const { getWordPressCategories } = await import('./wordpress');
      return await getWordPressCategories();
    } catch { return []; }
  }
  try {
    const res = await fetch('/api/categories', { next: { revalidate: 120 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch { return []; }
}

export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    return { success: res.ok, message: data.message || data.error };
  } catch (err: any) {
    return { success: false, message: 'Subscription could not be completed. Please try again later.' };
  }
}
