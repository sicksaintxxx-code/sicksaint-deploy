import React from 'react';
import Link from 'next/link';
import { Rss, Shield, BookOpen, Sparkles, Mail, Globe, ArrowRight } from 'lucide-react';

const CATEGORIES_COL_1 = [
  { name: 'World', href: '/category/world' },
  { name: 'Politics', href: '/category/politics' },
  { name: 'Business', href: '/category/business' },
  { name: 'Finance', href: '/category/finance' },
  { name: 'Technology', href: '/category/technology' },
  { name: 'Artificial Intelligence', href: '/category/ai' },
  { name: 'Science', href: '/category/science' },
  { name: 'Health', href: '/category/health' },
  { name: 'Culture', href: '/category/culture' },
  { name: 'Architecture', href: '/category/architecture' },
];

const CATEGORIES_COL_2 = [
  { name: 'Film & Television', href: '/category/film' },
  { name: 'Music', href: '/category/music' },
  { name: 'Fashion', href: '/category/fashion' },
  { name: 'Lifestyle', href: '/category/lifestyle' },
  { name: 'Gaming', href: '/category/gaming' },
  { name: 'Sports', href: '/category/sports' },
  { name: 'Automotive', href: '/category/automotive' },
  { name: 'Travel', href: '/category/travel' },
  { name: 'Photography', href: '/category/photography' },
  { name: 'Editorial Standards', href: '/editorial-standards' },
];

const SPECIAL_FORMATS = [
  { name: 'WordPress Journal', href: '/blog' },
  { name: 'Investigations', href: '/investigations' },
  { name: 'Long Reads', href: '/long-reads' },
  { name: 'Interviews & Dialogues', href: '/interviews' },
  { name: 'Photo Essays', href: '/photo-essays' },
  { name: 'Critical Opinion', href: '/opinion' },
  { name: 'Reviews & Analysis', href: '/reviews' },
  { name: 'Technical Guides', href: '/guides' },
  { name: 'Explained Dossiers', href: '/explained' },
  { name: "Editor's Picks", href: '/editors-picks' },
  { name: 'Latest Stream', href: '/latest' },
  { name: 'Trending Dispatches', href: '/trending' },
];

const INSTITUTIONAL_LINKS = [
  { name: 'About SICKSAINT', href: '/about' },
  { name: 'Editorial Standards', href: '/editorial-standards' },
  { name: 'The Manifesto', href: '/manifesto' },
  { name: 'Contact & Pitch', href: '/contact' },
  { name: 'Advertising & Syndication', href: '/advertise' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Publication', href: '/terms' },
  { name: 'Cookie Preferences', href: '/cookies' },
  { name: 'Accessibility Statement', href: '/accessibility' },
];

export default function Footer() {
  return (
    <footer className="bg-brand-surface border-t border-brand-border transition-colors pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Colophon & Newsletter Banner */}
        <div className="pb-12 border-b border-brand-border grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <Link href="/" className="inline-block group">
              <span className="text-4xl sm:text-5xl font-serif font-black tracking-tight text-brand-text group-hover:text-brand-burgundy transition-colors">
                SICKSAINT
              </span>
            </Link>
            <p className="mt-2 text-xs font-condensed tracking-[0.25em] text-brand-burgundy uppercase font-bold">
              AN INDEPENDENT JOURNAL OF FASHION, CULTURE &amp; DISSIDENT THOUGHT
            </p>
            <p className="mt-4 text-sm font-serif text-brand-textMuted leading-relaxed max-w-xl">
              Founded in New York in the late 1990s. SICKSAINT documents the friction between underground culture, razor tailoring, macro statecraft, and analog aesthetic discipline. Published without algorithmic filler or corporate noise.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px] font-condensed tracking-wider text-brand-textMuted">
              <span className="text-brand-text font-bold uppercase">EDITORIAL BUREAUS:</span>
              <span>NEW YORK</span>
              <span className="text-brand-border">·</span>
              <span>PARIS</span>
              <span className="text-brand-border">·</span>
              <span>TOKYO</span>
              <span className="text-brand-border">·</span>
              <span>BERLIN</span>
              <span className="text-brand-border">·</span>
              <span>LONDON</span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-brand-surface border border-brand-border p-6">
            <div className="flex items-center gap-2 text-xs font-condensed text-brand-burgundy font-bold uppercase tracking-[0.2em] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE SICKSAINT DISPATCH</span>
            </div>
            <p className="text-xs font-serif text-brand-textMuted mb-4">
              A private weekly brief of deep fashion monographs, underground dialogues, and aesthetic essays. Zero commercial noise.
            </p>
            <Link
              href="/newsletter"
              className="inline-flex items-center justify-between w-full px-4 py-3 bg-brand-card border border-brand-border text-xs font-condensed tracking-wider text-brand-text hover:border-brand-burgundy hover:text-brand-burgundy transition-all font-semibold"
            >
              <span>ACCESS WEEKLY DISPATCHES</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-burgundy" />
            </Link>
          </div>
        </div>

        {/* Multi-Column Nav Grid */}
        <div className="py-12 border-b border-brand-border grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Departments A */}
          <div>
            <h4 className="text-[11px] font-mono font-bold tracking-widest text-brand-text uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-accent"></span>
              DEPARTMENTS I
            </h4>
            <ul className="space-y-2 text-xs font-serif text-brand-textMuted">
              {CATEGORIES_COL_1.map((cat) => (
                <li key={cat.name}>
                  <Link href={cat.href} className="hover:text-brand-accent transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Departments B */}
          <div>
            <h4 className="text-[11px] font-mono font-bold tracking-widest text-brand-text uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-accent"></span>
              DEPARTMENTS II
            </h4>
            <ul className="space-y-2 text-xs font-serif text-brand-textMuted">
              {CATEGORIES_COL_2.map((cat) => (
                <li key={cat.name}>
                  <Link href={cat.href} className="hover:text-brand-accent transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Editorial Formats */}
          <div>
            <h4 className="text-[11px] font-mono font-bold tracking-widest text-brand-text uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-accent"></span>
              SPECIAL FORMATS
            </h4>
            <ul className="space-y-2 text-xs font-serif text-brand-textMuted">
              {SPECIAL_FORMATS.map((fmt) => (
                <li key={fmt.name}>
                  <Link href={fmt.href} className="hover:text-brand-accent transition-colors">
                    {fmt.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Institutional & Legal */}
          <div>
            <h4 className="text-[11px] font-mono font-bold tracking-widest text-brand-text uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-accent"></span>
              INSTITUTION
            </h4>
            <ul className="space-y-2 text-xs font-serif text-brand-textMuted">
              {INSTITUTIONAL_LINKS.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-brand-accent transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="/api/feed/rss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-mono text-brand-accent hover:underline font-semibold"
                >
                  <Rss className="w-3.5 h-3.5" />
                  <span>RSS 2.0 SYNDICATION</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Colophon & Compliance Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] font-condensed tracking-wider text-brand-textSubtle gap-4">
          <p>© 2026 SICKSAINT PUBLISHING GROUP · NEW YORK, NY · ISSN 2994-1802</p>
          <div className="flex items-center space-x-6 font-mono text-[10px]">
            <span>PRINT VOL. XXVII</span>
            <span>·</span>
            <span>ISSUE NO. 04</span>
            <span>·</span>
            <span className="text-brand-burgundy font-semibold">WORDPRESS-POWERED JOURNAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
