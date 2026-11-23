import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Shield, BarChart3 } from 'lucide-react';

export const metadata = {
  title: 'Advertising & Syndication — SICKSAINT',
  description: 'Bespoke corporate underwriting, print edition monographs, and high-signal institutional syndication.',
};

export default function AdvertisePage() {
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
            UNDERWRITING & SYNDICATION
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-brand-text tracking-tight mt-2">
            Partnerships & Underwriting
          </h1>
          <p className="mt-4 text-base sm:text-lg font-serif text-brand-textMuted">
            SICKSAINT does not support programmatic display banners, intrusive popups, or tracking ad scripts. We partner strictly with brands that align with architectural craft, sovereign engineering, and physical durability.
          </p>
        </div>

        <div className="space-y-10 font-serif text-brand-textMuted text-lg leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-black text-brand-text">Audience Demographics</h2>
            <p>
              Our readership consists of senior technology architects, macroeconomic portfolio managers, sovereign wealth fiduciaries, civil engineers, industrial designers, and institutional researchers across 84 countries.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-black text-brand-text">Available Sponsorship Vectors</h2>
            <ul className="list-disc pl-6 space-y-2 text-base font-sans text-brand-text">
              <li><strong>Monograph Underwriting:</strong> Single-sponsor underwriting of quarterly print dossiers and collector slipcases.</li>
              <li><strong>Weekly Dispatch Sponsorship:</strong> Exclusive text-only patron mention in our weekly Sunday email dispatch to 45,000+ verified readers.</li>
              <li><strong>Institutional Syndication:</strong> Enterprise RSS access for corporate research libraries and intelligence terminals.</li>
            </ul>
          </section>

          <div className="p-6 bg-brand-surface border border-brand-border text-xs font-mono">
            <div className="text-brand-accent font-bold uppercase mb-2">COMMERCIAL INQUIRIES:</div>
            <p className="text-brand-text">partnerships@sicksaint.live</p>
          </div>
        </div>
      </div>
    </div>
  );
}
