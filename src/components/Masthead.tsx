'use client';

import React from 'react';
import Link from 'next/link';

export default function Masthead() {
  return (
    <header className="border-b border-brand-border bg-brand-bg select-none">
      {/* 1. Vintage Top Editorial Publication Line */}
      <div className="border-b border-brand-border bg-brand-bg py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-[11px] font-condensed tracking-widest text-brand-textMuted uppercase gap-2">
          {/* Left: Issue & Edition */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-brand-text">ISSUE NO. 04</span>
            <span className="text-brand-border">/</span>
            <span>VOL. XXVII</span>
            <span className="hidden sm:inline text-brand-border">/</span>
            <span className="hidden sm:inline">AUTUMN / WINTER EDITION</span>
          </div>

          {/* Center: Static dateline — no dynamic state */}
          <div className="hidden md:block text-brand-textMuted tracking-editorial font-serif italic text-xs">
            NEW YORK · PARIS · LONDON · TOKYO
          </div>

          {/* Right: Circulation & Bureau */}
          <div className="flex items-center gap-3">
            <span>NEW YORK BUREAU</span>
            <span className="text-brand-border">/</span>
            <span className="text-brand-burgundy font-semibold">FOUNDED 1997</span>
          </div>
        </div>
      </div>

      {/* 2. Massive Editorial Wordmark Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 text-center">
        <Link href="/" className="inline-block group focus:outline-none">
          <h1 className="masthead-chrome font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black tracking-[0.04em] text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-white to-slate-500 group-hover:to-white transition-colors duration-300 leading-[0.88]">
            SICKSAINT
          </h1>
          <p className="mt-4 sm:mt-5 font-serif italic text-sm sm:text-base md:text-lg text-brand-textMuted tracking-wide">
            The World, Without The Noise.
          </p>
        </Link>
      </div>

      {/* 3. Hairline Printed Publication Divider */}
      <div className="border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-[10px] font-condensed tracking-widest text-brand-textSubtle uppercase">
          <span>AN INDEPENDENT JOURNAL OF FASHION, CULTURE &amp; DISSIDENT THOUGHT</span>
          <span className="hidden sm:inline">PRINTED IN NEW YORK CITY · WORLDWIDE SYNDICATION</span>
          <span>PRICE: $12.00 USD</span>
        </div>
      </div>
    </header>
  );
}
