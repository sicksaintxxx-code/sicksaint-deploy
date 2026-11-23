'use client';

import React from 'react';

interface EditorialPlaceholderProps {
  category?: string;
  title?: string;
  className?: string;
  aspectRatio?: string;
}

/**
 * Clean editorial placeholder used when no authentic photograph is available.
 * Styled as a 1990s magazine layout with typographic treatment.
 * Easy to replace: swap out the entire component with a real <img> tag later.
 */
export default function EditorialPlaceholder({
  category,
  title,
  className = '',
  aspectRatio = 'aspect-[16/10]',
}: EditorialPlaceholderProps) {
  return (
    <div
      className={`editorial-placeholder ${aspectRatio} ${className} bg-brand-surface border border-brand-border flex flex-col items-center justify-center relative overflow-hidden select-none`}
      aria-label={`Editorial placeholder${title ? `: ${title}` : ''}`}
    >
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #E9E4DA 0px, #E9E4DA 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, #E9E4DA 0px, #E9E4DA 1px, transparent 1px, transparent 24px)',
        }}
      />
      {/* Category label */}
      {category && (
        <span className="kicker-label text-brand-accent mb-3 relative z-10">
          {category.toUpperCase()}
        </span>
      )}
      {/* Typography placeholder */}
      <div className="relative z-10 text-center px-6">
        <div className="font-serif text-brand-textSubtle text-xs sm:text-sm italic leading-relaxed line-clamp-2 max-w-[200px]">
          {title ? `"${title}"` : '[SICKSAINT EDITORIAL ARCHIVE]'}
        </div>
      </div>
      {/* Bottom credit line */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center">
        <span className="font-mono text-[9px] text-brand-textSubtle tracking-widest uppercase">
          PHOTOGRAPH PENDING · SICKSAINT
        </span>
      </div>
      {/* Decorative corner marks */}
      <span className="absolute top-3 left-3 w-4 h-4 border-t border-l border-brand-border opacity-60" />
      <span className="absolute top-3 right-3 w-4 h-4 border-t border-r border-brand-border opacity-60" />
      <span className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-brand-border opacity-60" />
      <span className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-brand-border opacity-60" />
    </div>
  );
}
