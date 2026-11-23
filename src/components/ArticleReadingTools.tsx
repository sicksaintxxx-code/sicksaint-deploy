'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Check, Bookmark, Twitter, Copy } from 'lucide-react';

export default function ArticleReadingTools({ title }: { title: string }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareTwitter = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`${title} — SICKSAINT: The World, Without The Noise.`);
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    }
  };

  return (
    <>
      {/* 1. Fixed Reading Progress Bar at the absolute top of the screen */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-brand-border z-50">
        <div
          className="h-full bg-brand-burgundy transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Interactive Share & Archival Bar */}
      <div className="py-4 border-y border-brand-border flex items-center justify-between text-xs font-mono text-brand-textMuted my-8">
        <div className="flex items-center gap-2 font-condensed tracking-wider">
          <span className="text-[11px] uppercase font-bold text-brand-burgundy tracking-[0.2em]">
            EDITORIAL ARCHIVE TOOLS
          </span>
          <span className="hidden sm:inline text-brand-textSubtle">|</span>
          <span className="hidden sm:inline text-brand-textSubtle text-[11px] font-mono">
            {Math.round(scrollProgress)}% READ
          </span>
        </div>

        <div className="flex items-center gap-2.5 font-condensed text-xs tracking-wider">
          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            aria-label="Copy link to clipboard"
            className="flex items-center gap-1.5 px-3 py-1 bg-brand-surface border border-brand-border hover:border-brand-burgundy text-brand-text transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-brand-burgundy" />
                <span className="text-brand-burgundy font-bold">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>COPY LINK</span>
              </>
            )}
          </button>

          {/* Share to X */}
          <button
            onClick={handleShareTwitter}
            aria-label="Share on X"
            className="flex items-center gap-1.5 px-3 py-1 bg-brand-surface border border-brand-border hover:border-brand-burgundy text-brand-text transition-colors"
          >
            <Twitter className="w-3.5 h-3.5 text-brand-burgundy" />
            <span className="hidden sm:inline">DISPATCH ON X</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={() => setBookmarked(!bookmarked)}
            aria-label="Bookmark article"
            className={`p-1.5 bg-brand-surface border transition-colors ${
              bookmarked
                ? 'border-brand-burgundy text-brand-burgundy'
                : 'border-brand-border text-brand-textMuted hover:text-brand-text'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  );
}
