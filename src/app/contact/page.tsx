import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, Building2 } from 'lucide-react';

export const metadata = {
  title: 'Contact & Secure Pitch — SICKSAINT',
  description: 'Confidential news tips, editorial inquiries, and bureau contacts for SICKSAINT.',
};

export default function ContactPage() {
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
            EDITORIAL DESK TRANSMISSIONS
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-brand-text tracking-tight mt-2">
            Contact SICKSAINT
          </h1>
          <p className="mt-4 text-base sm:text-lg font-serif text-brand-textMuted">
            For investigative leaks, whistleblowers, academic pitches, and institutional syndication requests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Secure Tips */}
          <div className="bg-brand-surface border border-brand-border p-8">
            <div className="flex items-center gap-2 text-xs font-mono text-brand-accent font-bold uppercase mb-3">
              <Lock className="w-4 h-4 text-brand-accent" />
              <span>CONFIDENTIAL LEAKS & WHISTLEBLOWING</span>
            </div>
            <h2 className="text-2xl font-serif font-black text-brand-text mb-3">Encrypted Submissions</h2>
            <p className="text-sm font-serif text-brand-textMuted leading-relaxed mb-4">
              We operate encrypted drop endpoints and Signal communication handles for sensitive primary source documentation.
            </p>
            <div className="text-xs font-mono text-brand-text bg-brand-card p-3 border border-brand-border">
              tips@sicksaint.live (PGP Key Available Upon Request)
            </div>
          </div>

          {/* General Bureau Inquiries */}
          <div className="bg-brand-surface border border-brand-border p-8">
            <div className="flex items-center gap-2 text-xs font-mono text-brand-accent font-bold uppercase mb-3">
              <Building2 className="w-4 h-4 text-brand-accent" />
              <span>EDITORIAL BUREAU CONTACT</span>
            </div>
            <h2 className="text-2xl font-serif font-black text-brand-text mb-3">Press & Pitch Desk</h2>
            <p className="text-sm font-serif text-brand-textMuted leading-relaxed mb-4">
              Correspondents, university researchers, and independent photographers seeking to file formal inquiries.
            </p>
            <div className="text-xs font-mono text-brand-text bg-brand-card p-3 border border-brand-border">
              editorial@sicksaint.live
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
