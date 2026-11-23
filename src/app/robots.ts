import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sicksaint.club';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/feed/rss'],
        disallow: ['/admin/', '/dashboard/', '/write/', '/profile/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
