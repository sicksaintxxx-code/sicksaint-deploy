'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  FileStack,
  Newspaper,
  Users,
  Settings,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'

type Stats = {
  totalUsers: number
  totalSubmissions: number
  pendingSubmissions: number
  publishedSubmissions: number
  draftSubmissions: number
  recentSubmissions: Array<{
    id: string
    title: string
    status: string
    format: string
    categorySlug: string | null
    updatedAt: string
    author: { name: string; username: string }
  }>
}

type WpStatus = {
  live: boolean
  url?: string
  endpoint?: string
  status?: string
  message?: string
}

type NavSection = 'overview' | 'queue' | 'articles' | 'users' | 'settings'

const NAV_ITEMS: { id: NavSection; label: string; icon: React.ReactNode; href?: string }[] = [
  { id: 'overview', label: 'OVERVIEW', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'queue', label: 'EDITORIAL QUEUE', icon: <FileStack className="w-4 h-4" />, href: '/admin/submissions' },
  { id: 'articles', label: 'ALL ARTICLES', icon: <Newspaper className="w-4 h-4" /> },
  { id: 'users', label: 'USER MANAGEMENT', icon: <Users className="w-4 h-4" />, href: '/admin/users' },
  { id: 'settings', label: 'SETTINGS', icon: <Settings className="w-4 h-4" /> },
]

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    PUBLISHED: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    APPROVED: 'border-brand-accent text-brand-accent bg-brand-accent/10',
    SUBMITTED: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    UNDER_REVIEW: 'border-sky-500/40 text-sky-400 bg-sky-500/10',
    CHANGES_REQUESTED: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
    REJECTED: 'border-red-500/40 text-red-400 bg-red-500/10',
    DRAFT: 'border-brand-border text-brand-textSubtle bg-brand-card',
  }
  return (
    <span className={`font-mono text-[10px] tracking-widest px-2 py-0.5 border uppercase ${cls[status] ?? cls.DRAFT}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [activeSection, setActiveSection] = useState<NavSection>('overview')
  const [stats, setStats] = useState<Stats | null>(null)
  const [wpStatus, setWpStatus] = useState<WpStatus | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  const fetchDashboardData = useCallback(async () => {
    setStatsLoading(true)
    try {
      const [statsRes, wpRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/wp-status').catch(() => null),
      ])
      if (statsRes.ok) setStats(await statsRes.json())
      if (wpRes && wpRes.ok) setWpStatus(await wpRes.json())
    } catch (err) {
      console.error('Dashboard data error:', err)
    } finally {
      setStatsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR'))) {
      router.push('/dashboard')
      return
    }
    if (!authLoading && user) {
      fetchDashboardData()
    }
  }, [user, authLoading, router, fetchDashboardData])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <p className="font-mono text-xs tracking-widest text-brand-textMuted animate-pulse">
          AUTHENTICATING ACCESS...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-brand-border bg-brand-surface flex flex-col">
        {/* Sidebar header */}
        <div className="border-b border-brand-border px-5 py-5">
          <span className="block text-[10px] font-mono text-brand-textSubtle uppercase tracking-widest mb-1">
            SICKSAINT
          </span>
          <span className="block text-xs font-mono font-black text-brand-accent tracking-wider uppercase">
            ADMIN DESK
          </span>
        </div>

        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id
            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-[11px] font-mono tracking-widest text-brand-textMuted hover:text-brand-text hover:bg-brand-card transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </Link>
              )
            }
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-[11px] font-mono tracking-widest transition-colors text-left ${
                  isActive
                    ? 'bg-brand-accent/10 text-brand-accent border border-brand-accent/30'
                    : 'text-brand-textMuted hover:text-brand-text hover:bg-brand-card border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-brand-border px-5 py-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[10px] font-mono text-brand-textSubtle hover:text-brand-accent transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            FRONT PAGE
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="border-b border-brand-border bg-brand-surface px-8 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-brand-textSubtle uppercase tracking-widest">
              {NAV_ITEMS.find((n) => n.id === activeSection)?.label ?? 'DASHBOARD'}
            </span>
          </div>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-brand-border text-brand-textMuted hover:border-brand-accent hover:text-brand-accent font-mono text-[10px] tracking-widest transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            REFRESH
          </button>
        </div>

        <div className="p-8">
          {/* ═══ OVERVIEW SECTION ═══ */}
          {activeSection === 'overview' && (
            <div className="space-y-8">
              <div className="border-b border-brand-border pb-6">
                <span className="text-[10px] font-mono text-brand-accent uppercase tracking-widest font-bold">
                  [PUBLISHING CONTROL ROOM]
                </span>
                <h1 className="text-4xl font-serif font-black text-brand-text tracking-tight mt-1">
                  EDITORIAL CMS DESK
                </h1>
                <p className="mt-2 text-sm font-serif text-brand-textMuted">
                  Real-time pipeline management, editorial telemetry, and platform control.
                </p>
              </div>

              {/* WordPress Status */}
              <div className="border border-brand-border bg-brand-surface p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-brand-textSubtle uppercase tracking-widest block mb-1">
                    WORDPRESS CMS CONNECTION
                  </span>
                  <span className="text-sm font-mono text-brand-text">
                    {wpStatus?.endpoint || wpStatus?.url || 'cms.sicksaint.club/wp-json/wp/v2'}
                  </span>
                </div>
                {wpStatus === null ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 border border-brand-border font-mono text-[10px] text-brand-textSubtle">
                    <Clock className="w-3.5 h-3.5" />
                    CHECKING...
                  </div>
                ) : wpStatus.live ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 border border-emerald-500/40 bg-emerald-500/10 font-mono text-[10px] text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {wpStatus.status === 'connected_empty' ? 'CONNECTED (0 POSTS)' : 'LIVE'}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 border border-amber-500/40 bg-amber-500/10 font-mono text-[10px] text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {wpStatus.status === 'unreachable'
                      ? 'UNREACHABLE'
                      : wpStatus.status === 'not_configured'
                      ? 'NOT CONFIGURED'
                      : 'OFFLINE / INVALID RESPONSE'}
                  </div>
                )}
              </div>

              {/* Telemetry Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: 'PENDING REVIEW',
                    value: statsLoading ? '—' : stats?.pendingSubmissions ?? 0,
                    accent: true,
                  },
                  {
                    label: 'TOTAL USERS',
                    value: statsLoading ? '—' : stats?.totalUsers ?? 0,
                    accent: false,
                  },
                  {
                    label: 'PUBLISHED',
                    value: statsLoading ? '—' : stats?.publishedSubmissions ?? 0,
                    accent: false,
                  },
                  {
                    label: 'TOTAL SUBMISSIONS',
                    value: statsLoading ? '—' : stats?.totalSubmissions ?? 0,
                    accent: false,
                  },
                ].map((metric) => (
                  <div key={metric.label} className="p-5 bg-brand-surface border border-brand-border">
                    <span className="text-[10px] font-mono text-brand-textSubtle uppercase tracking-wider block">
                      {metric.label}
                    </span>
                    <span
                      className={`text-3xl font-mono font-black mt-2 block ${
                        metric.accent ? 'text-brand-accent' : 'text-brand-text'
                      }`}
                    >
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-4">
                <Link
                  href="/admin/submissions"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-accent text-brand-bg font-mono text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
                >
                  <FileStack className="w-4 h-4" />
                  REVIEW QUEUE
                </Link>
                <Link
                  href="/admin/users"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-brand-border text-brand-text font-mono text-xs font-bold uppercase tracking-widest hover:border-brand-accent hover:text-brand-accent transition-colors"
                >
                  <Users className="w-4 h-4" />
                  MANAGE USERS
                </Link>
              </div>

              {/* Recent Activity */}
              <div>
                <div className="border-b border-brand-border pb-3 mb-4 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-brand-textSubtle uppercase tracking-widest font-bold">
                    RECENT ACTIVITY — LAST 5 SUBMISSIONS
                  </span>
                </div>
                {statsLoading ? (
                  <p className="font-mono text-xs text-brand-textSubtle animate-pulse">LOADING...</p>
                ) : !stats?.recentSubmissions?.length ? (
                  <p className="font-mono text-xs text-brand-textSubtle">No recent submissions.</p>
                ) : (
                  <div className="space-y-2">
                    {stats.recentSubmissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="border border-brand-border bg-brand-surface p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <p className="font-serif text-sm font-bold text-brand-text line-clamp-1">
                            {sub.title}
                          </p>
                          <p className="font-mono text-[10px] text-brand-textSubtle mt-0.5">
                            {sub.author.name} (@{sub.author.username}) · {sub.format}
                            {sub.categorySlug ? ` · ${sub.categorySlug.toUpperCase()}` : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={sub.status} />
                          <span className="font-mono text-[10px] text-brand-textSubtle whitespace-nowrap">
                            {new Date(sub.updatedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ ARTICLES SECTION ═══ */}
          {activeSection === 'articles' && (
            <div className="space-y-6">
              <div className="border-b border-brand-border pb-4">
                <span className="text-[10px] font-mono text-brand-accent uppercase tracking-widest font-bold">
                  [ALL ARTICLES]
                </span>
                <h2 className="text-3xl font-serif font-black text-brand-text mt-1">
                  SUBMISSION ARCHIVE
                </h2>
              </div>

              {/* WP connection status inline */}
              <div className="border border-brand-border bg-brand-surface p-4 flex items-center gap-3 font-mono text-xs">
                <span className="text-brand-textSubtle">WORDPRESS CMS:</span>
                {wpStatus?.live ? (
                  <div className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {wpStatus?.status === 'connected_empty' ? 'CONNECTED (0 POSTS)' : 'CONNECTED'}
                  </div>
                ) : (
                  <div className="text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {wpStatus?.status === 'unreachable'
                      ? 'UNREACHABLE — serving local DB only'
                      : wpStatus?.status === 'not_configured'
                      ? 'NOT CONFIGURED — serving local DB only'
                      : 'OFFLINE — serving local DB only'}
                  </div>
                )}
              </div>

              {statsLoading ? (
                <p className="font-mono text-xs text-brand-textSubtle animate-pulse">LOADING SUBMISSIONS...</p>
              ) : (
                <div className="border border-brand-border bg-brand-surface overflow-x-auto">
                  <div className="p-4 border-b border-brand-border flex items-center justify-between">
                    <span className="font-mono text-[10px] text-brand-textSubtle uppercase tracking-widest">
                      {stats?.totalSubmissions ?? 0} TOTAL · {stats?.pendingSubmissions ?? 0} PENDING
                    </span>
                    <Link
                      href="/admin/submissions"
                      className="font-mono text-[10px] text-brand-accent hover:underline flex items-center gap-1"
                    >
                      OPEN EDITORIAL QUEUE <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="p-6 text-center">
                    <p className="font-serif text-brand-textMuted text-sm">
                      Full article management is in the{' '}
                      <Link href="/admin/submissions" className="text-brand-accent hover:underline">
                        Editorial Queue
                      </Link>
                      .
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-4 max-w-sm mx-auto text-xs font-mono">
                      <div className="border border-brand-border p-3">
                        <div className="text-2xl font-black text-emerald-400">{stats?.publishedSubmissions ?? 0}</div>
                        <div className="text-brand-textSubtle mt-1">PUBLISHED</div>
                      </div>
                      <div className="border border-brand-border p-3">
                        <div className="text-2xl font-black text-amber-400">{stats?.pendingSubmissions ?? 0}</div>
                        <div className="text-brand-textSubtle mt-1">PENDING</div>
                      </div>
                      <div className="border border-brand-border p-3">
                        <div className="text-2xl font-black text-brand-textMuted">{stats?.draftSubmissions ?? 0}</div>
                        <div className="text-brand-textSubtle mt-1">DRAFT</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ SETTINGS SECTION ═══ */}
          {activeSection === 'settings' && (
            <div className="space-y-6">
              <div className="border-b border-brand-border pb-4">
                <span className="text-[10px] font-mono text-brand-accent uppercase tracking-widest font-bold">
                  [PLATFORM SETTINGS]
                </span>
                <h2 className="text-3xl font-serif font-black text-brand-text mt-1">SETTINGS</h2>
              </div>
              <div className="border border-brand-border bg-brand-surface p-8 text-center">
                <Settings className="w-8 h-8 text-brand-textSubtle mx-auto mb-3" />
                <p className="font-serif text-brand-textMuted">
                  Platform settings panel — coming soon.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
