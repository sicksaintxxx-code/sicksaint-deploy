import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import { getWordPressPosts, getWordPressCategories, getWordPressApiUrl, getWordPressSiteUrl } from '@/lib/wordpress';
import { Article } from '@/lib/types';

export const revalidate = 30;

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
    tag?: string;
  }>;
}

export async function generateMetadata({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const category = params.category || '';
  const search = params.search || '';

  let title = 'The Journal & Dispatches — SICKSAINT';
  let description =
    'Live editorial dispatches, cultural investigations, and critical essays published directly from the SICKSAINT WordPress newsroom.';

  if (search) {
    title = `Search: "${search}" — SICKSAINT Journal`;
    description = `WordPress posts matching "${search}" on SICKSAINT.`;
  } else if (category) {
    title = `Category: ${category} — SICKSAINT Journal`;
    description = `Editorial dispatches in the ${category} category from SICKSAINT.`;
  } else if (page > 1) {
    title = `The Journal & Dispatches — Page ${page} — SICKSAINT`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function BlogArchivePage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const category = params.category || undefined;
  const search = params.search || undefined;
  const tag = params.tag || undefined;

  const [postsResult, categories] = await Promise.all([
    getWordPressPosts({ page, perPage: 9, category, search, tag }),
    getWordPressCategories(),
  ]);

  const { data: articles, total, totalPages, isWordPressLive, error } = postsResult;

  // Build pagination query helper
  function buildPageUrl(p: number) {
    const params = new URLSearchParams();
    params.set('page', String(p));
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (tag) params.set('tag', tag);
    return `/blog?${params.toString()}`;
  }

  // JSON-LD structured data — ItemList of articles
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'SICKSAINT Journal & Dispatches',
    description:
      'Editorial dispatches and critical essays from SICKSAINT via WordPress REST API.',
    url: 'https://sicksaint.club/blog',
    numberOfItems: total,
    itemListElement: articles.map((article: Article, index: number) => ({
      '@type': 'ListItem',
      position: (page - 1) * 9 + index + 1,
      item: {
        '@type': 'NewsArticle',
        headline: article.title,
        description: article.excerpt,
        url: `https://sicksaint.club/blog/${article.slug}`,
        image: article.coverImageUrl || undefined,
        datePublished: article.publishedAt,
        author: {
          '@type': 'Person',
          name: article.author.name,
        },
      },
    })),
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. EDITORIAL HEADER */}
      <header className="border-b border-brand-border bg-brand-secondary/40 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb & CMS Status */}
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] tracking-widest uppercase mb-4 text-brand-textMuted">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-brand-accent transition-colors">
                SICKSAINT
              </Link>
              <span>/</span>
              <span className="text-brand-accent">WORDPRESS JOURNAL</span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 ${
                  isWordPressLive ? 'bg-brand-burgundy animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-brand-textSubtle">
                CMS:{' '}
                <strong className="text-brand-text">
                  {getWordPressApiUrl()}/
                </strong>
              </span>
            </div>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-brand-text tracking-tight mb-4">
            The Journal &amp; Dispatches
          </h1>

          <p className="max-w-3xl text-sm sm:text-base text-brand-textMuted font-sans leading-relaxed">
            Live editorial dispatches, cultural investigations, and critical essays published
            directly from the SICKSAINT WordPress newsroom. Synchronized automatically via native
            REST API without noise.
          </p>

          {/* Category filter row */}
          {categories.length > 0 && (
            <div className="mt-8 pt-8 border-t border-brand-border/60 flex flex-wrap gap-2 items-center">
              <span className="font-mono text-[11px] tracking-widest uppercase text-brand-textSubtle mr-2">
                Filter:
              </span>
              <Link
                href="/blog"
                className={`px-3 py-1 font-mono text-[11px] tracking-wider uppercase border transition-colors ${
                  !category
                    ? 'border-brand-accent text-brand-accent bg-brand-accent/5'
                    : 'border-brand-border text-brand-textMuted hover:border-brand-accent hover:text-brand-accent'
                }`}
              >
                ALL
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog?category=${cat.slug}`}
                  className={`px-3 py-1 font-mono text-[11px] tracking-wider uppercase border transition-colors ${
                    category === cat.slug
                      ? 'border-brand-accent text-brand-accent bg-brand-accent/5'
                      : 'border-brand-border text-brand-textMuted hover:border-brand-accent hover:text-brand-accent'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {/* Search bar (links to ?search=) */}
          <form method="GET" action="/blog" className="mt-4 flex gap-2 max-w-md">
            {category && <input type="hidden" name="category" value={category} />}
            <input
              type="text"
              name="search"
              defaultValue={search || ''}
              placeholder="Search WordPress posts..."
              className="flex-1 bg-brand-card border border-brand-border px-4 py-2.5 font-mono text-xs text-brand-text placeholder-brand-textSubtle focus:outline-none focus:border-brand-accent transition-colors"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-brand-card border border-brand-border hover:border-brand-accent font-mono text-xs text-brand-text hover:text-brand-accent transition-colors tracking-widest uppercase"
            >
              SEARCH
            </button>
          </form>

          {/* Telemetry */}
          <div className="mt-4 font-mono text-xs text-brand-textSubtle">
            Showing <strong className="text-brand-text">{articles.length}</strong> of{' '}
            <strong className="text-brand-accent">{total}</strong> transmissions
            {search && (
              <span>
                {' '}for &quot;<span className="text-brand-text">{search}</span>&quot;
              </span>
            )}
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* CMS Connecting Notice */}
        {!isWordPressLive && (
          <div className="mb-8 p-5 border border-amber-500/40 bg-amber-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                  CMS Connecting…
                </h4>
                <p className="font-mono text-xs text-brand-textMuted leading-relaxed">
                  {error ||
                    'The WordPress REST API is initializing. Content will appear automatically once the connection is established.'}
                </p>
                <p className="font-mono text-[11px] text-brand-textSubtle mt-1">
                  Target:{' '}
                  <code className="text-brand-accent">
                    {getWordPressApiUrl()}/posts
                  </code>
                </p>
              </div>
            </div>
            <a
              href={`${getWordPressSiteUrl()}/wp-admin`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-amber-500/60 text-amber-400 hover:bg-amber-500/10 font-mono text-xs font-bold tracking-widest uppercase transition-colors shrink-0"
            >
              OPEN WP ADMIN
            </a>
          </div>
        )}

        {/* Empty state */}
        {articles.length === 0 ? (
          <div className="border border-dashed border-brand-border p-12 sm:p-16 text-center bg-brand-card/40 my-8">
            <BookOpen className="w-10 h-10 text-brand-accent/60 mx-auto mb-4" />
            <h3 className="font-serif text-2xl text-brand-text font-bold mb-2">
              No WordPress Transmissions Found
            </h3>
            <p className="max-w-lg mx-auto font-mono text-xs text-brand-textMuted leading-relaxed mb-6">
              There are currently no published posts matching your criteria at{' '}
              <span className="text-brand-accent">https://sicksaint.club</span>. When you publish
              new articles in your WordPress admin dashboard, they will automatically appear here.
            </p>
            <Link
              href="/blog"
              className="px-4 py-2 bg-brand-burgundy text-white font-condensed text-xs font-bold tracking-widest uppercase hover:bg-brand-burgundy/80 transition-colors"
            >
              RESET FILTERS
            </Link>
          </div>
        ) : (
          /* Article Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: Article) => {
              const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                timeZone: 'UTC',
              });

              return (
                <article
                  key={article.id}
                  className="group flex flex-col justify-between border border-brand-border bg-brand-card hover:border-brand-accent/60 transition-all duration-300 hover:shadow-2xl overflow-hidden"
                >
                  <div>
                    {/* Featured Image */}
                    <Link
                      href={`/blog/${article.slug}`}
                      className="block relative aspect-[16/10] overflow-hidden bg-brand-secondary"
                    >
                      {article.coverImageUrl ? (
                        <img
                          src={article.coverImageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          width={640}
                          height={400}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono text-xs text-brand-textSubtle bg-brand-secondary">
                          SICKSAINT ARCHIVE
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-transparent to-transparent opacity-60" />
                      <span className="absolute top-3 left-3 px-2 py-1 bg-black/80 backdrop-blur-sm border border-brand-accent/40 font-mono text-[10px] font-bold tracking-widest text-brand-accent uppercase">
                        {article.category?.name || 'EDITORIAL'}
                      </span>
                    </Link>

                    {/* Text Details */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 font-mono text-[11px] text-brand-textSubtle uppercase tracking-wider mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-brand-accent" />
                          {formattedDate}
                        </div>
                        <span>·</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readingTimeMinutes} MIN READ
                        </div>
                      </div>

                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-text group-hover:text-brand-accent transition-colors leading-snug mb-3 line-clamp-2">
                        <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                      </h2>

                      {article.excerpt && (
                        <p className="font-sans text-xs sm:text-sm text-brand-textMuted leading-relaxed line-clamp-3 mb-6">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 pb-6 pt-2 border-t border-brand-border/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {article.author?.avatarUrl && (
                        <img
                          src={article.author.avatarUrl}
                          alt={article.author.name}
                          className="w-6 h-6 rounded-full object-cover border border-brand-border"
                          loading="lazy"
                          width={24}
                          height={24}
                        />
                      )}
                      <span className="font-mono text-xs text-brand-textMuted group-hover:text-brand-text transition-colors">
                        {article.author?.name || 'SICKSAINT Staff'}
                      </span>
                    </div>

                    <Link
                      href={`/blog/${article.slug}`}
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider text-brand-accent hover:text-white transition-colors uppercase"
                    >
                      <span>READ ARTICLE</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* 3. PAGINATION — Server-rendered links */}
        {totalPages > 1 && (
          <nav
            aria-label="Blog pagination"
            className="mt-16 border-t border-brand-border pt-10 flex flex-wrap items-center justify-center gap-2"
          >
            {page > 1 && (
              <Link
                href={buildPageUrl(page - 1)}
                className="px-4 py-2.5 border border-brand-border bg-brand-card hover:border-brand-accent hover:text-brand-accent font-mono text-xs tracking-widest uppercase transition-colors"
              >
                ← PREV
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={buildPageUrl(p)}
                aria-current={p === page ? 'page' : undefined}
                className={`px-4 py-2.5 border font-mono text-xs tracking-widest uppercase transition-colors ${
                  p === page
                    ? 'border-brand-accent bg-brand-accent text-brand-bg'
                    : 'border-brand-border bg-brand-card hover:border-brand-accent hover:text-brand-accent'
                }`}
              >
                {p}
              </Link>
            ))}

            {page < totalPages && (
              <Link
                href={buildPageUrl(page + 1)}
                className="px-4 py-2.5 border border-brand-border bg-brand-card hover:border-brand-accent hover:text-brand-accent font-mono text-xs tracking-widest uppercase transition-colors"
              >
                NEXT →
              </Link>
            )}
          </nav>
        )}
      </main>
    </div>
  );
}
