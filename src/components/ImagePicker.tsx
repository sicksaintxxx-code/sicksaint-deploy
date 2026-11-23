'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, ExternalLink, Image as ImageIcon } from 'lucide-react'

interface UnsplashPhoto {
  id: string
  urls: { small: string; regular: string; full: string }
  alt_description: string | null
  user: { name: string; username: string }
  links: { html: string }
}

interface ImagePickerProps {
  onSelect: (url: string, credit: string) => void
  onClose?: () => void
}

export default function ImagePicker({ onSelect, onClose }: ImagePickerProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UnsplashPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [demo, setDemo] = useState(false)
  const [demoMessage, setDemoMessage] = useState('')
  const [manualUrl, setManualUrl] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchImages = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/images/unsplash?q=${encodeURIComponent(q)}&per_page=12`)
      const data = await res.json()
      if (data.demo) {
        setDemo(true)
        setDemoMessage(data.message || '')
        setResults([])
      } else {
        setDemo(false)
        setResults(data.results || [])
      }
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchImages(query)
    }, 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, fetchImages])

  function handlePhotoSelect(photo: UnsplashPhoto) {
    setSelected(photo.id)
    const credit = `Photo by ${photo.user.name} on Unsplash`
    onSelect(photo.urls.regular, credit)
  }

  function handleManualSubmit() {
    if (!manualUrl.trim()) return
    onSelect(manualUrl.trim(), '')
  }

  return (
    <div className="bg-brand-bg border border-brand-border w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
        <span className="font-mono text-[11px] tracking-widest text-brand-muted uppercase">
          Image Search — Unsplash
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-brand-muted hover:text-brand-text transition-colors"
            aria-label="Close image picker"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search input */}
      <div className="px-4 py-3 border-b border-brand-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for images..."
            className="w-full bg-brand-card border border-brand-border text-brand-text pl-9 pr-4 py-2 font-mono text-xs focus:outline-none focus:border-brand-accent placeholder:text-brand-muted/50"
            autoFocus
          />
        </div>
      </div>

      {/* Results area */}
      <div className="px-4 py-3 min-h-[200px]">
        {demo && (
          <div className="mb-3 p-3 border border-brand-accent/30 bg-brand-accent/5 font-mono text-[11px] text-brand-muted tracking-wide">
            <ImageIcon className="inline w-3 h-3 mr-1.5 text-brand-accent" />
            {demoMessage || 'Add UNSPLASH_ACCESS_KEY to .env.local to enable image search'}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center h-32">
            <span className="font-mono text-xs tracking-widest text-brand-muted animate-pulse">
              SEARCHING...
            </span>
          </div>
        )}

        {!loading && !demo && results.length === 0 && query.trim() && (
          <div className="flex items-center justify-center h-32">
            <span className="font-mono text-xs text-brand-muted">No results found.</span>
          </div>
        )}

        {!loading && !demo && results.length === 0 && !query.trim() && (
          <div className="flex items-center justify-center h-24">
            <span className="font-mono text-xs text-brand-muted tracking-widest">
              TYPE TO SEARCH UNSPLASH
            </span>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {results.map(photo => (
              <button
                key={photo.id}
                onClick={() => handlePhotoSelect(photo)}
                className={`group relative text-left border transition-colors ${
                  selected === photo.id
                    ? 'border-brand-accent'
                    : 'border-brand-border hover:border-brand-accent/60'
                }`}
              >
                {/* Thumbnail */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.urls.small}
                  alt={photo.alt_description || `Photo by ${photo.user.name}`}
                  className="w-full aspect-video object-cover block"
                  loading="lazy"
                />
                {/* Credit overlay */}
                <div className="px-1.5 py-1 bg-brand-bg border-t border-brand-border">
                  <p className="font-mono text-[9px] text-brand-muted truncate">
                    {photo.user.name}
                  </p>
                </div>
                {/* Unsplash link */}
                <a
                  href={photo.links.html + '?utm_source=sicksaint&utm_medium=referral'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-bg/80 p-0.5"
                  aria-label="View on Unsplash"
                >
                  <ExternalLink className="w-3 h-3 text-brand-muted" />
                </a>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Manual URL fallback — always visible */}
      <div className="px-4 py-3 border-t border-brand-border">
        <label className="block font-mono text-[11px] tracking-widest text-brand-muted uppercase mb-1.5">
          Or paste image URL directly
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={e => setManualUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 bg-brand-card border border-brand-border text-brand-text px-3 py-2 font-mono text-xs focus:outline-none focus:border-brand-accent placeholder:text-brand-muted/50"
            onKeyDown={e => e.key === 'Enter' && handleManualSubmit()}
          />
          <button
            onClick={handleManualSubmit}
            className="px-4 py-2 bg-brand-accent text-brand-bg font-mono text-xs font-bold tracking-widest hover:bg-white transition-colors"
          >
            USE
          </button>
        </div>
      </div>
    </div>
  )
}
