import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — SICKSAINT',
  description: 'Our strict zero-surveillance data and privacy policy.',
};

export default function PrivacyPage() {
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
            DATA SOVEREIGNTY PROTOCOL
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-black text-brand-text tracking-tight mt-2">
            Privacy Policy
          </h1>
          <p className="mt-3 text-xs font-mono text-brand-textSubtle">
            LAST REVISED: NOVEMBER 2026 · ZERO SURVEILLANCE COMMITMENT
          </p>
        </div>

        <div className="space-y-8 font-serif text-brand-textMuted text-lg leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-black text-brand-text">1. Zero Third-Party Tracking</h2>
            <p>
              SICKSAINT does not embed Facebook Pixel, Google AdSense, cross-site behavioral cookies, fingerprinting libraries, or programmatic data broker beacons.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-black text-brand-text">2. Newsletter Data Minimization</h2>
            <p>
              When you submit your email for weekly dispatches, your address is stored securely and used solely to transmit SICKSAINT dispatches. It is never sold, leased, or cross-referenced with advertising identity networks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-black text-brand-text">3. Server Telemetry</h2>
            <p>
              Our web servers process standard HTTP request headers strictly for edge routing and DDOS mitigation. Web server access logs are purged periodically.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
