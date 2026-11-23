import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Radio, Filter } from 'lucide-react';
import { fetchArticles } from '../../lib/api';
import ArticleCard from '../../components/ArticleCard';
import NewsletterModal from '../../components/NewsletterModal';

export const revalidate = 60;

export const metadata = {
  title: 'Latest Dispatches — SICKSAINT: Continuous Editorial Feed',
  description: 'Real-time chronological stream of verified dispatches and investigative dossiers from SICKSAINT.',
};

export default async function LatestPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const { articles, total } = await fetchArticles({ limit: 40, page });
  const sorted = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-brand-textMuted hover:text-brand-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO FRONT PAGE</span>
          </Link>
        </div>

        {/* Feed Header */}
        <div className="border-b border-brand-border pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-brand-accent uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-ping"></span>
              <span>CONTINUOUS WIRE · ZERO ALGORITHMIC COMPRESSION</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-brand-text tracking-tight">
              The Latest Stream
            </h1>
            <p className="mt-3 text-sm sm:text-base font-serif text-brand-textMuted max-w-2xl leading-relaxed">
              Every dispatched report, dossier, dialogue, and photo essay in reverse chronological order. No predictive algorithms or engagement loops.
            </p>
          </div>

          <div className="text-xs font-mono text-brand-textSubtle bg-brand-surface border border-brand-border p-4">
            <div>TOTAL DISPATCHES: <span className="text-brand-text font-bold">{total}</span></div>
            <div>FREQUENCY: <span className="text-brand-accent font-bold">CONTINUOUS</span></div>
            <div>VERIFICATION: <span className="text-brand-text font-bold">STRICT HUMAN REVIEW</span></div>
          </div>
        </div>

        {/* Lead story */}
        {sorted.length > 0 && (
          <div className="mb-14">
            <ArticleCard article={sorted[0]} variant="hero-cover" />
          </div>
        )}

        {/* Grid of latest stories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sorted.slice(1).map((article) => (
            <ArticleCard key={article.id} article={article} variant="secondary" />
          ))}
        </div>
        {total === 0 && <p className="border border-brand-border bg-brand-surface p-8 text-center font-mono text-xs text-brand-textMuted">Published stories are not available from the WordPress newsroom right now.</p>}
        {total > 40 && (
          <nav aria-label="Latest story pages" className="mt-10 flex justify-center gap-4 font-mono text-xs">
            {page > 1 && <Link href={`/latest?page=${page - 1}`} className="border border-brand-border px-4 py-2 hover:border-brand-accent">PREVIOUS</Link>}
            <span className="px-3 py-2 text-brand-textMuted">PAGE {page} / {Math.ceil(total / 40)}</span>
            {page < Math.ceil(total / 40) && <Link href={`/latest?page=${page + 1}`} className="border border-brand-border px-4 py-2 hover:border-brand-accent">NEXT</Link>}
          </nav>
        )}
      </div>

      <NewsletterModal />
    </div>
  );
}
