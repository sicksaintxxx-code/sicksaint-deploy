import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Sliders } from 'lucide-react';
import { fetchArticles } from '../../lib/api';
import ArticleCard from '../../components/ArticleCard';
import NewsletterModal from '../../components/NewsletterModal';

export const revalidate = 60;

export const metadata = {
  title: 'Reviews & Critical Analysis — SICKSAINT',
  description: 'Uncompromising forensic evaluations of physical hardware, architectural works, cinema, and tactile craftsmanship.',
};

export default async function ReviewsPage() {
  const { articles } = await fetchArticles();
  const reviews = articles.filter(
    (a) =>
      a.tags?.some((t) => t.slug === 'reviews') ||
      a.kicker?.includes('CRITICISM') ||
      a.category.slug === 'fashion' ||
      a.category.slug === 'automotive'
  );

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
            <Sliders className="w-4 h-4 text-brand-accent" />
            <span>OBJECTIVE FORENSIC APPRAISALS</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-brand-text tracking-tight">
            Reviews & Analysis
          </h1>
          <p className="mt-3 text-sm sm:text-base font-serif text-brand-textMuted max-w-2xl leading-relaxed">
            Zero sponsored placements. Zero affiliate bribery. Every assessed machine, garment, film, and architectural project is dissected on its authentic technical and aesthetic merit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((article) => (
            <ArticleCard key={article.id} article={article} variant="secondary" />
          ))}
        </div>
      </div>

      <NewsletterModal />
    </div>
  );
}
