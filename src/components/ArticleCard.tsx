import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Volume2, ArrowRight, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Article } from '../lib/types';
import EditorialPlaceholder from './EditorialPlaceholder';

interface ArticleCardProps {
  article: Article;
  variant?: 'hero-cover' | 'secondary' | 'compact' | 'dossier' | 'trending' | 'asymmetric-split' | 'large-feature';
  rankIndex?: number;
}

export default function ArticleCard({
  article,
  variant = 'secondary',
  rankIndex,
}: ArticleCardProps) {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

  // 1. MASSIVE CINEMATIC HERO STORY (Magazine Cover Style)
  if (variant === 'hero-cover') {
    return (
      <article className="group relative overflow-hidden border border-brand-border bg-brand-surface">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
          {/* Editorial Content Half — pure text, left side */}
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-between order-2 lg:order-1 relative z-10 bg-brand-surface">
            <div>
              {/* Kicker label */}
              <div className="kicker-label text-brand-burgundy mb-6 flex items-center gap-3">
                <span className="border border-brand-burgundy/60 px-2.5 py-0.5 font-condensed tracking-[0.2em] text-[10px] uppercase font-bold text-brand-burgundy">
                  {article.kicker || article.category.name}
                </span>
                <span className="w-8 h-px bg-brand-border inline-block" />
                <span className="text-brand-textSubtle font-condensed tracking-widest text-[10px] uppercase">
                  {article.format}
                </span>
              </div>

              <Link href={`/article/${article.slug}`}>
                <h2 className="font-serif font-black text-brand-text leading-[1.05] tracking-tight text-balance group-hover:text-brand-burgundy transition-colors duration-200"
                    style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
                  {article.title}
                </h2>
              </Link>

              {article.subtitle && (
                <p className="mt-5 text-base sm:text-lg text-brand-textMuted font-sans leading-relaxed">
                  {article.subtitle}
                </p>
              )}

              <p className="mt-4 text-sm sm:text-base text-brand-textMuted/90 font-sans leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>
            </div>

            {/* Author Byline */}
            <div className="mt-10 pt-6 border-t border-brand-border flex flex-wrap items-center justify-between text-xs font-mono text-brand-textMuted gap-4">
              <div className="flex items-center gap-3">
                {article.author.avatarUrl && (
                  <Image
                    src={article.author.avatarUrl}
                    alt={article.author.name}
                    width={36}
                    height={36}
                    loading="lazy"
                    sizes="36px"
                    className="w-9 h-9 object-cover grayscale border border-brand-border"
                  />
                )}
                <div>
                  <span className="font-bold text-brand-text tracking-wide">
                    {article.author.name}
                  </span>
                  {article.author.title && (
                    <span className="hidden sm:inline text-brand-textSubtle ml-2">
                      — {article.author.title}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex items-center gap-1.5 text-brand-textMuted font-condensed tracking-wider text-xs">
                  <Clock className="w-3.5 h-3.5 text-brand-burgundy" />
                  {article.readingTimeMinutes} MIN READ
                </div>
                {article.audioDurationSeconds && (
                  <div className="flex items-center gap-1.5 text-brand-burgundy font-condensed tracking-wider text-xs font-bold">
                    <Volume2 className="w-3.5 h-3.5" />
                    AUDIO DISPATCH
                  </div>
                )}
                <Link
                  href={`/article/${article.slug}`}
                  className="flex items-center gap-1 text-brand-text group-hover:text-brand-burgundy font-condensed font-bold tracking-widest text-xs transition-colors ml-1 uppercase"
                >
                  READ STORY <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Full-bleed Photography — right half */}
          <div className="order-1 lg:order-2 overflow-hidden relative min-h-[380px] sm:min-h-[500px] lg:min-h-0 bg-brand-card">
            <Link href={`/article/${article.slug}`} className="block w-full h-full absolute inset-0">
              {article.coverImageUrl ? (
                <Image
                  src={article.coverImageUrl}
                  alt={article.title}
                  width={800}
                  height={600}
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="w-full h-full object-cover contrast-105 group-hover:contrast-110 transition-transform duration-500 ease-out editorial-image-zoom"
                />
              ) : (
                <EditorialPlaceholder
                  category={article.category.name}
                  title={article.title}
                  className="w-full h-full min-h-[380px]"
                />
              )}
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // 2. ASYMMETRIC SPLIT CARD (Curated Features)
  if (variant === 'asymmetric-split') {
    return (
      <article className="group flex flex-col justify-between bg-brand-surface border border-brand-border hover:border-brand-borderLight transition-colors duration-200">
        <div>
          <Link
            href={`/article/${article.slug}`}
            className="block aspect-[16/10] overflow-hidden bg-brand-card relative border-b border-brand-border"
          >
            {article.coverImageUrl ? (
              <Image
                src={article.coverImageUrl}
                alt={article.title}
                width={800}
                height={500}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-full object-cover contrast-105 group-hover:contrast-110 transition-transform duration-500 ease-out editorial-image-zoom"
              />
            ) : (
              <EditorialPlaceholder
                category={article.category.name}
                title={article.title}
                aspectRatio="aspect-[16/10]"
              />
            )}
            <span className="kicker-label absolute top-3 left-3 px-2 py-0.5 bg-brand-bg/90 text-brand-accent border border-brand-border">
              {article.category.name}
            </span>
          </Link>

          <div className="p-6">
            <div className="flex items-center justify-between text-[11px] font-mono text-brand-textSubtle mb-2.5">
              <span className="uppercase tracking-wider font-semibold text-brand-accent/90">
                {article.format}
              </span>
              <span>{article.readingTimeMinutes} MIN READ</span>
            </div>

            <Link href={`/article/${article.slug}`}>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-brand-text leading-snug group-hover:text-brand-accent transition-colors">
                {article.title}
              </h3>
            </Link>

            <p className="mt-3 text-xs sm:text-sm font-sans text-brand-textMuted line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 pt-3 border-t border-brand-border flex items-center justify-between text-[11px] font-mono text-brand-textSubtle">
          <span className="font-medium text-brand-textMuted truncate mr-2">
            BY {article.author.name.toUpperCase()}
          </span>
          <span className="shrink-0">{formattedDate}</span>
        </div>
      </article>
    );
  }

  // 2B. LARGE PHOTOGRAPHIC FEATURE CARD (Full-bleed image with editorial overlay)
  if (variant === 'large-feature') {
    return (
      <article className="group relative overflow-hidden bg-brand-surface border border-brand-border hover:border-brand-borderLight transition-colors duration-200 min-h-[420px] flex flex-col justify-end">
        <Link href={`/article/${article.slug}`} className="absolute inset-0 z-0">
          {article.coverImageUrl ? (
            <Image
              src={article.coverImageUrl}
              alt={article.title}
              width={900}
              height={600}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 66vw"
              className="w-full h-full object-cover contrast-105 group-hover:contrast-110 transition-transform duration-500 ease-out editorial-image-zoom"
            />
          ) : (
            <div className="w-full h-full bg-brand-card" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/75 to-transparent" />
        </Link>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-end">
          <div className="kicker-label flex items-center gap-2.5 mb-3">
            <span className="text-brand-accent px-2 py-0.5 bg-brand-bg/90 border border-brand-border">
              {article.category.name}
            </span>
            <span className="text-brand-textMuted">{article.format}</span>
            <span className="text-brand-textSubtle">·</span>
            <span className="text-brand-textSubtle">{article.readingTimeMinutes} MIN READ</span>
          </div>

          <Link href={`/article/${article.slug}`}>
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-brand-text group-hover:text-brand-accent transition-colors leading-tight">
              {article.title}
            </h3>
          </Link>

          <p className="mt-2.5 text-xs sm:text-sm font-sans text-brand-textMuted line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="mt-4 pt-4 border-t border-brand-border/60 flex items-center justify-between text-[11px] font-mono text-brand-textSubtle">
            <span className="text-brand-textMuted font-medium">BY {article.author.name.toUpperCase()}</span>
            <div className="flex items-center gap-1 text-brand-accent font-bold">
              EXPLORE <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </article>
    );
  }

  // 3. TRENDING STORIES ITEM
  if (variant === 'trending') {
    const rank = rankIndex !== undefined ? (rankIndex < 9 ? `0${rankIndex + 1}` : `${rankIndex + 1}`) : '01';
    return (
      <article className="group flex items-start gap-4 py-4 border-b border-brand-border hover:border-brand-accent/40 transition-colors">
        <span className="font-mono text-2xl sm:text-3xl font-black text-brand-accent/80 tracking-tighter shrink-0 select-none w-10">
          {rank}
        </span>
        <div className="flex-1 min-w-0">
          <div className="kicker-label flex items-center gap-2 text-brand-textSubtle mb-1">
            <span className="text-brand-accent font-semibold">{article.category.name}</span>
            <span>·</span>
            <span>{article.readingTimeMinutes} MIN READ</span>
          </div>
          <Link href={`/article/${article.slug}`}>
            <h4 className="text-sm sm:text-base font-serif font-bold text-brand-text leading-snug group-hover:text-brand-accent transition-colors line-clamp-2">
              {article.title}
            </h4>
          </Link>
          <div className="mt-1 text-[11px] font-mono text-brand-textSubtle">
            DISPATCH BY {article.author.name.toUpperCase()}
          </div>
        </div>
      </article>
    );
  }

  // 4. CLASSIFIED INVESTIGATIVE DOSSIER
  if (variant === 'dossier') {
    return (
      <article className="group bg-brand-surface border border-brand-border p-6 flex flex-col justify-between hover:border-brand-borderLight transition-colors duration-200">
        <div>
          <div className="kicker-label flex items-center justify-between text-brand-accent mb-3">
            <span>[DOSSIER · {article.category.name}]</span>
            <span className="text-brand-textSubtle font-normal">{article.readingTimeMinutes}M AUDIT</span>
          </div>

          <Link href={`/article/${article.slug}`}>
            <h4 className="text-lg sm:text-xl font-serif font-bold text-brand-text leading-snug group-hover:text-brand-accent transition-colors">
              {article.title}
            </h4>
          </Link>

          <p className="mt-3 text-xs sm:text-sm font-sans text-brand-textMuted leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        </div>

        <div className="mt-6 pt-3 border-t border-brand-border flex items-center justify-between text-[11px] font-mono text-brand-textSubtle">
          <span>INVESTIGATOR: {article.author.name.toUpperCase()}</span>
          <Link
            href={`/article/${article.slug}`}
            className="flex items-center gap-1 text-brand-accent font-bold hover:underline"
          >
            DECRYPT <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </article>
    );
  }

  // 5. COMPACT FEED ITEM
  if (variant === 'compact') {
    return (
      <article className="group flex gap-4 py-3.5 border-b border-brand-border items-start">
        <Link
          href={`/article/${article.slug}`}
          className="w-24 h-20 shrink-0 overflow-hidden bg-brand-card relative border border-brand-border"
        >
          {article.coverImageUrl && (
            <Image
              src={article.coverImageUrl}
              alt={article.title}
              width={96}
              height={80}
              loading="lazy"
              sizes="96px"
              className="w-full h-full object-cover contrast-105 group-hover:contrast-110 transition-transform duration-300 editorial-image-zoom"
            />
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <div className="kicker-label flex items-center gap-2 text-brand-accent mb-1">
            <span>{article.category.name}</span>
            <span className="text-brand-border">·</span>
            <span className="text-brand-textSubtle">{article.readingTimeMinutes} MIN</span>
          </div>
          <Link href={`/article/${article.slug}`}>
            <h4 className="text-sm font-serif font-bold text-brand-text leading-snug group-hover:text-brand-accent transition-colors line-clamp-2">
              {article.title}
            </h4>
          </Link>
          <div className="mt-1 text-[11px] font-mono text-brand-textSubtle">
            {formattedDate}
          </div>
        </div>
      </article>
    );
  }

  // 6. DEFAULT SECONDARY EDITORIAL CARD
  return (
    <article className="group flex flex-col justify-between bg-brand-surface border border-brand-border hover:border-brand-borderLight transition-colors duration-200">
      <div>
        <Link
          href={`/article/${article.slug}`}
          className="block aspect-[16/10] overflow-hidden bg-brand-card relative border-b border-brand-border"
        >
          {article.coverImageUrl ? (
            <Image
              src={article.coverImageUrl}
              alt={article.title}
              width={640}
              height={400}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-full object-cover contrast-105 group-hover:contrast-110 transition-transform duration-500 ease-out editorial-image-zoom"
            />
          ) : (
            <EditorialPlaceholder
              category={article.category.name}
              title={article.title}
              aspectRatio="aspect-[16/10]"
            />
          )}
          <span className="kicker-label absolute top-2.5 left-2.5 px-2 py-0.5 bg-brand-bg/90 text-brand-accent border border-brand-border">
            {article.category.name}
          </span>
        </Link>

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between text-[11px] font-mono text-brand-textSubtle mb-2.5">
            <span className="uppercase tracking-wider text-brand-accent/80 font-semibold">{article.format}</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readingTimeMinutes} MIN READ
            </div>
          </div>

          <Link href={`/article/${article.slug}`}>
            <h3 className="text-xl font-serif font-bold text-brand-text leading-snug group-hover:text-brand-accent transition-colors">
              {article.title}
            </h3>
          </Link>

          <p className="mt-3 text-xs sm:text-sm font-sans text-brand-textMuted line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </div>

      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-brand-border flex items-center justify-between text-[11px] font-mono text-brand-textSubtle">
        <span className="truncate mr-2 font-medium">BY {article.author.name.toUpperCase()}</span>
        <span className="shrink-0">{formattedDate}</span>
      </div>
    </article>
  );
}
