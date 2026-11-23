import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Twitter, Globe, BookOpen, Layers } from 'lucide-react';
import { fetchArticles } from '../../../lib/api';
import ArticleCard from '../../../components/ArticleCard';
import NewsletterModal from '../../../components/NewsletterModal';

export const revalidate = 60;

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AuthorPageProps) {
  const { slug } = await params;
  const { articles } = await fetchArticles();
  const author = articles.find(
    (a) =>
      a.author.id === slug ||
      a.author.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
  )?.author;

  if (!author) return { title: 'Author Archive — SICKSAINT' };
  return {
    title: `${author.name} — Editorial Archive | SICKSAINT`,
    description: author.bio || `Explore investigative dossiers and dispatches by ${author.name} for SICKSAINT.`,
    alternates: { canonical: `/author/${encodeURIComponent(slug)}` },
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const { articles } = await fetchArticles();
  const matchedArticles = articles.filter(
    (a) =>
      a.author.id === slug ||
      a.author.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
  );

  if (matchedArticles.length === 0) {
    notFound();
  }

  const author = matchedArticles[0].author;

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

        {/* Author Bio Header */}
        <div className="bg-brand-surface border border-brand-border p-8 sm:p-12 mb-12 flex flex-col md:flex-row items-start md:items-center gap-8">
          {author.avatarUrl && (
            <img
              src={author.avatarUrl}
              alt={author.name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover grayscale border-2 border-brand-border shadow-xl shrink-0"
            />
          )}

          <div className="space-y-3 flex-1">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-accent uppercase">
              [SICKSAINT EDITORIAL FELLOW · {author.id.toUpperCase()}]
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-black text-brand-text tracking-tight">
              {author.name}
            </h1>
            <p className="text-sm font-mono text-brand-textMuted uppercase font-semibold">
              {author.title || 'Senior Investigative Correspondent'}
            </p>
            <p className="text-base sm:text-lg font-serif text-brand-text leading-relaxed max-w-2xl pt-2">
              {author.bio || 'Contributing correspondent covering sovereign computing, capital corridors, and international statecraft.'}
            </p>

            <div className="pt-2 flex items-center space-x-4 text-xs font-mono text-brand-textMuted">
              <span className="text-brand-text font-bold">{matchedArticles.length} DISPATCHES PUBLISHED</span>
              <span>·</span>
              <span className="text-brand-accent font-semibold">PEER-VERIFIED CITATIONS</span>
            </div>
          </div>
        </div>

        {/* Author Dispatches Feed */}
        <div className="border-b border-brand-border pb-4 mb-8 flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold tracking-widest text-brand-text uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-accent inline-block"></span>
            FILED ARCHIVE BY {author.name.toUpperCase()}
          </h2>
          <span className="text-xs font-mono text-brand-textSubtle">
            SORTED BY CHRONOLOGICAL RELEVANCE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {matchedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="secondary" />
          ))}
        </div>
      </div>

      <NewsletterModal />
    </div>
  );
}
