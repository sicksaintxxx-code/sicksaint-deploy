import React from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Flame } from 'lucide-react';
import { fetchArticles } from '../../lib/api';
import ArticleCard from '../../components/ArticleCard';
import NewsletterModal from '../../components/NewsletterModal';

export const revalidate = 60;

export const metadata = {
  title: 'Trending Dispatches — SICKSAINT',
  description: 'Most scrutinized and resonant investigative dispatches across global bureaus.',
};

export default async function TrendingPage() {
  const { articles } = await fetchArticles({ limit: 30 });
  const sorted = [...articles].sort((a, b) => b.viewCount - a.viewCount);
  const hasReliableMetrics = sorted.some((article) => article.viewCount > 0);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-brand-textMuted hover:text-brand-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO FRONT PAGE</span>
          </Link>
        </div>

        <div className="border-b border-brand-border pb-8 mb-12">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-brand-accent uppercase mb-2">
            <TrendingUp className="w-4 h-4 text-brand-accent" />
            <span>GLOBAL ATTENTION VECTORS</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-brand-text tracking-tight">
            Trending Dispatches
          </h1>
          <p className="mt-3 text-sm sm:text-base font-serif text-brand-textMuted max-w-2xl leading-relaxed">
            The most cited, archived, and read investigations across government ministries, university departments, and private financial desks.
          </p>
        </div>

        {hasReliableMetrics ? <div className="space-y-12">
          {sorted.map((article, idx) => (
            <div
              key={article.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-brand-border pb-10"
            >
              <div className="md:col-span-1 text-center md:text-left">
                <span className="text-4xl sm:text-5xl font-mono font-black text-brand-accent/40 select-none">
                  #{String(idx + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="md:col-span-4 aspect-[16/10] overflow-hidden bg-brand-surface border border-brand-border">
                <img
                  src={article.coverImageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-brand-accent font-bold uppercase">
                  <span>{article.category.name}</span>
                  <span className="text-brand-border">·</span>
                  <span className="text-brand-textMuted">{article.readingTimeMinutes} MIN READ</span>
                  <span className="text-brand-border">·</span>
                  {article.viewCount > 0 && <span className="text-brand-textSubtle">{article.viewCount.toLocaleString()} READS</span>}
                </div>
                <Link href={`/article/${article.slug}`}>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-brand-text hover:text-brand-accent transition-colors leading-snug">
                    {article.title}
                  </h2>
                </Link>
                <p className="text-sm font-serif text-brand-textMuted leading-relaxed">
                  {article.excerpt}
                </p>
                <div className="pt-2 text-xs font-mono text-brand-textSubtle">
                  BY <span className="text-brand-text font-bold">{article.author.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div> : <div className="border border-brand-border bg-brand-surface p-8 text-center font-mono text-xs text-brand-textMuted">The WordPress newsroom does not currently provide reliable readership metrics for a trending ranking.</div>}
      </div>

      <NewsletterModal />
    </div>
  );
}
