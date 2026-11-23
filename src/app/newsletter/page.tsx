'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle2, ShieldCheck, Sparkles, Send } from 'lucide-react';
import { subscribeNewsletter } from '../../lib/api';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    try {
      const res = await subscribeNewsletter(email);
      setStatus(res.success ? 'success' : 'error');
      setMessage(res.message);
    } catch {
      setStatus('error');
      setMessage('Subscription failed. Please verify your address and retry.');
    }
  };

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

        <div className="bg-brand-surface border border-brand-border p-8 sm:p-14 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-brand-accent uppercase mb-4">
            <Sparkles className="w-4 h-4 text-brand-accent" />
            <span>WEEKLY SYNDICATED DISPATCHES</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-black text-brand-text tracking-tight leading-tight">
            The SICKSAINT Dispatch
          </h1>

          <p className="mt-4 text-base sm:text-lg font-serif text-brand-textMuted leading-relaxed">
            Delivered every Sunday at 06:00 UTC. A rigorous synthesis of sovereign compute infrastructure, geopolitical intelligence, dark liquidity, and brutalist culture.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-brand-border py-6 text-xs font-mono text-brand-textMuted">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-accent shrink-0" />
              <span>ZERO TRACKING PIXELS</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-accent shrink-0" />
              <span>ZERO MARKETING SPONSORS</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-accent shrink-0" />
              <span>STRICT PEER CITATIONS</span>
            </div>
          </div>

          {status === 'success' ? (
            <div className="mt-8 p-6 bg-brand-card border border-brand-accent/40 text-brand-text">
              <div className="flex items-center gap-2 text-brand-accent font-mono text-sm font-bold uppercase mb-2">
                <CheckCircle2 className="w-5 h-5 text-brand-accent" />
                <span>SUBSCRIPTION CONFIRMED</span>
              </div>
              <p className="text-sm font-serif text-brand-textMuted leading-relaxed">
                {message || 'Your address has been added to our private dispatch queue. The upcoming weekly brief will arrive noise-free.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your confidential email address..."
                  className="flex-1 bg-brand-bg border border-brand-border px-5 py-4 text-sm font-mono text-brand-text placeholder-brand-textSubtle focus:outline-none focus:border-brand-accent transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-8 py-4 bg-brand-accent text-brand-bg font-mono text-xs font-bold tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{status === 'loading' ? 'TRANSMITTING...' : 'SUBSCRIBE'}</span>
                </button>
              </div>

              {status === 'error' && (
                <p className="text-xs font-mono text-red-400">{message}</p>
              )}

              <p className="text-[11px] font-mono text-brand-textSubtle leading-relaxed">
                By subscribing, you agree to receive editorial dispatches from SICKSAINT. We strictly respect your privacy. No data is ever sold or syndicated to third-party ad networks. Unsubscribe with one click anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
