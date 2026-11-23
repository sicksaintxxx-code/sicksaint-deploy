import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, CheckCircle2, FileCheck } from 'lucide-react';

export const metadata = {
  title: 'Editorial Standards & Verification Code — SICKSAINT',
  description: 'The strict ethical, factual, and journalistic verification code governing SICKSAINT dispatches.',
};

export default function EditorialStandardsPage() {
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
            INTEGRITY & VERIFICATION CODE
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-brand-text tracking-tight mt-2">
            Editorial Standards
          </h1>
          <p className="mt-4 text-base sm:text-lg font-serif text-brand-textMuted">
            The non-negotiable protocols ensuring that every sentence, metric, and citation published under the SICKSAINT colophon is accurate and independently verifiable.
          </p>
        </div>

        <div className="space-y-10 font-serif text-brand-textMuted text-lg leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-black text-brand-text flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-brand-accent" />
              <span>1. Dual-Source Verification Rule</span>
            </h2>
            <p>
              No factual claim involving sovereign defense, financial flows, corporate litigation, or technical capabilities is published without corroboration from at least two independent primary sources or verifiable public registry documents.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-black text-brand-text flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-brand-accent" />
              <span>2. Separation of News and Opinion</span>
            </h2>
            <p>
              We maintain a rigorous structural boundary between investigative dispatches, background dossiers, and signed opinion essays. Opinion pieces reflect the philosophical posture of the author and are explicitly labeled as <span className="font-mono text-brand-accent text-sm">ESSAY</span> or <span className="font-mono text-brand-accent text-sm">OPINION</span>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-black text-brand-text flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-brand-accent" />
              <span>3. Corrections and Revisions</span>
            </h2>
            <p>
              When an error of fact occurs, it is rectified transparently within the article body with an archival colophon detailing the exact modification, timestamp, and context of the correction.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-black text-brand-text">4. Commercial Independence</h2>
            <p>
              SICKSAINT does not accept sponsored content disguised as editorial reporting. We do not participate in affiliate clickbait programs or undisclosed corporate brand promotions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
