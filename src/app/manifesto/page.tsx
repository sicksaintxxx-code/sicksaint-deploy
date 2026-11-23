import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Cpu, Compass } from 'lucide-react';

export const metadata = {
  title: 'The SICKSAINT Manifesto — The World, Without The Noise',
  description: 'Our journalistic declaration: why international digital media must break free from algorithmic rage-bait, programmatic pollution, and superficial commentary.',
};

export default function ManifestoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-mono text-brand-textMuted hover:text-brand-accent transition-colors font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO FRONT PAGE</span>
        </Link>
      </div>

      <header className="border-b border-brand-border pb-8 mb-10">
        <div className="text-xs font-mono font-bold tracking-widest text-brand-accent uppercase">
          [EDITORIAL DECLARATION & CODE]
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-brand-text tracking-tight mt-2">
          THE SICKSAINT MANIFESTO
        </h1>
        <p className="mt-3 text-base sm:text-xl font-mono text-brand-textMuted uppercase tracking-widest font-semibold">
          THE WORLD, WITHOUT THE NOISE.
        </p>
      </header>

      <div className="font-serif text-brand-text leading-[1.88] text-lg sm:text-xl space-y-8">
        <p className="editorial-drop-cap">
          We live in an epoch poisoned by ambient static. The modern digital publishing landscape has surrendered itself to the tyranny of the impression, the algorithmic outrage cycle, and the commodification of panic. Content mills churn out unverified speculation designed not to illuminate, but to agitate.
        </p>

        <p>
          <strong className="text-brand-text font-bold">SICKSAINT was founded on a contrary conviction:</strong> that serious people around the world demand serious, uncompromising, distraction-free journalism. We believe clarity is a prerequisite for sovereign judgment.
        </p>

        <div className="my-10 p-8 sm:p-10 bg-brand-surface border border-brand-border not-prose">
          <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-brand-accent mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-accent"></span>
            OUR FIVE EDITORIAL AXIOMS
          </h3>
          <ul className="space-y-6 text-sm sm:text-base font-serif text-brand-textMuted">
            <li className="flex items-start gap-4">
              <span className="font-mono font-black text-brand-accent text-base">01.</span>
              <span><strong className="text-brand-text font-bold">Zero Algorithmic Recommendation:</strong> Human editors curate our editions. We do not personalize feeds to reinforce confirmation bias. Every reader encounters the same objective reality.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="font-mono font-black text-brand-accent text-base">02.</span>
              <span><strong className="text-brand-text font-bold">Physical Realism:</strong> Power is not abstract. We trace power to its physical anchors: subsea optical fiber repeaters, copper mines, compute enclaves, deep-water port concessions, and central bank balance sheets.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="font-mono font-black text-brand-accent text-base">03.</span>
              <span><strong className="text-brand-text font-bold">Typographic Dignity:</strong> A publication’s aesthetic is an ethical stance. We eliminate intrusive popups, floating banners, and algorithmic auto-play videos in favor of clean, book-grade reading environments.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="font-mono font-black text-brand-accent text-base">04.</span>
              <span><strong className="text-brand-text font-bold">Cold Storage Verification:</strong> Every investigative claim is backed by telemetry, primary documentation, and verifiable paper trails archived independently.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="font-mono font-black text-brand-accent text-base">05.</span>
              <span><strong className="text-brand-text font-bold">Independence of Capital:</strong> We accept no sovereign state subsidies, hidden affiliate incentives, or native sponsored content disguised as objective journalism.</span>
            </li>
          </ul>
        </div>

        <p>
          We do not report on rumors. We report on the structural currents that determine how nations allocate capital, deploy silicon, command oceans, and construct civilizations.
        </p>

        <p className="font-bold text-brand-text text-xl sm:text-2xl pt-2">
          Welcome to SICKSAINT. The world, without the noise.
        </p>
      </div>

      <div className="mt-14 pt-8 border-t border-brand-border flex flex-col sm:flex-row items-start sm:items-center justify-between font-mono text-xs text-brand-textSubtle gap-3">
        <span>ZURICH · TOKYO · REYKJAVIK · LONDON · SINGAPORE</span>
        <span className="text-brand-accent font-bold uppercase">THE SICKSAINT EDITORIAL BOARD</span>
      </div>
    </div>
  );
}
