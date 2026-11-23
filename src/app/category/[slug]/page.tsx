import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Filter, Layers } from 'lucide-react';
import { fetchArticles, fetchCategories } from '../../../lib/api';
import ArticleCard from '../../../components/ArticleCard';
import NewsletterModal from '../../../components/NewsletterModal';

export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ format?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = await fetchCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return { title: 'Section — SICKSAINT' };
  return {
    title: `${cat.name} — SICKSAINT: The World, Without The Noise`,
    description: cat.description || `Read SICKSAINT's comprehensive coverage on ${cat.name}.`,
    alternates: { canonical: `/category/${encodeURIComponent(slug)}` },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const search = await searchParams;
  const categories = await fetchCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const { articles, total } = await fetchArticles({
    category: slug,
    format: search.format,
    limit: 20,
  });

  const formats = [
    { label: 'ALL FORMATS', value: '' },
    { label: 'DISPATCHES', value: 'DISPATCH' },
    { label: 'DOSSIERS', value: 'DOSSIER' },
    { label: 'DIALOGUES', value: 'DIALOGUE' },
    { label: 'ESSAYS', value: 'ESSAY' },
  ];

  const leadArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Category Masthead */}
      <div className="border-b border-brand-border pb-10 mb-12">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-brand-textMuted hover:text-brand-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO FRONT PAGE</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-brand-accent uppercase">
              [DEPARTMENT ARCHIVE · {category.slug.toUpperCase()}]
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-brand-text tracking-tight mt-2">
              {category.name}
            </h1>
          </div>
          <span className="text-xs font-mono text-brand-textSubtle sm:text-right">
            {total} ARTICLES ARCHIVED
          </span>
        </div>

        {category.description && (
          <p className="mt-4 text-base sm:text-lg text-brand-textMuted font-serif max-w-3xl leading-relaxed">
            {category.description}
          </p>
        )}

        {/* Format Sub-navigation Filter Bar */}
        <div className="mt-8 pt-6 border-t border-brand-border flex items-center space-x-2 sm:space-x-3 overflow-x-auto text-xs font-mono">
          <span className="text-[11px] font-bold text-brand-textSubtle uppercase mr-2 hidden sm:inline">
            FILTER:
          </span>
          {formats.map((fmt) => {
            const isSelected = (!search.format && fmt.value === '') || search.format === fmt.value;
            return (
              <Link
                key={fmt.label}
                href={fmt.value ? `/category/${slug}?format=${fmt.value}` : `/category/${slug}`}
                className={`px-3.5 py-1.5 transition-colors border ${
                  isSelected
                    ? 'bg-brand-accent text-brand-bg border-brand-accent font-bold'
                    : 'text-brand-textMuted border-brand-border hover:border-brand-accent hover:text-brand-text bg-brand-surface'
                }`}
              >
                {fmt.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Article Listing Grid */}
      {articles.length === 0 ? (
        <div className="py-20 text-center font-mono text-sm text-brand-textMuted border border-brand-border bg-brand-surface p-12">
          No dispatches found under this format criteria. Check back shortly.
        </div>
      ) : (
        <div className="space-y-12">
          {/* Lead Category Article (If available) */}
          {leadArticle && (
            <div className="mb-12">
              <ArticleCard article={leadArticle} variant="hero-cover" />
            </div>
          )}

          {/* Remaining Articles Grid */}
          {remainingArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingArticles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="secondary" />
              ))}
            </div>
          )}
        </div>
      )}

      <NewsletterModal />
    </div>
  );
}
