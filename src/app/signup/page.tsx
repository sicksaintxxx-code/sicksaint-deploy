'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function SignupPage() {
  const router = useRouter()
  const { refresh } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed.'); return }
      await refresh()
      window.location.href = '/dashboard'
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-10 text-center">
          <Link href="/" className="font-mono text-xs tracking-widest text-brand-muted uppercase mb-6 block hover:text-brand-accent transition-colors">← SICKSAINT</Link>
          <h1 className="font-serif text-4xl text-brand-text mb-2">Create your account</h1>
          <p className="text-brand-muted text-sm font-mono">Join the editorial community.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="border border-red-500/40 bg-red-500/10 text-red-400 text-sm font-mono px-4 py-3 rounded-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono tracking-widest text-brand-muted uppercase mb-2">Full Name</label>
            <input
              type="text" required autoComplete="name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-brand-card border border-brand-border text-brand-text px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand-accent transition-colors"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-xs font-mono tracking-widest text-brand-muted uppercase mb-2">Email</label>
            <input
              type="email" required autoComplete="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full bg-brand-card border border-brand-border text-brand-text px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand-accent transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono tracking-widest text-brand-muted uppercase mb-2">Username</label>
            <input
              type="text" required autoComplete="username"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
              className="w-full bg-brand-card border border-brand-border text-brand-text px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand-accent transition-colors"
              placeholder="your_handle"
            />
            <p className="text-brand-muted text-xs mt-1 font-mono">3–24 characters. Letters, numbers, underscores only.</p>
          </div>

          <div>
            <label className="block text-xs font-mono tracking-widest text-brand-muted uppercase mb-2">Password</label>
            <input
              type="password" required autoComplete="new-password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full bg-brand-card border border-brand-border text-brand-text px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand-accent transition-colors"
              placeholder="10+ chars: upper, lower, number"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-brand-accent text-brand-bg font-mono text-sm font-bold tracking-widest uppercase py-3.5 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'CREATING ACCOUNT…' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p className="text-center text-brand-muted text-sm font-mono mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-accent hover:underline">Sign in</Link>
        </p>

        <p className="text-center text-brand-muted text-xs font-mono mt-6 leading-relaxed">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-brand-text">Terms</Link> and{' '}
          <Link href="/privacy" className="underline hover:text-brand-text">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
