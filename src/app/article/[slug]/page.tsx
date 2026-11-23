import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, Volume2, ArrowLeft, Calendar, User, ShieldCheck } from 'lucide-react';
import { fetchArticleBySlug } from '../../../lib/api';
import AudioPlayerWidget from '../../../components/AudioPlayerWidget';
import ArticleCard from '../../../components/ArticleCard';
import NewsletterModal from '../../../components/NewsletterModal';
import ArticleReadingTools from '../../../components/ArticleReadingTools';
import ArticleComments from '../../../components/ArticleComments';

export const revalidate = 60;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found — SICKSAINT' };

  return {
    title: `${article.title} — SICKSAINT`,
    description: article.excerpt,
    alternates: { canonical: `/article/${encodeURIComponent(slug)}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      images: article.coverImageUrl ? [{ url: article.coverImageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Schema.org NewsArticle structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImageUrl ? [article.coverImageUrl] : [],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: [
      {
        '@type': 'Person',
        name: article.author.name,
        jobTitle: article.author.title,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'SICKSAINT',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sicksaint.club'}/logo.png`,
      },
    },
  };

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <article className="min-h-screen bg-brand-bg text-brand-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Reading Progress Indicator & Top Control Bar */}
      <ArticleReadingTools title={article.title} />

      {/* Header breadcrumb navigation */}
      <div className="border-b border-brand-border py-3 bg-brand-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs font-mono text-brand-textMuted">
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:text-brand-accent transition-colors font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO FRONT PAGE</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-bold text-brand-accent uppercase">{article.category.name}</span>
            <span className="text-brand-border">·</span>
            <span>{article.format}</span>
          </div>
        </div>
      </div>

      {/* Main Magazine Article Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        {article.kicker && (
          <div className="text-xs sm:text-sm font-condensed tracking-[0.25em] text-brand-burgundy font-bold uppercase mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-burgundy inline-block"></span>
            <span>{article.kicker}</span>
          </div>
        )}

        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black text-brand-text leading-[1.08] tracking-tight">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="mt-5 text-lg sm:text-xl md:text-2xl font-sans text-brand-textMuted leading-relaxed font-normal">
            {article.subtitle}
          </p>
        )}

        {/* Byline and publication metadata */}
        <div className="mt-8 pt-6 border-t border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3.5">
            {article.author.avatarUrl && (
              <img
                src={article.author.avatarUrl}
                alt={article.author.name}
                className="w-11 h-11 object-cover grayscale border border-brand-border"
              />
            )}
            <div>
              <Link
                href={`/author/${article.author.id || encodeURIComponent(article.author.name.toLowerCase().replace(/\s+/g, '-'))}`}
                className="font-bold text-brand-text text-sm sm:text-base hover:text-brand-accent transition-colors"
              >
                {article.author.name}
              </Link>
              <div className="text-brand-textMuted">
                {article.author.title || 'SICKSAINT Editorial Staff'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-brand-textMuted self-start sm:self-center">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-accent" />
              {formattedDate}
            </div>
            <span className="text-brand-border">·</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-accent" />
              {article.readingTimeMinutes} MIN READ
            </div>
          </div>
        </div>
      </header>

      {/* Cinematic Full-Bleed Feature Image */}
      {article.coverImageUrl && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
          <div className="aspect-[16/9] overflow-hidden bg-brand-surface border border-brand-border shadow-2xl">
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="w-full h-full object-cover grayscale contrast-125"
            />
          </div>
          {article.coverImageCaption && (
            <div className="mt-3 text-xs font-mono text-brand-textSubtle flex flex-wrap items-center justify-between italic gap-2 px-1">
              <span>{article.coverImageCaption}</span>
              {article.coverImageCredit && (
                <span className="font-semibold text-brand-textMuted">
                  ARCHIVE: {article.coverImageCredit}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Audio Dispatch Narration Player */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <AudioPlayerWidget
          title={article.title}
          durationSeconds={article.audioDurationSeconds || 600}
          authorName={article.author.name}
        />
      </div>

      {/* Main Editorial Body Typography */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="font-serif text-brand-text leading-[1.88] text-lg sm:text-xl space-y-7">
          {article.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3
                  key={idx}
                  className="pt-8 text-2xl sm:text-3xl font-serif font-black text-brand-text tracking-tight border-b border-brand-border pb-2.5"
                >
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('> ')) {
              return (
                <blockquote
                  key={idx}
                  className="my-8 pl-6 border-l-2 border-brand-burgundy italic font-serif text-xl sm:text-2xl text-brand-text bg-brand-surface py-4 pr-6 leading-relaxed"
                >
                  {paragraph.replace('> ', '')}
                </blockquote>
              );
            }
            return (
              <p key={idx} className={idx === 0 ? 'editorial-drop-cap' : ''}>
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Tags Section */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-brand-border flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-brand-accent uppercase font-bold mr-2">
              FILED UNDER:
            </span>
            {article.tags.map((t) => (
              <Link
                key={t.id || t.slug}
                href={`/tag/${t.slug}`}
                className="text-xs font-mono px-3 py-1 bg-brand-surface border border-brand-border text-brand-textMuted hover:border-brand-accent hover:text-brand-accent transition-colors"
              >
                #{t.name}
              </Link>
            ))}
          </div>
        )}

        {/* Author Colophon Box */}
        <div className="mt-10 p-6 bg-brand-surface border border-brand-border flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {article.author.avatarUrl && (
            <img
              src={article.author.avatarUrl}
              alt={article.author.name}
              className="w-16 h-16 rounded-full object-cover grayscale border-2 border-brand-border shrink-0"
            />
          )}
          <div className="space-y-1">
            <div className="text-[10px] font-mono tracking-widest text-brand-accent uppercase font-bold">
              AUTHOR & CORRESPONDENT
            </div>
            <Link
              href={`/author/${article.author.id || encodeURIComponent(article.author.name.toLowerCase().replace(/\s+/g, '-'))}`}
              className="text-lg font-serif font-black text-brand-text hover:text-brand-accent transition-colors block"
            >
              {article.author.name}
            </Link>
            <p className="text-xs font-serif text-brand-textMuted leading-relaxed">
              {article.author.bio || article.author.title || 'Contributing editor for SICKSAINT.'}
            </p>
          </div>
        </div>

        {/* Reader Discussion & High-Signal Comments */}
        <ArticleComments articleTitle={article.title} />
      </div>

      {/* Related Stories Asymmetric Grid */}
      {article.related && article.related.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-brand-border mt-12">
          <div className="border-b border-brand-border pb-3 mb-8 flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold tracking-widest text-brand-text uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-accent inline-block"></span>
              RELATED INVESTIGATIVE DOSSIERS & DISPATCHES
            </h3>
            <span className="text-[11px] font-mono text-brand-textSubtle">
              EDITORIAL RECOMMENDATIONS
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {article.related.map((rel) => (
              <ArticleCard key={rel.id} article={rel} variant="secondary" />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <NewsletterModal />
    </article>
  );
}
