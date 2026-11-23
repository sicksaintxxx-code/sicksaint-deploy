'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refresh } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const from = searchParams.get('from') || '/dashboard'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Login failed.'); return }
      await refresh()
      window.location.href = from
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="font-mono text-xs tracking-widest text-brand-muted uppercase mb-6 block hover:text-brand-accent transition-colors">← SICKSAINT</Link>
          <h1 className="font-serif text-4xl text-brand-text mb-2">Sign in</h1>
          <p className="text-brand-muted text-sm font-mono">THE WORLD, WITHOUT THE NOISE.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="border border-red-500/40 bg-red-500/10 text-red-400 text-sm font-mono px-4 py-3 rounded-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono tracking-widest text-brand-muted uppercase mb-2">Email or Username</label>
            <input
              type="text" required autoComplete="username"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full bg-brand-card border border-brand-border text-brand-text px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand-accent transition-colors"
              placeholder="you@example.com or your_handle"
            />
          </div>

          <div>
            <label className="block text-xs font-mono tracking-widest text-brand-muted uppercase mb-2">Password</label>
            <input
              type="password" required autoComplete="current-password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full bg-brand-card border border-brand-border text-brand-text px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand-accent transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="-mt-2 text-right">
            <Link href="/forgot-password" className="text-xs font-mono text-brand-muted hover:text-brand-accent">Forgot password?</Link>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-brand-accent text-brand-bg font-mono text-sm font-bold tracking-widest uppercase py-3.5 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'SIGNING IN…' : 'SIGN IN'}
          </button>
        </form>

        <p className="text-center text-brand-muted text-sm font-mono mt-8">
          No account?{' '}
          <Link href="/signup" className="text-brand-accent hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
