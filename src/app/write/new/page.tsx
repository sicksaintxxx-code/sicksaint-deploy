'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Save, Send, Image as ImageIcon, X } from 'lucide-react'
import ImagePicker from '@/components/ImagePicker'

const CATEGORIES = [
  { slug: 'world', name: 'World' },
  { slug: 'technology', name: 'Technology' },
  { slug: 'politics', name: 'Politics' },
  { slug: 'business', name: 'Business' },
  { slug: 'ai', name: 'AI & Computation' },
  { slug: 'finance', name: 'Global Finance' },
  { slug: 'entertainment', name: 'Entertainment' },
  { slug: 'fashion', name: 'Fashion & Tailoring' },
  { slug: 'culture', name: 'Culture' },
  { slug: 'gaming', name: 'Gaming' },
  { slug: 'sports', name: 'Sports' },
  { slug: 'science', name: 'Science' },
  { slug: 'automotive', name: 'Automotive' },
  { slug: 'travel', name: 'Travel' },
  { slug: 'photography', name: 'Photography' },
  { slug: 'architecture', name: 'Architecture' },
  { slug: 'health', name: 'Health' },
  { slug: 'film', name: 'Film & Cinema' },
  { slug: 'music', name: 'Music & Sonic' },
  { slug: 'lifestyle', name: 'Tactile Lifestyle' },
]

const AUTOSAVE_KEY = 'sicksaint_new_article_autosave'
const EXCERPT_MAX = 300

export default function NewArticlePage() {
  const router = useRouter()
  const { user } = useAuth()

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [categorySlug, setCategorySlug] = useState('technology')
  const [format, setFormat] = useState('DISPATCH')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [coverImageCredit, setCoverImageCredit] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // ImagePicker modal
  const [showImagePicker, setShowImagePicker] = useState(false)

  // Autosave
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Restore autosave on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.title) setTitle(parsed.title)
        if (parsed.subtitle) setSubtitle(parsed.subtitle)
        if (parsed.excerpt) setExcerpt(parsed.excerpt)
        if (parsed.content) setContent(parsed.content)
        if (parsed.categorySlug) setCategorySlug(parsed.categorySlug)
        if (parsed.format) setFormat(parsed.format)
        if (parsed.coverImageUrl) setCoverImageUrl(parsed.coverImageUrl)
        if (parsed.coverImageCredit) setCoverImageCredit(parsed.coverImageCredit)
        if (parsed.tagInput) setTagInput(parsed.tagInput)
      }
    } catch {
      // ignore
    }
  }, [])

  // Autosave trigger
  const triggerAutosave = useCallback(() => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    setAutosaveStatus('saving')
    autosaveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(
          AUTOSAVE_KEY,
          JSON.stringify({ title, subtitle, excerpt, content, categorySlug, format, coverImageUrl, coverImageCredit, tagInput })
        )
        setAutosaveStatus('saved')
      } catch {
        setAutosaveStatus('idle')
      }
    }, 800)
  }, [title, subtitle, excerpt, content, categorySlug, format, coverImageUrl, coverImageCredit, tagInput])

  useEffect(() => {
    if (title || content || excerpt) {
      triggerAutosave()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, subtitle, excerpt, content, categorySlug, format, coverImageUrl, coverImageCredit, tagInput])

  async function handleSave(action: 'draft' | 'submit') {
    setError('')
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    if (!content.trim()) {
      setError('Article content cannot be empty.')
      return
    }

    setSaving(true)
    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean)

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          excerpt,
          content,
          categorySlug,
          format,
          coverImageUrl,
          coverImageCredit,
          tags,
          action,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save dispatch.')
        return
      }

      // Clear autosave on successful submission
      try { localStorage.removeItem(AUTOSAVE_KEY) } catch { /* ignore */ }

      router.push('/dashboard')
    } catch {
      setError('Transmission error. Check your connection.')
    } finally {
      setSaving(false)
    }
  }

  function handleImagePickerSelect(url: string, credit: string) {
    setCoverImageUrl(url)
    setCoverImageCredit(credit)
    setShowImagePicker(false)
  }

  const excerptOver = excerpt.length > EXCERPT_MAX

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-border pb-6 mb-8 gap-4">
        <Link
          href="/dashboard"
          className="font-mono text-xs tracking-widest text-brand-muted hover:text-brand-accent flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO WORKSPACE</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Autosave indicator */}
          {autosaveStatus !== 'idle' && (
            <span className="font-mono text-[10px] tracking-widest text-brand-muted">
              {autosaveStatus === 'saving' ? 'SAVING...' : 'SAVED'}
            </span>
          )}

          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-brand-border hover:border-brand-accent font-mono text-xs tracking-widest transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE DRAFT</span>
          </button>

          <button
            onClick={() => handleSave('submit')}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-brand-accent text-brand-bg font-mono text-xs font-bold tracking-widest hover:bg-white transition-colors disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>SUBMIT FOR REVIEW</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 border border-rose-500/40 bg-rose-500/10 text-rose-400 font-mono text-xs">
          {error}
        </div>
      )}

      {/* Editor Main Canvas */}
      <div className="space-y-6">
        {/* Meta row: Category & Format */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[11px] tracking-widest text-brand-muted uppercase mb-1">
              Editorial Desk / Category
            </label>
            <select
              value={categorySlug}
              onChange={e => setCategorySlug(e.target.value)}
              className="w-full bg-brand-card border border-brand-border text-brand-text px-3 py-2 font-mono text-xs focus:outline-none focus:border-brand-accent"
            >
              {CATEGORIES.map(c => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-mono text-[11px] tracking-widest text-brand-muted uppercase mb-1">
              Article Format
            </label>
            <select
              value={format}
              onChange={e => setFormat(e.target.value)}
              className="w-full bg-brand-card border border-brand-border text-brand-text px-3 py-2 font-mono text-xs focus:outline-none focus:border-brand-accent"
            >
              <option value="DISPATCH">FIELD DISPATCH (Direct Reporting)</option>
              <option value="DOSSIER">INVESTIGATIVE DOSSIER (Deep Dive)</option>
              <option value="DIALOGUE">DIALOGUE (Interview & Transcript)</option>
              <option value="ESSAY">CRITICAL ESSAY (Analysis & Thesis)</option>
              <option value="VISUAL_STORY">VISUAL ESSAY (Photography First)</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <input
            type="text"
            placeholder="Article Headline..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-brand-border focus:border-brand-accent font-serif text-3xl sm:text-4xl text-brand-text placeholder:text-brand-muted/40 py-2 focus:outline-none transition-colors"
          />
        </div>

        {/* Subtitle */}
        <div>
          <input
            type="text"
            placeholder="Subtitle / Deck (A concise contextual summary)..."
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-brand-border/60 focus:border-brand-accent font-sans text-lg text-brand-text/90 placeholder:text-brand-muted/40 py-2 focus:outline-none transition-colors"
          />
        </div>

        {/* Lead Excerpt with character count */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block font-mono text-[11px] tracking-widest text-brand-muted uppercase">
              Lead Excerpt (1-2 sentences for indices and RSS)
            </label>
            <span className={`font-mono text-[10px] tracking-wide ${excerptOver ? 'text-rose-400' : 'text-brand-muted'}`}>
              {excerpt.length}/{EXCERPT_MAX}
            </span>
          </div>
          <textarea
            rows={2}
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            maxLength={EXCERPT_MAX}
            placeholder="Synthesize the primary finding or narrative arc..."
            className={`w-full bg-brand-card border text-brand-text p-3 font-sans text-sm focus:outline-none focus:border-brand-accent transition-colors ${excerptOver ? 'border-rose-500/60' : 'border-brand-border'}`}
          />
        </div>

        {/* Lead Image & Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[11px] tracking-widest text-brand-muted uppercase mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Cover Image URL (Unsplash or hosted CDN)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={coverImageUrl}
                onChange={e => setCoverImageUrl(e.target.value)}
                className="flex-1 bg-brand-card border border-brand-border text-brand-text px-3 py-2 font-mono text-xs focus:outline-none focus:border-brand-accent"
              />
              <button
                type="button"
                onClick={() => setShowImagePicker(v => !v)}
                className={`px-3 py-2 border font-mono text-xs tracking-widest transition-colors ${showImagePicker ? 'border-brand-accent text-brand-accent' : 'border-brand-border hover:border-brand-accent text-brand-muted hover:text-brand-accent'}`}
                title="Browse Unsplash"
              >
                <ImageIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Cover image credit */}
            {coverImageCredit && (
              <p className="mt-1 font-mono text-[10px] text-brand-muted tracking-wide">{coverImageCredit}</p>
            )}

            {/* Cover image preview */}
            {coverImageUrl && (
              <div className="mt-2 relative aspect-video bg-brand-card border border-brand-border overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImageUrl}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <button
                  type="button"
                  onClick={() => { setCoverImageUrl(''); setCoverImageCredit('') }}
                  className="absolute top-1.5 right-1.5 bg-brand-bg/80 p-1 hover:text-rose-400 text-brand-muted transition-colors"
                  aria-label="Remove cover image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block font-mono text-[11px] tracking-widest text-brand-muted uppercase mb-1">
              Descriptive Tags (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Geopolitics, Subsea Cables, Capital, Defense"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              className="w-full bg-brand-card border border-brand-border text-brand-text px-3 py-2 font-mono text-xs focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        {/* ImagePicker dropdown */}
        {showImagePicker && (
          <div className="border border-brand-border">
            <ImagePicker
              onSelect={handleImagePickerSelect}
              onClose={() => setShowImagePicker(false)}
            />
          </div>
        )}

        {/* Content Body */}
        <div>
          <label className="block font-mono text-[11px] tracking-widest text-brand-muted uppercase mb-1">
            Dispatch Content (Markdown or plain editorial prose)
          </label>
          <textarea
            rows={18}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Begin dispatch here. Use standard markdown headers (#, ##), pull quotes (>), and italic/bold emphasis..."
            className="w-full bg-brand-card border border-brand-border text-brand-text p-4 font-mono text-sm leading-relaxed focus:outline-none focus:border-brand-accent"
          />
        </div>
      </div>
    </div>
  )
}
