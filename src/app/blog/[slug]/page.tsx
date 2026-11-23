import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, Calendar, ArrowLeft, User, ShieldCheck, Tag as TagIcon, Share2 } from 'lucide-react';
import { getWordPressPostBySlug } from '@/lib/wordpress';
import NewsletterModal from '@/components/NewsletterModal';

export const revalidate = 30;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const { article } = await getWordPressPostBySlug(slug);
  if (!article) return { title: 'Dispatch Not Found — SICKSAINT' };

  return {
    title: `${article.title} — SICKSAINT Journal`,
    description: article.excerpt || article.title,
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const { article, related, isWordPressLive } = await getWordPressPostBySlug(slug);

  if (!article) {
    notFound();
  }

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

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

  return (
    <article className="min-h-screen bg-brand-bg text-brand-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. TOP EDITORIAL BREADCRUMB & METADATA */}
      <div className="border-b border-brand-border bg-brand-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-brand-textMuted hover:text-brand-accent transition-colors tracking-widest uppercase"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO WORDPRESS JOURNAL</span>
            </Link>

            <div className="flex items-center gap-2 text-brand-textSubtle">
              <span className="w-2 h-2 bg-brand-burgundy animate-pulse" />
              <span>WORDPRESS CMS FEED</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ARTICLE HEADER MASTHEAD */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8">
        {/* Category Pill & Kicker */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href={`/blog?category=${article.category.slug}`}
            className="px-3 py-1 bg-brand-surface border border-brand-burgundy/60 text-brand-burgundy font-condensed text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-burgundy hover:text-white transition-colors"
          >
            {article.category.name}
          </Link>
          <span className="font-condensed text-xs text-brand-textSubtle uppercase tracking-wider">
            {article.kicker || 'FIELD DISPATCH'}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-brand-text tracking-tight leading-[1.05] mb-6">
          {article.title}
        </h1>

        {/* Subtitle / Excerpt Deck */}
        {article.subtitle ? (
          <p className="font-sans text-lg sm:text-xl text-brand-textMuted leading-relaxed mb-8 font-light">
            {article.subtitle}
          </p>
        ) : article.excerpt ? (
          <p className="font-sans text-base sm:text-lg text-brand-textMuted leading-relaxed mb-8">
            {article.excerpt}
          </p>
        ) : null}

        {/* Author Byline & Publication Timestamp */}
        <div className="pt-6 border-t border-brand-border/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {article.author.avatarUrl ? (
              <img
                src={article.author.avatarUrl}
                alt={article.author.name}
                className="w-11 h-11 object-cover grayscale border border-brand-border"
              />
            ) : (
              <div className="w-11 h-11 bg-brand-card border border-brand-border flex items-center justify-center font-mono text-xs text-brand-burgundy font-bold">
                SS
              </div>
            )}
            <div>
              <div className="font-mono text-xs font-bold text-brand-text tracking-wide">
                BY {article.author.name.toUpperCase()}
              </div>
              <div className="font-mono text-[11px] text-brand-textSubtle">
                {article.author.title || 'Staff Writer'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs text-brand-textSubtle">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-accent" />
              {formattedDate}
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {article.readingTimeMinutes} MIN READ
            </div>
          </div>
        </div>
      </header>

      {/* 3. FEATURED IMAGE */}
      {article.coverImageUrl && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
          <figure className="relative overflow-hidden border border-brand-border bg-brand-secondary">
            <div className="aspect-[16/9] w-full">
              <img
                src={article.coverImageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            {(article.coverImageCaption || article.coverImageCredit) && (
              <figcaption className="p-3 bg-brand-card border-t border-brand-border font-mono text-[11px] text-brand-textSubtle flex flex-wrap items-center justify-between gap-2">
                <span>{article.coverImageCaption}</span>
                {article.coverImageCredit && (
                  <span className="text-brand-textMuted uppercase">
                    CREDIT: {article.coverImageCredit}
                  </span>
                )}
              </figcaption>
            )}
          </figure>
        </div>
      )}

      {/* 4. ARTICLE BODY CONTENT */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div
          className="prose prose-invert prose-lg max-w-none font-sans leading-relaxed
            prose-headings:font-serif prose-headings:font-bold prose-headings:text-brand-text
            prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-brand-border/60 prose-h2:pb-3
            prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-brand-text/90 prose-p:leading-8 prose-p:text-base sm:prose-p:text-lg prose-p:mb-6
            prose-a:text-brand-accent prose-a:underline hover:prose-a:text-white
            prose-blockquote:border-l-2 prose-blockquote:border-brand-accent prose-blockquote:bg-brand-secondary/40 prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-brand-text prose-blockquote:my-8
            prose-strong:text-brand-text prose-strong:font-bold
            prose-img:border prose-img:border-brand-border prose-img:my-8
            prose-code:font-mono prose-code:text-brand-accent prose-code:bg-brand-card prose-code:px-1.5 prose-code:py-0.5 prose-code:border prose-code:border-brand-border/60
            prose-ul:list-disc prose-ul:pl-6 prose-li:my-2 prose-li:text-brand-text/90"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags Section */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-brand-border">
            <div className="flex items-center gap-2 font-mono text-xs text-brand-textSubtle uppercase tracking-wider mb-4">
              <TagIcon className="w-3.5 h-3.5 text-brand-accent" />
              <span>TRANSMISSION TAGS</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog?tag=${tag.slug}`}
                  className="px-3 py-1 bg-brand-card border border-brand-border text-brand-textMuted hover:border-brand-accent hover:text-brand-accent font-mono text-xs transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Colophon Box */}
        <div className="mt-12 p-6 border border-brand-border bg-brand-card flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {article.author.avatarUrl && (
            <img
              src={article.author.avatarUrl}
              alt={article.author.name}
              className="w-16 h-16 rounded-full object-cover border border-brand-border shrink-0"
            />
          )}
          <div>
            <h4 className="font-mono text-xs font-bold text-brand-accent uppercase tracking-widest mb-1">
              ABOUT THE AUTHOR
            </h4>
            <h3 className="font-serif text-lg font-bold text-brand-text mb-2">
              {article.author.name}
            </h3>
            <p className="font-mono text-xs text-brand-textMuted leading-relaxed">
              {article.author.bio || 'Staff correspondent covering sovereign systems and underground culture.'}
            </p>
          </div>
        </div>
      </div>

      {/* 5. RELATED ARTICLES SECTION */}
      {related && related.length > 0 && (
        <section className="border-t border-brand-border bg-brand-secondary/30 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="border-b border-brand-border pb-4 mb-8 flex items-center justify-between">
              <h3 className="font-mono text-xs font-bold tracking-widest text-brand-text uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-accent inline-block" />
                RELATED TRANSMISSIONS FROM SICKSAINT
              </h3>
              <Link
                href="/blog"
                className="font-mono text-xs text-brand-textSubtle hover:text-brand-accent uppercase tracking-widest transition-colors"
              >
                VIEW ALL ARTICLES →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((rel) => (
                <article
                  key={rel.id}
                  className="group border border-brand-border bg-brand-card hover:border-brand-accent/60 transition-all duration-200 overflow-hidden"
                >
                  <Link href={`/blog/${rel.slug}`} className="block aspect-[16/10] overflow-hidden bg-brand-secondary">
                    {rel.coverImageUrl && (
                      <img
                        src={rel.coverImageUrl}
                        alt={rel.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </Link>
                  <div className="p-5">
                    <span className="font-mono text-[10px] text-brand-accent uppercase font-bold tracking-widest mb-2 block">
                      {rel.category.name}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-brand-text group-hover:text-brand-accent transition-colors line-clamp-2 mb-2">
                      <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                    </h4>
                    {rel.excerpt && (
                      <p className="font-sans text-xs text-brand-textMuted line-clamp-2 leading-relaxed">
                        {rel.excerpt}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. NEWSLETTER MODAL BAR */}
      <NewsletterModal />
    </article>
  );
}
