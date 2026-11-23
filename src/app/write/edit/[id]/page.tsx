'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Send, Trash2, Clock, CheckCircle, Image as ImageIcon } from 'lucide-react'
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

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [categorySlug, setCategorySlug] = useState('technology')
  const [format, setFormat] = useState('DISPATCH')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [status, setStatus] = useState('DRAFT')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [coverImageCredit, setCoverImageCredit] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/submissions/${resolvedParams.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.submission) {
          const s = data.submission
          setTitle(s.title || '')
          setSubtitle(s.subtitle || '')
          setExcerpt(s.excerpt || '')
          setContent(s.content || '')
          setCategorySlug(s.categorySlug || 'technology')
          setFormat(s.format || 'DISPATCH')
          setCoverImageUrl(s.coverImageUrl || '')
          setCoverImageCredit(s.coverImageCredit || '')
          setStatus(s.status)
          setFeedback(s.feedback || null)
          if (Array.isArray(s.tags)) {
            setTagInput(s.tags.join(', '))
          } else if (s.tags) {
            try {
              const parsed = JSON.parse(s.tags)
              setTagInput(Array.isArray(parsed) ? parsed.join(', ') : '')
            } catch {
              setTagInput('')
            }
          }
        } else {
          setError('Article not found.')
        }
      })
      .catch(() => setError('Failed to retrieve dispatch.'))
      .finally(() => setLoading(false))
  }, [resolvedParams.id])

  async function handleUpdate(action: 'draft' | 'submit') {
    setError('')
    setSaving(true)
    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean)

    try {
      const res = await fetch(`/api/submissions/${resolvedParams.id}`, {
        method: 'PATCH',
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
        setError(data.error || 'Failed to update article.')
        return
      }

      router.push('/dashboard')
    } catch {
      setError('Connection failure while updating article.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to permanently discard this draft?')) return
    setSaving(true)
    try {
      const res = await fetch(`/api/submissions/${resolvedParams.id}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/dashboard')
      } else {
        const d = await res.json()
        setError(d.error || 'Failed to delete.')
      }
    } catch {
      setError('Failed to transmit delete command.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <p className="font-mono text-xs tracking-widest text-brand-muted animate-pulse">RESTORING DISPATCH BUFFER...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-border pb-6 mb-8 gap-4">
        <Link
          href="/dashboard"
          className="font-mono text-xs tracking-widest text-brand-muted hover:text-brand-accent flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO WORKSPACE</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            disabled={saving}
            className="flex items-center gap-2 px-3 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 font-mono text-xs tracking-widest transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>DISCARD</span>
          </button>

          <button
            onClick={() => handleUpdate('draft')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-brand-border hover:border-brand-accent font-mono text-xs tracking-widest transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE DRAFT</span>
          </button>

          <button
            onClick={() => handleUpdate('submit')}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-brand-accent text-brand-bg font-mono text-xs font-bold tracking-widest hover:bg-white transition-colors disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>SUBMIT FOR REVIEW</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="mb-6 p-4 border border-brand-accent/40 bg-brand-accent/5 text-brand-text font-mono text-xs">
          <span className="text-brand-accent font-bold uppercase tracking-wider block mb-1">Editorial Feedback:</span>
          {feedback}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 border border-rose-500/40 bg-rose-500/10 text-rose-400 font-mono text-xs">
          {error}
        </div>
      )}

      {/* Editor Main Canvas */}
      <div className="space-y-6">
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

        <div>
          <input
            type="text"
            placeholder="Article Headline..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-brand-border focus:border-brand-accent font-serif text-3xl sm:text-4xl text-brand-text placeholder:text-brand-muted/40 py-2 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Subtitle / Deck..."
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-brand-border/60 focus:border-brand-accent font-sans text-lg text-brand-text/90 placeholder:text-brand-muted/40 py-2 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block font-mono text-[11px] tracking-widest text-brand-muted uppercase mb-1">
            Lead Excerpt
          </label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            className="w-full bg-brand-card border border-brand-border text-brand-text p-3 font-sans text-sm focus:outline-none focus:border-brand-accent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-mono text-[11px] tracking-widest text-brand-muted uppercase flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Cover Image</span>
              </label>
              <button
                type="button"
                onClick={() => setShowImagePicker(true)}
                className="font-mono text-[11px] tracking-widest text-brand-accent hover:underline flex items-center gap-1"
              >
                <span>CHOOSE PHOTO</span>
              </button>
            </div>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={coverImageUrl}
              onChange={e => setCoverImageUrl(e.target.value)}
              className="w-full bg-brand-card border border-brand-border text-brand-text px-3 py-2 font-mono text-xs focus:outline-none focus:border-brand-accent"
            />
            {coverImageUrl && (
              <div className="mt-2 aspect-[16/9] w-full overflow-hidden border border-brand-border bg-brand-secondary relative">
                <img
                  src={coverImageUrl}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                {coverImageCredit && (
                  <div className="absolute bottom-0 inset-x-0 p-1.5 bg-black/80 font-mono text-[10px] text-brand-muted truncate">
                    {coverImageCredit}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block font-mono text-[11px] tracking-widest text-brand-muted uppercase mb-1">
              Descriptive Tags
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              className="w-full bg-brand-card border border-brand-border text-brand-text px-3 py-2 font-mono text-xs focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[11px] tracking-widest text-brand-muted uppercase mb-1">
            Dispatch Body
          </label>
          <textarea
            rows={18}
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full bg-brand-card border border-brand-border text-brand-text p-4 font-mono text-sm leading-relaxed focus:outline-none focus:border-brand-accent"
          />
        </div>
      </div>

      {showImagePicker && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-border w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <ImagePicker
              onSelect={(url, credit) => {
                setCoverImageUrl(url)
                setCoverImageCredit(credit)
                setShowImagePicker(false)
              }}
              onClose={() => setShowImagePicker(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
