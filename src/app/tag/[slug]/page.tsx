import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Tag as TagIcon } from 'lucide-react';
import { fetchArticles } from '../../../lib/api';
import ArticleCard from '../../../components/ArticleCard';
import NewsletterModal from '../../../components/NewsletterModal';

export const revalidate = 60;

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps) {
  const { slug } = await params;
  const tagName = slug.replace(/-/g, ' ').toUpperCase();
  return {
    title: `#${tagName} — Editorial Tag Archive | SICKSAINT`,
    description: `Dispatches and investigative reports filed under #${tagName} on SICKSAINT.`,
    alternates: { canonical: `/tag/${encodeURIComponent(slug)}` },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const { articles } = await fetchArticles();
  const tagSlug = slug.toLowerCase();

  const matchedArticles = articles.filter((a) =>
    a.tags?.some((t) => t.slug.toLowerCase() === tagSlug) ||
    a.title.toLowerCase().includes(tagSlug.replace(/-/g, ' ')) ||
    a.excerpt.toLowerCase().includes(tagSlug.replace(/-/g, ' '))
  );

  const displayTagName = tagSlug.replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Navigation back */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-brand-textMuted hover:text-brand-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO FRONT PAGE</span>
          </Link>
        </div>

        {/* Tag Header */}
        <div className="border-b border-brand-border pb-8 mb-12">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-brand-accent uppercase mb-2">
            <TagIcon className="w-3.5 h-3.5" />
            <span>CURATED TOPICAL TAG ARCHIVE</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-black text-brand-text tracking-tight uppercase">
            #{displayTagName}
          </h1>
          <p className="mt-4 text-sm sm:text-base font-serif text-brand-textMuted max-w-2xl">
            Cross-departmental dispatches, dossiers, and photo essays tagged under <span className="text-brand-accent">#{displayTagName}</span>.
          </p>
          <div className="mt-4 text-xs font-mono text-brand-textSubtle">
            {matchedArticles.length} ARTICLES CURRENTLY INDEXED
          </div>
        </div>

        {/* Articles Grid */}
        {matchedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matchedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="secondary" />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-brand-surface border border-brand-border p-8">
            <h3 className="font-serif text-2xl font-bold text-brand-text">No articles found under this tag</h3>
            <p className="mt-2 text-xs font-mono text-brand-textMuted">
              Check back as more dispatches are syndicated from the WordPress CMS archive.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block px-5 py-2.5 bg-brand-accent text-brand-bg font-mono text-xs font-bold tracking-widest"
            >
              EXPLORE FRONT PAGE
            </Link>
          </div>
        )}
      </div>

      <NewsletterModal />
    </div>
  );
}
