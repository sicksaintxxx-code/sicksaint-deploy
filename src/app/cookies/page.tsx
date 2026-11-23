import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Cookie } from 'lucide-react';

export const metadata = {
  title: 'Cookie Preferences & Policy — SICKSAINT',
  description: 'Cookie policy and local storage transparency for SICKSAINT.',
};

export default function CookiesPage() {
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
            LOCAL STORAGE TRANSPARENCY
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-brand-text tracking-tight mt-2">
            Cookie Policy
          </h1>
          <p className="mt-3 text-xs font-mono text-brand-textSubtle">
            SUMMARY: WE DO NOT USE TRACKING COOKIES.
          </p>
        </div>

        <div className="space-y-8 font-serif text-brand-textMuted text-lg leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-black text-brand-text">Essential Storage Only</h2>
            <p>
              SICKSAINT uses only strictly necessary browser session storage or local storage keys to preserve reading preferences (such as audio player playback volume, font size adjustments, and newsletter dismissal state).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-black text-brand-text">No Consent Banners Required</h2>
            <p>
              Because we store zero non-essential marketing, analytics, or third-party cookies, there are no intrusive cookie consent popups obstructing your reading experience.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
