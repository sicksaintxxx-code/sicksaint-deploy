import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';

export const metadata = {
  title: 'Accessibility Statement — SICKSAINT',
  description: 'Our commitment to inclusive, keyboard-navigable, high-contrast digital journalism.',
};

export default function AccessibilityPage() {
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
            ACCESSIBILITY PROTOCOL
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-brand-text tracking-tight mt-2">
            Accessibility Statement
          </h1>
          <p className="mt-3 text-xs font-mono text-brand-textSubtle">
            WCAG 2.1 AA COMPLIANCE COMMITMENT
          </p>
        </div>

        <div className="space-y-8 font-serif text-brand-textMuted text-lg leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-black text-brand-text">1. High-Contrast Typography</h2>
            <p>
              Our color system (high-contrast ivory #F3F1ED on deep obsidian #080808) is specifically engineered to exceed WCAG 2.1 Level AAA contrast ratios for body reading comfort.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-black text-brand-text">2. Keyboard Navigation</h2>
            <p>
              All interactive navigation bars, search modals, audio controls, and article drawers can be navigated seamlessly using keyboard Tab and Enter keys. Press <kbd className="font-mono text-xs px-1.5 py-0.5 bg-brand-surface border border-brand-border text-brand-accent">/</kbd> anywhere to activate instant search.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-black text-brand-text">3. Reduced Motion Support</h2>
            <p>
              We honor the standard CSS <code className="font-mono text-xs text-brand-accent">prefers-reduced-motion</code> media query, disabling continuous marquee transitions and animations for readers with vestibular sensitivities.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
