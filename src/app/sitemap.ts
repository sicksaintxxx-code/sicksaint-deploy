import { MetadataRoute } from 'next';
import { getAllWordPressPosts, getWordPressCategories } from '../lib/wordpress';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sicksaint.club';
  const [archive, categories] = await Promise.all([getAllWordPressPosts(), getWordPressCategories()]);
  const articles = archive.data;

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/blog',
    '/latest',
    '/trending',
    '/editors-picks',
    '/long-reads',
    '/investigations',
    '/interviews',
    '/opinion',
    '/reviews',
    '/guides',
    '/explained',
    '/photo-essays',
    '/newsletter',
    '/manifesto',
    '/about',
    '/editorial-standards',
    '/contact',
    '/advertise',
    '/privacy',
    '/terms',
    '/cookies',
    '/accessibility',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' || route === '/latest' ? 'hourly' : 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Category routes
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // Article routes
  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/article/${article.slug}`,
    lastModified: article.publishedAt,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const authorSlugs = Array.from(new Set(articles.map((article) => article.author.name.toLowerCase().replace(/\s+/g, '-'))));
  const authorRoutes: MetadataRoute.Sitemap = authorSlugs.map((slug) => ({
    url: `${baseUrl}/author/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));
  const tagSlugs = Array.from(new Set(articles.flatMap((article) => article.tags || []).map((tag) => tag.slug)));
  const tagRoutes: MetadataRoute.Sitemap = tagSlugs.map((slug) => ({
    url: `${baseUrl}/tag/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes, ...authorRoutes, ...tagRoutes];
}
