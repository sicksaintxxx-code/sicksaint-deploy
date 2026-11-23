'use client'

import React, { useState } from 'react'
import { MessageSquare, Send, CheckCircle2, ShieldCheck, User } from 'lucide-react'

interface Comment {
  id: string
  author: string
  bylineTitle?: string
  content: string
  createdAt: string
  curated: boolean
}

export default function ArticleComments({ articleTitle }: { articleTitle: string }) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'comm-1',
      author: 'Elias Thorne',
      bylineTitle: 'Quantitative Systems Fellow',
      content:
        'The geopolitical vulnerability highlighted here in Section II aligns precisely with the 2025 Nordic Maritime telemetry reports. If undersea dark pools are subject to state sovereign interdiction, alternative latency-tolerant settlement networks will become the baseline within twenty-four months.',
      createdAt: '2 days ago',
      curated: true,
    },
    {
      id: 'comm-2',
      author: 'Sophia Vance-Chen',
      bylineTitle: 'Sovereign Debt Researcher',
      content:
        'Crucial point regarding subsea optical repeaters: the supply chain for high-pressure erbium-doped optical amplifiers is concentrated among just two sovereign consortia. Exceptional investigative depth as always.',
      createdAt: 'Yesterday',
      curated: true,
    },
  ])

  const [authorName, setAuthorName] = useState('')
  const [content, setContent] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() || !authorName.trim()) return

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      author: authorName.trim(),
      bylineTitle: 'Verified Reader',
      content: content.trim(),
      createdAt: 'Just now',
      curated: false,
    }

    setComments((prev) => [newComment, ...prev])
    setContent('')
    setAuthorName('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <section className="mt-16 pt-10 border-t border-brand-border">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 border-b border-brand-border mb-8">
        <h3 className="font-mono text-xs font-bold tracking-widest text-brand-text uppercase flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-accent" />
          <span>EDITORIAL DISCOURSE & READER ANALYSIS ({comments.length})</span>
        </h3>
        <span className="font-mono text-[10px] text-brand-textSubtle tracking-wider uppercase hidden sm:inline">
          HIGH-SIGNAL CURATED FORUM
        </span>
      </div>

      {/* Comment Input Form */}
      <form onSubmit={handleSubmit} className="mb-10 p-5 bg-brand-surface border border-brand-border space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block font-mono text-[10px] uppercase tracking-widest text-brand-textMuted mb-1.5">
              Your Name / Verified Byline
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Elena Rostova"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-brand-card border border-brand-border text-brand-text px-3 py-2 font-mono text-xs focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-brand-textMuted mb-1.5">
            Your Perspective / Argument
          </label>
          <textarea
            required
            rows={3}
            placeholder="Add reasoned analytical commentary or corroborating data..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-brand-card border border-brand-border text-brand-text p-3 font-sans text-xs focus:outline-none focus:border-brand-accent transition-colors leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="font-mono text-[10px] text-brand-textSubtle">
            All contributions undergo editorial signal review.
          </span>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-accent text-brand-bg font-mono text-xs font-bold tracking-widest hover:bg-white transition-colors uppercase"
          >
            <Send className="w-3.5 h-3.5" />
            <span>DISPATCH COMMENT</span>
          </button>
        </div>

        {submitted && (
          <div className="p-3 border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Comment submitted to the editorial discourse stream.</span>
          </div>
        )}
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comm) => (
          <div key={comm.id} className="p-5 bg-brand-card border border-brand-border/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-brand-secondary border border-brand-border flex items-center justify-center font-bold text-[9px] text-brand-accent font-mono">
                  {comm.author.slice(0, 2).toUpperCase()}
                </div>
                <span className="font-serif font-bold text-sm text-brand-text">
                  {comm.author}
                </span>
                {comm.bylineTitle && (
                  <span className="font-mono text-[10px] text-brand-textSubtle hidden sm:inline">
                    · {comm.bylineTitle}
                  </span>
                )}
                {comm.curated && (
                  <span className="px-1.5 py-0.2 border border-brand-accent/40 bg-brand-accent/10 text-brand-accent font-mono text-[9px] uppercase tracking-wider font-semibold">
                    CURATED SIGNAL
                  </span>
                )}
              </div>
              <span className="font-mono text-[10px] text-brand-textSubtle">{comm.createdAt}</span>
            </div>

            <p className="font-sans text-xs sm:text-sm text-brand-text/90 leading-relaxed font-light pl-8">
              {comm.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
