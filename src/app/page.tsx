import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles, Shield, Bookmark, Terminal, Compass, Layers, Flame, TrendingUp, Cpu, Globe, Scale, Landmark, Film, Scissors, Building2, Gamepad2, Wind, Mountain } from 'lucide-react';
import { fetchArticles, fetchCategories } from '../lib/api';
import { getWordPressPosts } from '../lib/wordpress';
import ArticleCard from '../components/ArticleCard';
import NewsletterModal from '../components/NewsletterModal';

export const revalidate = 60;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const search = await searchParams;
  const { articles, total } = await fetchArticles({
    search: search.search,
    category: search.category,
    limit: 30,
  });

  const categories = await fetchCategories();
  const wpResult = await getWordPressPosts({ perPage: 3 });
  const wpArticles = wpResult.data || [];

  // Curated story selections for editorial hierarchy
  const coverStory = articles.find((a) => a.category.slug === 'fashion') || articles.find((a) => a.heroOrder === 1) || articles[0];
  const heroArticle = articles.find((a) => a.heroOrder === 1) || articles[0];
  const secondaryFeatures = articles.filter((a) => a.id !== coverStory?.id && a.id !== heroArticle?.id).slice(0, 3);
  const largeFeatures = articles.slice(1, 3);
  const trendingStories = articles.slice(0, 5);
  const dossierArticles = articles.filter((a) => a.format === 'DOSSIER').slice(0, 3);
  const dialogueArticle = articles.find((a) => a.format === 'DIALOGUE');
  const latestFeed = articles.slice(2, 8);

  // Per-category helper
  const getCategoryArticles = (catSlug: string) => {
    return articles.filter((a) => a.category.slug === catSlug);
  };

  const techArticles = getCategoryArticles('technology');
  const worldArticles = getCategoryArticles('world');
  const politicsArticles = getCategoryArticles('politics');
  const businessArticles = getCategoryArticles('business');
  const fashionArticles = getCategoryArticles('fashion');
  const cultureArticles = getCategoryArticles('culture');
  const entertainmentArticles = getCategoryArticles('entertainment');
  const sportsArticles = getCategoryArticles('sports');
  const gamingArticles = getCategoryArticles('gaming');
  const lifestyleArticles = getCategoryArticles('lifestyle');
  const aiArticles = getCategoryArticles('ai');
  const financeArticles = getCategoryArticles('finance');
  const archArticles = getCategoryArticles('architecture');
  const photoArticles = getCategoryArticles('photography');
  const scienceArticles = getCategoryArticles('science');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* 0. Live Search Active Query Banner */}
      {search.search && (
        <div className="mb-10 p-5 bg-brand-surface border border-brand-accent/50 flex flex-wrap items-center justify-between font-mono text-xs gap-4">
          <div>
            <span className="text-brand-textMuted uppercase tracking-wider">SEARCH ARCHIVE QUERY: </span>
            <span className="font-bold text-brand-accent text-sm sm:text-base">
              &quot;{search.search}&quot;
            </span>
            <span className="ml-3 text-brand-textSubtle">({total} matches located)</span>
          </div>
          <Link
            href="/"
            className="px-3 py-1 bg-brand-card border border-brand-border text-brand-accent hover:border-brand-accent text-xs font-bold uppercase transition-colors"
          >
            CLEAR FILTER
          </Link>
        </div>
      )}

      {/* 1. EDITORIAL MAGAZINE HERO SECTION */}
      <section className="mb-20 border-b border-brand-border pb-16">
        {/* Editorial Sub-Masthead Tagline */}
        <div className="flex flex-wrap items-center justify-between border-b border-brand-border pb-3 mb-8 text-[11px] font-condensed tracking-[0.25em] text-brand-textMuted uppercase">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-brand-burgundy"></span>
            <span className="font-bold text-brand-text">SICKSAINT · EDITORIAL JOURNAL</span>
          </div>
          <span>THE WORLD, WITHOUT THE NOISE.</span>
        </div>

        {/* Hero Oversized Headline & Supporting Phrase */}
        <div className="mb-10 text-center lg:text-left">
          <h1 className="font-serif font-black text-brand-text text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.92] uppercase max-w-6xl">
            {coverStory ? coverStory.title : <>THE WORLD,<br /> WITHOUT THE NOISE.</>}
          </h1>
          <p className="mt-4 font-serif italic text-lg sm:text-2xl text-brand-textMuted max-w-3xl">
            {coverStory?.subtitle || 'An independent international digital editorial publication.'}
          </p>
        </div>

        {/* Asymmetric Image and Text Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Dominant Fashion Photograph (High-contrast 1990s Analog Editorial Look) */}
          <div className="lg:col-span-8 overflow-hidden bg-brand-surface border border-brand-border relative group min-h-[440px] sm:min-h-[560px]">
            {coverStory?.coverImageUrl ? (
              <Link href={`/article/${coverStory.slug}`} className="block w-full h-full">
                <img src={coverStory.coverImageUrl} alt={coverStory.coverImageCaption || coverStory.title} width={1200} height={800} className="w-full h-full object-cover grayscale contrast-125 brightness-95 group-hover:scale-[1.02] transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/90 via-transparent to-transparent opacity-80" />
              </Link>
            ) : (
              <div className="w-full h-full min-h-[440px] sm:min-h-[560px] flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-card via-brand-surface to-brand-bg">
                <div className="max-w-md px-8 text-center font-mono text-xs tracking-[0.2em] text-brand-textMuted uppercase">
                  <span className="block text-brand-accent mb-3">SICKSAINT / EDITORIAL DESK</span>
                  {wpResult.isWordPressLive ? 'No published stories are available yet.' : 'Published stories are temporarily unavailable.'}
                </div>
              </div>
            )}
            {coverStory?.coverImageCredit && <div className="absolute bottom-4 left-4 right-4 font-mono text-[10px] text-brand-textMuted">{coverStory.coverImageCredit}</div>}
          </div>

          {/* Asymmetric Editorial Essay Column */}
          <div className="lg:col-span-4 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-brand-border pt-6 lg:pt-0 lg:pl-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 font-condensed tracking-[0.2em] text-xs text-brand-burgundy font-bold uppercase">
                <span>{coverStory?.category.name || 'SICKSAINT'}</span>
                <span className="text-brand-border">/</span>
                <span className="text-brand-textSubtle">{coverStory ? new Date(coverStory.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }) : 'THE EDITORIAL JOURNAL'}</span>
              </div>

              <Link href={coverStory ? `/article/${coverStory.slug}` : '/blog'}>
                <h2 className="font-serif font-black text-2xl sm:text-3xl text-brand-text hover:text-brand-burgundy transition-colors leading-tight">
                  {coverStory?.title || 'The SICKSAINT journal'}
                </h2>
              </Link>

              <p className="font-sans text-sm sm:text-base text-brand-textMuted leading-relaxed">
                {coverStory?.excerpt || (wpResult.isWordPressLive ? 'Published stories will appear here when the newsroom publishes its first article.' : 'The WordPress newsroom feed is temporarily unavailable. Please return shortly.')}
              </p>

              {coverStory?.subtitle && <div className="p-4 bg-brand-surface border border-brand-border text-xs font-serif italic text-brand-textMuted leading-relaxed border-l-2 border-l-brand-burgundy">{coverStory.subtitle}</div>}
            </div>

            <div className="mt-8 pt-6 border-t border-brand-border flex items-center justify-between">
              <div className="font-condensed text-xs text-brand-textMuted tracking-wider">
                BY <span className="text-brand-text font-bold">{coverStory?.author.name.toUpperCase() || 'SICKSAINT EDITORIAL'}</span>
              </div>
              <Link
                href={coverStory ? `/article/${coverStory.slug}` : '/blog'}
                className="inline-flex items-center gap-1.5 font-condensed font-bold text-xs tracking-widest text-brand-text hover:text-brand-burgundy uppercase group"
              >
                <span>{coverStory ? 'READ EDITORIAL' : 'EXPLORE JOURNAL'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-brand-burgundy" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LATEST STORIES (Asymmetric Editorial Grid) */}
      <section className="mb-20">
        <div className="border-b border-brand-border pb-3 mb-8 flex items-center justify-between">
          <h3 className="text-xs font-condensed font-bold tracking-[0.2em] text-brand-text uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-burgundy inline-block"></span>
            LATEST STORIES
          </h3>
          <span className="text-[11px] font-mono text-brand-textSubtle uppercase hidden sm:inline">
            DISPATCHES & MONOGRAPHS
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Asymmetric Feature */}
          <div className="lg:col-span-7">
            {heroArticle && (
              <ArticleCard article={heroArticle} variant="secondary" />
            )}
          </div>

          {/* Side Stack of 2 Stories */}
          <div className="lg:col-span-5 space-y-6">
            {secondaryFeatures.map((article) => (
              <ArticleCard key={article.id} article={article} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED EDITORIAL (Deep Focus Spread) */}
      {largeFeatures.length >= 2 && (
        <section className="mb-20 bg-brand-surface border border-brand-border p-6 sm:p-10 lg:p-12">
          <div className="border-b border-brand-border pb-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-condensed font-bold text-xs tracking-[0.25em] text-brand-burgundy uppercase block mb-1">
                DEEP-FOCUS RETROSPECTIVE
              </span>
              <h3 className="text-3xl sm:text-4xl font-serif font-black text-brand-text uppercase tracking-tight">
                FEATURED EDITORIAL
              </h3>
            </div>
            <p className="font-serif italic text-sm text-brand-textMuted max-w-md">
              &ldquo;Fashion is not an industry; it is the physical manifestation of our dissidence.&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {largeFeatures.map((article) => (
              <ArticleCard key={article.id} article={article} variant="large-feature" />
            ))}
          </div>
        </section>
      )}

      {/* 4. FASHION & CULTURE */}
      <section className="mb-20">
        <div className="border-b border-brand-border pb-3 mb-8 flex items-center justify-between">
          <h3 className="text-xs font-condensed font-bold tracking-[0.2em] text-brand-text uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-burgundy inline-block"></span>
            FASHION & CULTURE
          </h3>
          <Link
            href="/category/fashion"
            className="text-xs font-condensed tracking-wider text-brand-burgundy hover:underline flex items-center gap-1 font-bold uppercase"
          >
            VIEW FULL SALON <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fashionArticles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="asymmetric-split" />
          ))}
        </div>
      </section>

      {/* 5. UNDERGROUND VOICES (Interviews & Dialogues) */}
      {dialogueArticle && (
        <section className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-brand-border p-6 sm:p-10 bg-brand-surface">
          <div className="lg:col-span-5 aspect-[4/3] bg-brand-card overflow-hidden border border-brand-border">
            {dialogueArticle.coverImageUrl && (
              <img
                src={dialogueArticle.coverImageUrl}
                alt={dialogueArticle.title}
                className="w-full h-full object-cover grayscale contrast-125 hover:scale-105 transition-all duration-700 ease-out"
              />
            )}
          </div>
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-2 font-condensed font-bold text-xs tracking-[0.2em] text-brand-burgundy uppercase mb-2">
              <span className="w-1.5 h-1.5 bg-brand-burgundy"></span>
              UNDERGROUND VOICES · THE DIALOGUE
            </div>
            <Link href={`/article/${dialogueArticle.slug}`}>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-brand-text hover:text-brand-burgundy transition-colors leading-tight">
                {dialogueArticle.title}
              </h3>
            </Link>
            <p className="mt-3 text-sm sm:text-base font-serif text-brand-textMuted leading-relaxed">
              {dialogueArticle.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-between pt-4 border-t border-brand-border text-xs font-condensed tracking-wider gap-4">
              <span className="font-semibold text-brand-text">
                DIALOGUE WITH: {dialogueArticle.author.name.toUpperCase()}
              </span>
              <Link
                href={`/article/${dialogueArticle.slug}`}
                className="flex items-center gap-1.5 font-bold text-brand-burgundy hover:underline uppercase"
              >
                READ TRANSCRIPT <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 6. SELECTED READS (Numbered 01-05 Print Index) */}
      <section className="mb-20 border border-brand-border bg-brand-surface p-6 sm:p-10">
        <div className="border-b border-brand-border pb-4 mb-6 flex items-center justify-between">
          <div className="text-xs font-condensed font-bold tracking-[0.25em] text-brand-text uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-burgundy"></span>
            SELECTED READS · CURATED PRINT INDEX
          </div>
          <span className="text-[11px] font-mono text-brand-textSubtle">
            EDITION SELECTIONS
          </span>
        </div>

        <div className="divide-y divide-brand-border">
          {trendingStories.map((article, idx) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="trending"
              rankIndex={idx}
            />
          ))}
        </div>
      </section>

      {/* 7. LATEST JOURNAL ENTRIES (WordPress Headless CMS Integration) */}
      <section className="mb-20">
        <div className="border-b border-brand-border pb-3 mb-8 flex items-center justify-between">
          <div>
            <span className="font-condensed font-bold text-xs tracking-[0.25em] text-brand-burgundy uppercase block mb-1">
              HEADLESS REST TRANSMISSIONS
            </span>
            <h3 className="text-xs sm:text-sm font-condensed font-bold tracking-[0.2em] text-brand-text uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-burgundy inline-block"></span>
              LATEST JOURNAL ENTRIES
            </h3>
          </div>
          <Link
            href="/blog"
            className="text-xs font-condensed tracking-wider text-brand-burgundy hover:underline flex items-center gap-1 font-bold uppercase"
          >
            EXPLORE FULL JOURNAL <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {wpArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wpArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="secondary" />
            ))}
          </div>
        ) : (
          <div className="p-8 border border-brand-border bg-brand-surface flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="space-y-1">
              <span className="text-brand-burgundy font-bold uppercase tracking-wider block">
                WORDPRESS CMS FEED · cms.sicksaint.club
              </span>
              <p className="text-brand-textMuted">
                {wpResult.isWordPressLive ? 'WordPress is connected. Published posts appear here automatically.' : 'WordPress is not reachable right now. No sample articles are being shown as live content.'}
              </p>
            </div>
            <Link
              href="/blog"
              className="px-4 py-2 bg-brand-burgundy text-white font-condensed font-bold tracking-widest uppercase hover:bg-brand-burgundy/80 transition-colors shrink-0"
            >
              ACCESS JOURNAL ARCHIVE
            </Link>
          </div>
        )}
      </section>

      {/* 6. ALL 10 CATEGORY-SPECIFIC EDITORIAL SECTIONS */}
      <section className="my-20 space-y-16">
        <div className="border-b-2 border-brand-border pb-4 flex items-center justify-between">
          <h2 className="text-sm font-mono font-black tracking-widest text-brand-text uppercase flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-brand-accent" />
            <span>EDITORIAL DEPARTMENTS & CURATED VERTICALS</span>
          </h2>
          <span className="text-xs font-mono text-brand-textSubtle uppercase">EDITORIAL DIRECTORY</span>
        </div>

        {/* 1. TECHNOLOGY */}
        <div className="border border-brand-border bg-brand-surface p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-6">
            <div className="flex items-center gap-3">
              <Cpu className="w-4 h-4 text-brand-accent" />
              <h3 className="text-base sm:text-lg font-serif font-bold text-brand-text">
                TECHNOLOGY & AUTONOMOUS SILICON
              </h3>
            </div>
            <Link
              href="/category/technology"
              className="text-xs font-mono text-brand-accent hover:underline flex items-center gap-1 font-bold"
            >
              EXPLORE ALL <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {techArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="secondary" />
            ))}
          </div>
        </div>

        {/* 2. WORLD */}
        <div className="border border-brand-border bg-brand-surface p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-6">
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-brand-accent" />
              <h3 className="text-base sm:text-lg font-serif font-bold text-brand-text">
                WORLD & MACRO STATECRAFT
              </h3>
            </div>
            <Link
              href="/category/world"
              className="text-xs font-mono text-brand-accent hover:underline flex items-center gap-1 font-bold"
            >
              EXPLORE ALL <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {worldArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="secondary" />
            ))}
          </div>
        </div>

        {/* 3. POLITICS & GOVERNANCE */}
        <div className="border border-brand-border bg-brand-surface p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-6">
            <div className="flex items-center gap-3">
              <Scale className="w-4 h-4 text-brand-accent" />
              <h3 className="text-base sm:text-lg font-serif font-bold text-brand-text">
                POLITICS & SOVEREIGN CHARTERS
              </h3>
            </div>
            <Link
              href="/category/politics"
              className="text-xs font-mono text-brand-accent hover:underline flex items-center gap-1 font-bold"
            >
              EXPLORE ALL <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {politicsArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="secondary" />
            ))}
          </div>
        </div>

        {/* 4. BUSINESS & FINANCE */}
        <div className="border border-brand-border bg-brand-surface p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-6">
            <div className="flex items-center gap-3">
              <Landmark className="w-4 h-4 text-brand-accent" />
              <h3 className="text-base sm:text-lg font-serif font-bold text-brand-text">
                BUSINESS & SHADOW LIQUIDITY
              </h3>
            </div>
            <Link
              href="/category/business"
              className="text-xs font-mono text-brand-accent hover:underline flex items-center gap-1 font-bold"
            >
              EXPLORE ALL <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {businessArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="secondary" />
            ))}
          </div>
        </div>

        {/* 5. FASHION & SARTORIAL */}
        <div className="border border-brand-border bg-brand-surface p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-6">
            <div className="flex items-center gap-3">
              <Scissors className="w-4 h-4 text-brand-accent" />
              <h3 className="text-base sm:text-lg font-serif font-bold text-brand-text">
                FASHION & NEO-BRUTALIST TAILORING
              </h3>
            </div>
            <Link
              href="/category/fashion"
              className="text-xs font-mono text-brand-accent hover:underline flex items-center gap-1 font-bold"
            >
              EXPLORE ALL <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fashionArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="secondary" />
            ))}
          </div>
        </div>

        {/* 6. CULTURE & ARCHITECTURE */}
        <div className="border border-brand-border bg-brand-surface p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-6">
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-brand-accent" />
              <h3 className="text-base sm:text-lg font-serif font-bold text-brand-text">
                CULTURE & MONOLITHIC FORM
              </h3>
            </div>
            <Link
              href="/category/culture"
              className="text-xs font-mono text-brand-accent hover:underline flex items-center gap-1 font-bold"
            >
              EXPLORE ALL <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cultureArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="secondary" />
            ))}
          </div>
        </div>

        {/* 7. ENTERTAINMENT & CINEMA */}
        <div className="border border-brand-border bg-brand-surface p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-6">
            <div className="flex items-center gap-3">
              <Film className="w-4 h-4 text-brand-accent" />
              <h3 className="text-base sm:text-lg font-serif font-bold text-brand-text">
                ENTERTAINMENT & 70MM CINEMA
              </h3>
            </div>
            <Link
              href="/category/entertainment"
              className="text-xs font-mono text-brand-accent hover:underline flex items-center gap-1 font-bold"
            >
              EXPLORE ALL <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {entertainmentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="secondary" />
            ))}
          </div>
        </div>

        {/* 8. SPORTS & AERODYNAMICS */}
        <div className="border border-brand-border bg-brand-surface p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-6">
            <div className="flex items-center gap-3">
              <Wind className="w-4 h-4 text-brand-accent" />
              <h3 className="text-base sm:text-lg font-serif font-bold text-brand-text">
                SPORTS & APEX AERODYNAMICS
              </h3>
            </div>
            <Link
              href="/category/sports"
              className="text-xs font-mono text-brand-accent hover:underline flex items-center gap-1 font-bold"
            >
              EXPLORE ALL <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sportsArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="secondary" />
            ))}
          </div>
        </div>

        {/* 9. GAMING & SPATIAL WORLDS */}
        <div className="border border-brand-border bg-brand-surface p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-6">
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-4 h-4 text-brand-accent" />
              <h3 className="text-base sm:text-lg font-serif font-bold text-brand-text">
                GAMING & SPATIAL SOVEREIGNTY
              </h3>
            </div>
            <Link
              href="/category/gaming"
              className="text-xs font-mono text-brand-accent hover:underline flex items-center gap-1 font-bold"
            >
              EXPLORE ALL <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gamingArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="secondary" />
            ))}
          </div>
        </div>

        {/* 10. LIFESTYLE & ARCHITECTURE OF SILENCE */}
        <div className="border border-brand-border bg-brand-surface p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-6">
            <div className="flex items-center gap-3">
              <Mountain className="w-4 h-4 text-brand-accent" />
              <h3 className="text-base sm:text-lg font-serif font-bold text-brand-text">
                LIFESTYLE & ARCHITECTURE OF SILENCE
              </h3>
            </div>
            <Link
              href="/category/lifestyle"
              className="text-xs font-mono text-brand-accent hover:underline flex items-center gap-1 font-bold"
            >
              EXPLORE ALL <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lifestyleArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="secondary" />
            ))}
          </div>
        </div>

        {/* 11. ARTIFICIAL INTELLIGENCE & AUTONOMOUS SWARMS */}
        <div className="border border-brand-border bg-brand-surface p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-6">
            <div className="flex items-center gap-3">
              <Cpu className="w-4 h-4 text-brand-accent" />
              <h3 className="text-base sm:text-lg font-serif font-bold text-brand-text">
                ARTIFICIAL INTELLIGENCE & AUTONOMOUS AGENTS
              </h3>
            </div>
            <Link
              href="/category/ai"
              className="text-xs font-mono text-brand-accent hover:underline flex items-center gap-1 font-bold"
            >
              EXPLORE ALL <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="secondary" />
            ))}
          </div>
        </div>

        {/* 12. ARCHITECTURE & MONOLITHIC ENGINEERING */}
        <div className="border border-brand-border bg-brand-surface p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-6">
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-brand-accent" />
              <h3 className="text-base sm:text-lg font-serif font-bold text-brand-text">
                ARCHITECTURE & BRUTALIST OBSERVATORIES
              </h3>
            </div>
            <Link
              href="/category/architecture"
              className="text-xs font-mono text-brand-accent hover:underline flex items-center gap-1 font-bold"
            >
              EXPLORE ALL <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {archArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="secondary" />
            ))}
          </div>
        </div>
      </section>

      {/* SPECIAL EDITORIAL FEATURES (Long reads, Investigations, Interviews, Photo essays) */}
      <section className="my-20 bg-brand-surface border border-brand-border p-6 sm:p-10">
        <div className="border-b border-brand-border pb-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-brand-accent uppercase mb-2">
              <Sparkles className="w-4 h-4 text-brand-accent" />
              <span>SIGNATURE EDITORIAL FORMATS</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-serif font-black text-brand-text tracking-tight">
              Curated Publishing Desks
            </h3>
          </div>
          <p className="text-xs font-mono text-brand-textSubtle max-w-xs sm:text-right">
            DISTINCTIVE EDITORIAL FORMS TAILORED FOR SUSTAINED INTELLECTUAL ATTENTION
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/investigations"
            className="p-6 bg-brand-card border border-brand-border hover:border-brand-accent transition-all group"
          >
            <span className="text-[10px] font-mono text-brand-accent font-bold uppercase tracking-widest block mb-2">
              DESK I · FORENSIC
            </span>
            <h4 className="text-xl font-serif font-black text-brand-text group-hover:text-brand-accent transition-colors">
              Investigations
            </h4>
            <p className="mt-2 text-xs font-serif text-brand-textMuted leading-relaxed">
              Multi-month investigative dossiers on subsea routing cabals and sovereign wealth.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-mono text-brand-accent font-semibold group-hover:translate-x-1 transition-transform">
              EXPLORE DOSSIERS →
            </span>
          </Link>

          <Link
            href="/long-reads"
            className="p-6 bg-brand-card border border-brand-border hover:border-brand-accent transition-all group"
          >
            <span className="text-[10px] font-mono text-brand-accent font-bold uppercase tracking-widest block mb-2">
              DESK II · SUSTAINED
            </span>
            <h4 className="text-xl font-serif font-black text-brand-text group-hover:text-brand-accent transition-colors">
              Long Reads
            </h4>
            <p className="mt-2 text-xs font-serif text-brand-textMuted leading-relaxed">
              Exhaustive essays and architectural critiques requiring 10+ minutes of sustained focus.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-mono text-brand-accent font-semibold group-hover:translate-x-1 transition-transform">
              READ ESSAYS →
            </span>
          </Link>

          <Link
            href="/interviews"
            className="p-6 bg-brand-card border border-brand-border hover:border-brand-accent transition-all group"
          >
            <span className="text-[10px] font-mono text-brand-accent font-bold uppercase tracking-widest block mb-2">
              DESK III · UNFILTERED
            </span>
            <h4 className="text-xl font-serif font-black text-brand-text group-hover:text-brand-accent transition-colors">
              The Dialogues
            </h4>
            <p className="mt-2 text-xs font-serif text-brand-textMuted leading-relaxed">
              Unedited long-form interviews with physicists, directors, and sovereign financiers.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-mono text-brand-accent font-semibold group-hover:translate-x-1 transition-transform">
              ENTER DIALOGUES →
            </span>
          </Link>

          <Link
            href="/photo-essays"
            className="p-6 bg-brand-card border border-brand-border hover:border-brand-accent transition-all group"
          >
            <span className="text-[10px] font-mono text-brand-accent font-bold uppercase tracking-widest block mb-2">
              DESK IV · LARGE-FORMAT
            </span>
            <h4 className="text-xl font-serif font-black text-brand-text group-hover:text-brand-accent transition-colors">
              Photo Essays
            </h4>
            <p className="mt-2 text-xs font-serif text-brand-textMuted leading-relaxed">
              Monumental architectural monographs and darkroom silver gelatin portfolios.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-mono text-brand-accent font-semibold group-hover:translate-x-1 transition-transform">
              VIEW ARCHIVES →
            </span>
          </Link>
        </div>
      </section>

      {/* 7. LATEST STORIES CHRONOLOGICAL FEED */}
      <section id="latest" className="my-20">
        <div className="border-b border-brand-border pb-3 mb-8 flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold tracking-widest text-brand-text uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-accent inline-block"></span>
            LATEST EDITORIAL DISPATCHES
          </h3>
          <span className="text-[11px] font-mono text-brand-textSubtle">
            CHRONOLOGICAL PUBLISHING STREAM
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestFeed.map((article) => (
            <ArticleCard key={article.id} article={article} variant="secondary" />
          ))}
        </div>
      </section>

      {/* 8. EDITORIAL DEPARTMENTS DIRECTORY */}
      <section className="my-20 border border-brand-border bg-brand-surface p-6 sm:p-8">
        <div className="border-b border-brand-border pb-4 mb-6 flex items-center justify-between">
          <div className="text-xs font-mono font-bold tracking-widest text-brand-text uppercase flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-brand-accent" />
            <span>EDITORIAL DEPARTMENTS & VERTICALS DIRECTORY</span>
          </div>
          <span className="text-[11px] font-mono text-brand-textSubtle">
            INDEX DIRECTORY
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="p-3.5 sm:p-4 bg-brand-card border border-brand-border hover:border-brand-accent transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-brand-accent uppercase font-bold tracking-wider">
                  [{cat.slug.toUpperCase()}]
                </span>
                <h4 className="text-sm font-serif font-bold text-brand-text group-hover:text-brand-accent mt-1 transition-colors">
                  {cat.name}
                </h4>
              </div>
              <div className="mt-3 text-[11px] font-mono text-brand-textSubtle flex items-center justify-between">
                <span>{cat.articleCount ?? 0} STORIES</span>
                <ArrowRight className="w-3 h-3 text-brand-textSubtle group-hover:text-brand-accent group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. THE NOISELESS DISPATCH (Weekly Newsletter with real backend) */}
      <NewsletterModal />
    </div>
  );
}
