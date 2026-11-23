'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Shield, Check, X, MessageSquare, ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react'

export default function EditorialSubmissionsQueue() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [submissions, setSubmissions] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({})
  const [acting, setActing] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR'))) {
      router.push('/dashboard')
      return
    }

    loadQueue()
  }, [user, loading, router])

  function loadQueue() {
    setFetching(true)
    fetch('/api/submissions')
      .then(r => r.json())
      .then(data => {
        setSubmissions(data.submissions || [])
      })
      .catch(() => {})
      .finally(() => setFetching(false))
  }

  async function handleReview(id: string, action: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES' | 'PUBLISH') {
    setActing(id)
    const feedback = feedbackMap[id] || ''

    try {
      const res = await fetch(`/api/submissions/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, feedback }),
      })

      if (res.ok) {
        loadQueue()
      }
    } catch {
      alert('Review action dispatch failed.')
    } finally {
      setActing(null)
    }
  }

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <p className="font-mono text-xs tracking-widest text-brand-muted animate-pulse">
          LOADING EDITORIAL DISPATCH QUEUE...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="border-b border-brand-border pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="font-mono text-xs tracking-widest text-brand-muted hover:text-brand-accent flex items-center gap-1.5 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO WORKSPACE</span>
          </Link>
          <h1 className="font-serif text-3xl text-brand-text flex items-center gap-3 font-bold">
            <Shield className="w-6 h-6 text-brand-accent" />
            <span>Editorial Desk / Review Queue</span>
          </h1>
          <p className="font-mono text-xs text-brand-muted mt-1">
            Review incoming dossiers, verify factual references, and approve publications.
          </p>
        </div>

        <button
          onClick={loadQueue}
          className="flex items-center gap-2 px-3 py-2 border border-brand-border hover:border-brand-accent font-mono text-xs tracking-widest transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>REFRESH QUEUE</span>
        </button>
      </div>

      {submissions.length === 0 ? (
        <div className="border border-brand-border p-12 text-center bg-brand-card">
          <p className="font-serif text-xl text-brand-text mb-2">Editorial Queue Empty</p>
          <p className="font-mono text-xs text-brand-muted">
            All filed dispatches have been adjudicated.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {submissions.map((sub) => (
            <div key={sub.id} className="border border-brand-border bg-brand-card p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border/60 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`font-mono text-[10px] tracking-widest px-2 py-0.5 border uppercase ${
                      sub.status === 'PUBLISHED' ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' :
                      sub.status === 'APPROVED' ? 'border-brand-accent text-brand-accent bg-brand-accent/10' :
                      sub.status === 'SUBMITTED' ? 'border-amber-500/40 text-amber-400 bg-amber-500/10' :
                      sub.status === 'CHANGES_REQUESTED' ? 'border-rose-500/40 text-rose-400 bg-rose-500/10' :
                      'border-brand-border text-brand-muted'
                    }`}>
                      {sub.status.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-xs text-brand-muted uppercase">Desk: {sub.categorySlug}</span>
                    <span className="font-mono text-xs text-brand-muted">| Format: {sub.format}</span>
                  </div>
                  <h2 className="font-serif text-2xl text-brand-text font-bold">{sub.title}</h2>
                  <p className="font-mono text-xs text-brand-muted mt-1">
                    Filed by <span className="text-brand-text font-semibold">{sub.author?.name}</span> (@{sub.author?.username})
                  </p>
                </div>

                <div className="font-mono text-xs text-brand-muted">
                  {new Date(sub.updatedAt).toLocaleString()}
                </div>
              </div>

              {sub.subtitle && (
                <p className="font-sans text-sm text-brand-text/80 italic mb-4">{sub.subtitle}</p>
              )}

              {sub.excerpt && (
                <div className="bg-brand-secondary/40 border-l-2 border-brand-accent p-3 font-mono text-xs text-brand-text/90 mb-4">
                  {sub.excerpt}
                </div>
              )}

              <div className="bg-brand-bg p-4 border border-brand-border/40 font-mono text-xs text-brand-muted max-h-48 overflow-y-auto mb-6 whitespace-pre-wrap leading-relaxed">
                {sub.content}
              </div>

              {/* Reviewer Action Bar */}
              <div className="space-y-3 pt-2">
                <input
                  type="text"
                  placeholder="Editorial feedback or instructions for author..."
                  value={feedbackMap[sub.id] || ''}
                  onChange={e => setFeedbackMap({ ...feedbackMap, [sub.id]: e.target.value })}
                  className="w-full bg-brand-bg border border-brand-border px-3 py-2 font-mono text-xs text-brand-text focus:outline-none focus:border-brand-accent"
                />

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleReview(sub.id, 'APPROVE')}
                    disabled={acting === sub.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-accent text-brand-bg font-mono text-xs font-bold tracking-widest hover:bg-white transition-colors disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>APPROVE</span>
                  </button>

                  <button
                    onClick={() => handleReview(sub.id, 'PUBLISH')}
                    disabled={acting === sub.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-black font-mono text-xs font-bold tracking-widest hover:bg-emerald-400 transition-colors disabled:opacity-50"
                  >
                    <span>PUBLISH DISPATCH</span>
                  </button>

                  <button
                    onClick={() => handleReview(sub.id, 'REQUEST_CHANGES')}
                    disabled={acting === sub.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 font-mono text-xs tracking-widest transition-colors disabled:opacity-50"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>REQUEST REVISIONS</span>
                  </button>

                  <button
                    onClick={() => handleReview(sub.id, 'REJECT')}
                    disabled={acting === sub.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 font-mono text-xs tracking-widest transition-colors disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>REJECT</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
