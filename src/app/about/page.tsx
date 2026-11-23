import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe, Shield, BookOpen, Layers } from 'lucide-react';

export const metadata = {
  title: 'About SICKSAINT — The World, Without The Noise',
  description: 'The editorial thesis, colophon, and institutional structure of SICKSAINT.',
};

export default function AboutPage() {
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
            INSTITUTIONAL CHARTER
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-brand-text tracking-tight mt-2">
            About SICKSAINT
          </h1>
          <p className="mt-4 text-lg sm:text-xl font-mono text-brand-accent font-semibold tracking-wide">
            THE WORLD, WITHOUT THE NOISE.
          </p>
        </div>

        <div className="space-y-10 font-serif text-brand-textMuted text-lg leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-black text-brand-text">I. The Foundational Thesis</h2>
            <p>
              Contemporary digital media is broken by design. Driven by programmatic advertising incentives, editorial rooms across the globe have traded analytical depth for algorithm-pleasing churn, synthetic outrage, and disposable summaries.
            </p>
            <p>
              <strong className="text-brand-text font-bold">SICKSAINT was established as a deliberate counter-institution.</strong> We operate on a singular editorial mandate: filter out the ephemeral static and report with forensic rigor on the physical, technological, and economic realities that genuinely move human history.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-black text-brand-text">II. Editorial Scope</h2>
            <p>
              Our bureaus in Zurich, Tokyo, Reykjavik, and London focus on four primary pillars:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base font-sans text-brand-text">
              <li><strong>Sovereign Statecraft:</strong> Subsea fiber cabals, rare-earth supply chokepoints, and extraterritorial charter cities.</li>
              <li><strong>Frontier Compute:</strong> Autonomous agent clusters, post-quantum cryptanalysis, and subterranean data sanctuaries.</li>
              <li><strong>Shadow Capital:</strong> Sovereign wealth allocation, bilateral energy settlements, and algorithmic bond market liquidity.</li>
              <li><strong>Tactile Culture:</strong> Neo-brutalist architecture, large-format 70mm cinema, silver halide photography, and archival tailoring.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-black text-brand-text">III. Zero Synthetics Policy</h2>
            <p>
              We do not publish automated, unverified artificial news. Every article, dossier, and photographic essay undergoes rigorous verification by human correspondents, fact-checkers, and subject-matter specialists before release.
            </p>
          </section>

          <div className="pt-8 border-t border-brand-border flex flex-wrap gap-4 text-xs font-mono">
            <Link
              href="/editorial-standards"
              className="px-5 py-3 bg-brand-surface border border-brand-border text-brand-text hover:border-brand-accent hover:text-brand-accent transition-colors font-semibold"
            >
              READ EDITORIAL STANDARDS →
            </Link>
            <Link
              href="/manifesto"
              className="px-5 py-3 bg-brand-accent text-brand-bg font-bold tracking-widest hover:bg-white transition-colors"
            >
              EXPLORE THE MANIFESTO →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
