'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('')
    try {
      const response = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      const data = await response.json()
      if (!response.ok) setError(data.error || 'Unable to process the request.')
      else setMessage(data.message)
    } catch { setError('Password reset is temporarily unavailable.') } finally { setBusy(false) }
  }
  return <main className="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-16"><section className="w-full max-w-md border border-brand-border bg-brand-surface p-8">
    <Link href="/login" className="font-mono text-xs text-brand-muted hover:text-brand-accent">← BACK TO SIGN IN</Link>
    <h1 className="mt-7 font-serif text-3xl text-brand-text">Reset your password</h1>
    <p className="mt-3 text-sm text-brand-muted">Enter your account email. If it exists, we’ll send a secure reset link.</p>
    <form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-xs font-mono tracking-widest text-brand-muted uppercase">Email
      <input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full bg-brand-bg border border-brand-border text-brand-text px-4 py-3" />
    </label>
      {message && <p role="status" className="text-sm text-emerald-300">{message}</p>}{error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <button disabled={busy} className="w-full bg-brand-accent text-white py-3 font-mono text-sm tracking-widest disabled:opacity-50">{busy ? 'SENDING…' : 'SEND RESET LINK'}</button>
    </form>
  </section></main>
}
