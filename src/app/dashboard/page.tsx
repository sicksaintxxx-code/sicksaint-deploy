'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { PenLine, FileText, Bell, User, Shield, LogOut, ArrowRight, Clock } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  const [submissions, setSubmissions] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?from=/dashboard')
      return
    }

    if (user) {
      Promise.all([
        fetch('/api/submissions').then(r => r.json()).catch(() => ({ submissions: [] })),
        fetch('/api/notifications').then(r => r.json()).catch(() => ({ notifications: [] })),
      ]).then(([subData, notifData]) => {
        setSubmissions(subData.submissions || [])
        setNotifications(notifData.notifications || [])
        setFetching(false)
      })
    }
  }, [user, loading, router])

  if (loading || (!user && fetching)) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <p className="font-mono text-xs tracking-widest text-brand-muted animate-pulse">AUTHENTICATING TELEMETRY...</p>
      </div>
    )
  }

  const isEditor = user?.role === 'ADMIN' || user?.role === 'EDITOR'

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Profile / Action Bar */}
      <div className="border-b border-brand-border pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs text-brand-accent tracking-widest px-2 py-0.5 border border-brand-accent/40 bg-brand-accent/10">
              ROLE: {user?.role}
            </span>
            <span className="font-mono text-xs text-brand-muted">@{user?.username}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-brand-text font-bold">
            Editorial Workspace
          </h1>
          <p className="font-mono text-xs text-brand-muted mt-1">
            Logged in as <span className="text-brand-text font-semibold">{user?.name}</span> ({user?.email})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/write/new"
            className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-brand-bg font-mono text-xs font-bold tracking-widest hover:bg-white transition-colors"
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>CREATE ARTICLE</span>
          </Link>

          <Link
            href="/profile/edit"
            className="flex items-center gap-2 px-4 py-2 border border-brand-border bg-brand-card hover:border-brand-accent font-mono text-xs tracking-widest transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            <span>EDIT PROFILE</span>
          </Link>

          {isEditor && (
            <Link
              href="/admin/submissions"
              className="flex items-center gap-2 px-4 py-2 border border-brand-accent/40 bg-brand-accent/5 text-brand-accent hover:bg-brand-accent hover:text-brand-bg font-mono text-xs tracking-widest transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>EDITORIAL QUEUE</span>
            </Link>
          )}

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 font-mono text-xs tracking-widest transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>SIGN OUT</span>
          </button>
        </div>
      </div>

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submissions Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h2 className="font-mono text-sm tracking-widest uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-accent" />
              <span>Your Dispatches & Drafts ({submissions.length})</span>
            </h2>
            <Link
              href="/dashboard/articles"
              className="font-mono text-xs text-brand-muted hover:text-brand-accent flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {submissions.length === 0 ? (
            <div className="border border-dashed border-brand-border p-8 text-center bg-brand-card/50">
              <p className="font-serif text-lg text-brand-text mb-2">No drafts or dispatches filed yet.</p>
              <p className="font-mono text-xs text-brand-muted mb-6">
                Contribute original investigative dossiers, essays, or field dispatches to SICKSAINT.
              </p>
              <Link
                href="/write/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-accent text-brand-bg font-mono text-xs font-bold tracking-widest hover:bg-white transition-colors"
              >
                <PenLine className="w-3.5 h-3.5" />
                <span>DRAFT FIRST STORY</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-brand-border/60 border border-brand-border bg-brand-card">
              {submissions.slice(0, 5).map((sub) => (
                <div key={sub.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-brand-secondary/40 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-[10px] tracking-widest px-1.5 py-0.5 border uppercase ${
                        sub.status === 'PUBLISHED' ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' :
                        sub.status === 'APPROVED' ? 'border-brand-accent text-brand-accent bg-brand-accent/10' :
                        sub.status === 'SUBMITTED' || sub.status === 'UNDER_REVIEW' ? 'border-amber-500/40 text-amber-400 bg-amber-500/10' :
                        sub.status === 'CHANGES_REQUESTED' ? 'border-rose-500/40 text-rose-400 bg-rose-500/10' :
                        'border-brand-border text-brand-muted bg-brand-bg'
                      }`}>
                        {sub.status.replace('_', ' ')}
                      </span>
                      <span className="font-mono text-xs text-brand-muted">{sub.format}</span>
                    </div>
                    <h3 className="font-serif text-lg text-brand-text font-medium">{sub.title}</h3>
                    {sub.excerpt && <p className="text-xs text-brand-muted line-clamp-1">{sub.excerpt}</p>}
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="font-mono text-[10px] text-brand-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(sub.updatedAt).toLocaleDateString()}
                    </div>
                    <Link
                      href={`/write/edit/${sub.id}`}
                      className="px-3 py-1.5 border border-brand-border hover:border-brand-accent text-xs font-mono tracking-widest hover:text-brand-accent transition-colors"
                    >
                      EDIT
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications & System Feed */}
        <div className="space-y-6">
          <div className="border-b border-brand-border pb-3 flex items-center justify-between">
            <h2 className="font-mono text-sm tracking-widest uppercase flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-accent" />
              <span>Transmissions ({notifications.length})</span>
            </h2>
          </div>

          <div className="border border-brand-border bg-brand-card p-4 space-y-4">
            {notifications.length === 0 ? (
              <p className="font-mono text-xs text-brand-muted py-4 text-center">
                All editorial telemetry normal. No pending dispatches.
              </p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="border-b border-brand-border/40 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-brand-accent tracking-widest uppercase">{n.title}</span>
                    <span className="font-mono text-[10px] text-brand-muted">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-brand-text/90 font-mono leading-relaxed">{n.message}</p>
                </div>
              ))
            )}
          </div>

          {/* Quick Publishing Policy Checklist */}
          <div className="border border-brand-border bg-brand-secondary/40 p-5 space-y-3">
            <h3 className="font-mono text-xs font-bold tracking-widest text-brand-accent uppercase">
              Editorial Standards
            </h3>
            <ul className="space-y-2 text-xs font-mono text-brand-muted">
              <li className="flex items-start gap-2">
                <span className="text-brand-accent">01.</span>
                <span>Original research or rigorous high-signal analytical perspectives only.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-accent">02.</span>
                <span>All photography must include verifiable attribution and descriptive captions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-accent">03.</span>
                <span>Submissions undergo manual peer review before global dissemination.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
