'use client'

import { FormEvent, Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function ResetForm() {
  const params = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('')
    try {
      const response = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: params.get('token'), email: params.get('email'), password, password_confirmation: confirmation }) })
      const data = await response.json()
      if (!response.ok) setError(data.error || data.message || 'This reset link is invalid or expired.')
      else setMessage('Password changed. You can now sign in.')
    } catch { setError('Password reset is temporarily unavailable.') } finally { setBusy(false) }
  }
  return <main className="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-16"><section className="w-full max-w-md border border-brand-border bg-brand-surface p-8">
    <h1 className="font-serif text-3xl text-brand-text">Choose a new password</h1>
    <form onSubmit={submit} className="mt-7 space-y-4">
      <label className="block text-xs font-mono tracking-widest text-brand-muted uppercase">New password<input type="password" required minLength={10} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full bg-brand-bg border border-brand-border text-brand-text px-4 py-3" /></label>
      <label className="block text-xs font-mono tracking-widest text-brand-muted uppercase">Confirm password<input type="password" required minLength={10} autoComplete="new-password" value={confirmation} onChange={e => setConfirmation(e.target.value)} className="mt-2 w-full bg-brand-bg border border-brand-border text-brand-text px-4 py-3" /></label>
      <p className="text-xs text-brand-muted">Use at least 10 characters with uppercase, lowercase, and a number.</p>
      {message && <p role="status" className="text-sm text-emerald-300">{message} <Link href="/login" className="underline">Sign in</Link></p>}{error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <button disabled={busy || !params.get('token') || !params.get('email')} className="w-full bg-brand-accent text-white py-3 font-mono text-sm tracking-widest disabled:opacity-50">{busy ? 'SAVING…' : 'CHANGE PASSWORD'}</button>
    </form>
  </section></main>
}

export default function ResetPasswordPage() { return <Suspense fallback={<main className="min-h-screen bg-brand-bg" />}><ResetForm /></Suspense> }
