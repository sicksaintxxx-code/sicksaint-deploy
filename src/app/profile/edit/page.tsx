'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Save, User as UserIcon } from 'lucide-react'

export default function EditProfilePage() {
  const router = useRouter()
  const { user, loading, refresh } = useAuth()

  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')
  const [twitter, setTwitter] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?from=/profile/edit')
      return
    }

    if (user) {
      setName(user.name || '')
      fetch('/api/users/profile')
        .then(r => r.json())
        .then(data => {
          if (data.user) {
            const u = data.user
            setName(u.name || '')
            setTitle(u.title || '')
            setBio(u.bio || '')
            setLocation(u.location || '')
            setWebsite(u.website || '')
            setTwitter(u.twitter || '')
            setLinkedin(u.linkedin || '')
            setAvatarUrl(u.avatarUrl || '')
          }
        })
        .catch(() => {})
    }
  }, [user, loading, router])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          title,
          bio,
          location,
          website,
          twitter,
          linkedin,
          avatarUrl,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to update credentials.')
        return
      }

      await refresh()
      setMessage('Profile telemetry synchronized successfully.')
    } catch {
      setError('Connection failure while persisting profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <p className="font-mono text-xs tracking-widest text-brand-muted animate-pulse">SYNCHRONIZING DOSSIER...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="border-b border-brand-border pb-6 mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard"
            className="font-mono text-xs tracking-widest text-brand-muted hover:text-brand-accent flex items-center gap-1.5 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO WORKSPACE</span>
          </Link>
          <h1 className="font-serif text-3xl text-brand-text font-bold">Contributor Profile</h1>
          <p className="font-mono text-xs text-brand-muted mt-1">
            Maintain your public byline identity and journalistic affiliations.
          </p>
        </div>
      </div>

      {message && (
        <div className="mb-6 p-4 border border-brand-accent/40 bg-brand-accent/10 text-brand-accent font-mono text-xs">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 border border-rose-500/40 bg-rose-500/10 text-rose-400 font-mono text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-mono text-xs tracking-widest text-brand-muted uppercase mb-2">
            Display Byline / Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-brand-card border border-brand-border text-brand-text px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        <div>
          <label className="block font-mono text-xs tracking-widest text-brand-muted uppercase mb-2">
            Editorial Title / Beat (e.g. Senior Foreign Correspondent, Speculative Architect)
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Independent Investigative Fellow"
            className="w-full bg-brand-card border border-brand-border text-brand-text px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        <div>
          <label className="block font-mono text-xs tracking-widest text-brand-muted uppercase mb-2">
            Biographical Dossier
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Brief journalistic focus, past publications, institutional background..."
            className="w-full bg-brand-card border border-brand-border text-brand-text p-4 font-mono text-sm focus:outline-none focus:border-brand-accent transition-colors leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs tracking-widest text-brand-muted uppercase mb-2">
              Base Location / Bureau
            </label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Tokyo / Berlin / Geneva"
              className="w-full bg-brand-card border border-brand-border text-brand-text px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>

          <div>
            <label className="block font-mono text-xs tracking-widest text-brand-muted uppercase mb-2">
              Website / Substack
            </label>
            <input
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://..."
              className="w-full bg-brand-card border border-brand-border text-brand-text px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs tracking-widest text-brand-muted uppercase mb-2">
              Twitter / X Handle
            </label>
            <input
              type="text"
              value={twitter}
              onChange={e => setTwitter(e.target.value)}
              placeholder="@handle"
              className="w-full bg-brand-card border border-brand-border text-brand-text px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>

          <div>
            <label className="block font-mono text-xs tracking-widest text-brand-muted uppercase mb-2">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-brand-card border border-brand-border text-brand-text px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-brand-accent text-brand-bg font-mono text-sm font-bold tracking-widest uppercase py-3.5 hover:bg-white transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'SYNCHRONIZING...' : 'PERSIST PROFILE CHANGES'}</span>
        </button>
      </form>
    </div>
  )
}
