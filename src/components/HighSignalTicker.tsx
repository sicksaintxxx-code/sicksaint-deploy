'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';

export default function HighSignalTicker() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [cmsAvailable, setCmsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/blog?per_page=6')
      .then(async (response) => {
        const payload = await response.json();
        if (!active) return;
        setCmsAvailable(Boolean(payload.isWordPressLive));
        setArticles(Array.isArray(payload.data) ? payload.data : []);
      })
      .catch(() => {
        if (active) setCmsAvailable(false);
      });
    return () => { active = false; };
  }, []);

  const loopItems = articles.length > 1 ? [...articles, ...articles] : articles;

  return (
    <div className="bg-brand-bg border-b border-brand-border h-9 overflow-hidden relative z-20 flex items-center">
      <div className="shrink-0 bg-brand-surface px-3 sm:px-4 h-full flex items-center gap-2 border-r border-brand-border z-10 select-none">
        <span className="animate-signal-pulse inline-block h-1.5 w-1.5 bg-brand-burgundy rounded-none" />
        <span className="font-condensed font-bold text-brand-text text-[11px] tracking-[0.2em] uppercase">EDITORIAL WIRE</span>
      </div>
      <div className="overflow-hidden flex-1 relative h-full flex items-center">
        {loopItems.length > 0 ? (
          <div className="animate-marquee-continuous flex items-center whitespace-nowrap">
            {loopItems.map((article, index) => (
              <div key={`${article.id}-${index}`} className="inline-flex items-center gap-2.5 mx-6 text-xs font-condensed tracking-wider">
                <span className="text-brand-burgundy font-bold text-[10px] uppercase tracking-[0.15em]">[{article.category.name}]</span>
                <Link href={`/article/${article.slug}`} className="text-brand-text hover:text-brand-burgundy font-sans text-xs transition-colors font-normal tracking-tight">
                  {article.title}
                </Link>
                <span className="text-brand-border ml-3 font-mono">/</span>
              </div>
            ))}
          </div>
        ) : (
          <span className="px-4 text-[10px] font-mono tracking-wider text-brand-textSubtle uppercase">
            {cmsAvailable === null ? 'CHECKING PUBLISHED DISPATCHES' : cmsAvailable ? 'NO PUBLISHED DISPATCHES' : 'PUBLISHED DISPATCHES TEMPORARILY UNAVAILABLE'}
          </span>
        )}
      </div>
    </div>
  );
}
