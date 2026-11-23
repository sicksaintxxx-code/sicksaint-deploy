import React from 'react';
import Link from 'next/link';
import { Search, Filter, ArrowLeft, ArrowRight, Layers } from 'lucide-react';
import { fetchArticles, fetchCategories } from '../../lib/api';
import ArticleCard from '../../components/ArticleCard';
import NewsletterModal from '../../components/NewsletterModal';

export const revalidate = 60;

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    format?: string;
    page?: string;
  }>;
}

export const metadata = {
  title: 'Search Archive — SICKSAINT: The World, Without The Noise',
  description: 'Search SICKSAINT’s comprehensive archive of investigative dossiers, global dispatches, and critical essays.',
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const search = await searchParams;
  const query = search.q || '';
  const page = Math.max(1, parseInt(search.page || '1', 10) || 1);
  const { articles, total } = await fetchArticles({
    search: query,
    category: search.category,
    format: search.format,
    limit: 24,
    page,
  });

  const categories = await fetchCategories();

  const formats = [
    { label: 'ALL FORMATS', value: '' },
    { label: 'DISPATCHES', value: 'DISPATCH' },
    { label: 'DOSSIERS', value: 'DOSSIER' },
    { label: 'DIALOGUES', value: 'DIALOGUE' },
    { label: 'ESSAYS', value: 'ESSAY' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Search Header */}
      <div className="border-b border-brand-border pb-10 mb-10">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-brand-textMuted hover:text-brand-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO FRONT PAGE</span>
          </Link>
        </div>

        <span className="text-xs font-mono font-bold tracking-widest text-brand-accent uppercase">
          [SICKSAINT ARCHIVAL QUERY ENGINE]
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif font-black text-brand-text tracking-tight mt-2">
          SEARCH ARCHIVE
        </h1>

        {/* Search Input Form */}
        <form action="/search" method="GET" className="mt-8 max-w-3xl">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-brand-accent absolute left-4 pointer-events-none" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by keyword, topic, author, or sovereign infrastructure..."
              className="w-full bg-brand-surface border border-brand-border pl-12 pr-28 py-4 text-base sm:text-lg font-serif text-brand-text placeholder-brand-textSubtle focus:outline-none focus:border-brand-accent transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2.5 bg-brand-accent text-brand-bg text-xs font-mono font-bold tracking-wider uppercase hover:bg-white transition-colors"
            >
              QUERY
            </button>
          </div>
        </form>

        {/* Filter Badges */}
        <div className="mt-8 pt-6 border-t border-brand-border flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-brand-textSubtle uppercase mr-1">FORMAT:</span>
            {formats.map((fmt) => {
              const isSelected = (!search.format && fmt.value === '') || search.format === fmt.value;
              const linkParams = new URLSearchParams();
              if (query) linkParams.set('q', query);
              if (search.category) linkParams.set('category', search.category);
              if (fmt.value) linkParams.set('format', fmt.value);

              return (
                <Link
                  key={fmt.label}
                  href={`/search?${linkParams.toString()}`}
                  className={`px-3 py-1 transition-colors border ${
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

          <div className="text-brand-textMuted">
            <span>SHOWING </span>
            <span className="text-brand-accent font-bold">{total}</span>
            <span> ARCHIVAL ENTRIES</span>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {articles.length === 0 ? (
        <div className="py-20 text-center font-mono text-sm text-brand-textMuted border border-brand-border bg-brand-surface p-12">
          <p className="text-base text-brand-text font-serif mb-2">No matching dispatches found.</p>
          <p className="text-xs text-brand-textSubtle max-w-md mx-auto">
            Try adjusting your search criteria or explore our featured dossiers from the front page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="secondary" />
          ))}
        </div>
      )}

      {total > 24 && (
        <nav aria-label="Search result pages" className="mt-10 flex justify-center gap-4 font-mono text-xs">
          {page > 1 && <Link className="border border-brand-border px-4 py-2 hover:border-brand-accent" href={`/search?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(search.category ? { category: search.category } : {}), ...(search.format ? { format: search.format } : {}), page: String(page - 1) })}`}>PREVIOUS</Link>}
          <span className="px-3 py-2 text-brand-textMuted">PAGE {page} / {Math.ceil(total / 24)}</span>
          {page < Math.ceil(total / 24) && <Link className="border border-brand-border px-4 py-2 hover:border-brand-accent" href={`/search?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(search.category ? { category: search.category } : {}), ...(search.format ? { format: search.format } : {}), page: String(page + 1) })}`}>NEXT</Link>}
        </nav>
      )}

      <NewsletterModal />
    </div>
  );
}
