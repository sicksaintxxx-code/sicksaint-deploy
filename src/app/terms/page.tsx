import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Publication — SICKSAINT',
  description: 'Terms governing intellectual property, archival reproduction, and readership.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-brand-textMuted hover:text-brand-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO FRONT PAGE</span>
          </Link>
        </div>

        <div className="border-b border-brand-border pb-10 mb-12">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-accent uppercase">
            LEGAL PROTOCOL
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-brand-text tracking-tight mt-2">
            Terms of Publication
          </h1>
          <p className="mt-3 text-xs font-mono text-brand-textSubtle">
            EFFECTIVE: NOVEMBER 2026 · INTERNATIONAL EDITION
          </p>
        </div>

        <div className="space-y-8 font-serif text-brand-textMuted text-lg leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-black text-brand-text">1. Copyright and Intellectual Property</h2>
            <p>
              All articles, investigative reports, photographic portfolios, audio dispatches, and structural diagrams published on SICKSAINT are the exclusive intellectual property of SICKSAINT and its contributing correspondents.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-black text-brand-text">2. Academic and Research Citation</h2>
            <p>
              Short excerpts (up to 200 words) may be reproduced for non-commercial academic research or journalistic commentary, provided explicit attribution to SICKSAINT and a canonical link to the original URL is included.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
