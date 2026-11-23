'use client';

import React, { useState } from 'react';
import { Check, AlertCircle, Mail, Sparkles, Send } from 'lucide-react';
import { subscribeNewsletter } from '../lib/api';

export default function NewsletterModal() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid institutional or personal email.');
      return;
    }

    setStatus('loading');
    const res = await subscribeNewsletter(email);
    if (res.success) {
      setStatus('success');
      setMessage(res.message);
      setEmail('');
    } else {
      setStatus('error');
      setMessage(res.message);
    }
  };

  return (
    <section
      id="newsletter"
      className="my-20 border-y border-brand-border py-16 sm:py-20 px-4 sm:px-6 bg-brand-surface relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-card border border-brand-border text-brand-accent text-[11px] font-mono tracking-widest uppercase font-bold mb-4">
          <Mail className="w-3.5 h-3.5" />
          <span>WEEKLY EDITORIAL TRANSMISSION</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-brand-text tracking-tight">
          THE NOISELESS DISPATCH
        </h2>

        <p className="mt-4 text-sm sm:text-base text-brand-textMuted font-serif max-w-2xl mx-auto leading-relaxed">
          Every Sunday morning, our editorial collective delivers a synthesized intelligence brief on global infrastructure, autonomous compute enclaves, sovereign capital, and tactile culture. Zero algorithms. Zero noise.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 max-w-lg mx-auto flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
            placeholder="Enter institutional or personal email..."
            className="flex-1 px-4 py-3.5 bg-brand-bg border border-brand-border text-brand-text text-sm font-sans placeholder-brand-textSubtle focus:outline-none focus:border-brand-accent transition-colors"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="px-7 py-3.5 bg-brand-burgundy text-white text-xs font-condensed font-bold tracking-wider uppercase hover:bg-brand-burgundy/80 transition-colors whitespace-nowrap flex items-center justify-center gap-1.5"
          >
            <span>{status === 'loading' ? 'TRANSMITTING...' : 'SUBSCRIBE'}</span>
            <Send className="w-3 h-3" />
          </button>
        </form>

        {status === 'success' && (
          <div className="mt-5 inline-flex items-center gap-2 text-xs font-mono text-brand-accent bg-brand-card border border-brand-border px-4 py-2">
            <Check className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-5 inline-flex items-center gap-2 text-xs font-mono text-brand-red bg-brand-card border border-brand-border px-4 py-2">
            <AlertCircle className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[10px] sm:text-[11px] font-mono text-brand-textSubtle uppercase">
          <span>ZERO SPAM COMMITMENT</span>
          <span>·</span>
          <span>ONE-CLICK UNSUBSCRIBE</span>
          <span>·</span>
          <span>NO TRACKING PIXELS</span>
        </div>
      </div>
    </section>
  );
}
