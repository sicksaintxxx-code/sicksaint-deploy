'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, X, Menu, ChevronDown, Sparkles, BookOpen, Layers, Newspaper, Compass, PenLine, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DEPARTMENT_GROUPS = [
  {
    group: 'WORLD & POWER',
    items: [
      { name: 'World', href: '/category/world', desc: 'Geopolitics & subsea cabals' },
      { name: 'Politics', href: '/category/politics', desc: 'Sovereignty & charters' },
      { name: 'Business', href: '/category/business', desc: 'Sovereign wealth & commodities' },
      { name: 'Finance', href: '/category/finance', desc: 'Dark pools & bond dynamics' },
    ],
  },
  {
    group: 'SCIENCE & COMPUTE',
    items: [
      { name: 'Technology', href: '/category/technology', desc: 'Hardware & lithography' },
      { name: 'Artificial Intelligence', href: '/category/ai', desc: 'Autonomous agent swarms' },
      { name: 'Science', href: '/category/science', desc: 'Fusion & deep telemetry' },
      { name: 'Health', href: '/category/health', desc: 'Epigenetics & longevity' },
    ],
  },
  {
    group: 'CULTURE & FORM',
    items: [
      { name: 'Culture', href: '/category/culture', desc: 'Aesthetic philosophy' },
      { name: 'Architecture', href: '/category/architecture', desc: 'Brutalist concrete monoliths' },
      { name: 'Film & Television', href: '/category/film', desc: '70mm analog celluloid' },
      { name: 'Music', href: '/category/music', desc: 'Psychoacoustics & modular tape' },
    ],
  },
  {
    group: 'LIVING & MOTION',
    items: [
      { name: 'Fashion', href: '/category/fashion', desc: 'Neo-brutalist tailoring' },
      { name: 'Lifestyle', href: '/category/lifestyle', desc: 'Off-grid acoustic silence' },
      { name: 'Gaming', href: '/category/gaming', desc: 'Spatial simulations' },
      { name: 'Sports', href: '/category/sports', desc: 'Hydrofoil telemetry' },
      { name: 'Automotive', href: '/category/automotive', desc: 'Coachbuilt aluminum' },
      { name: 'Travel', href: '/category/travel', desc: 'High-plateau expeditions' },
      { name: 'Photography', href: '/category/photography', desc: 'Silver halide darkrooms' },
    ],
  },
];

const PRIMARY_NAV = [
  { name: 'HOME', href: '/' },
  { name: 'CULTURE', href: '/category/culture' },
  { name: 'FASHION', href: '/category/fashion' },
  { name: 'MUSIC', href: '/category/music' },
  { name: 'ART', href: '/category/art' },
  { name: 'JOURNAL', href: '/blog' },
  { name: 'ABOUT', href: '/about' },
];

const SUGGESTED_QUERIES = [
  'Subsea Cables',
  'Autonomous AI',
  'Sovereign Wealth',
  'Neo-Brutalist',
  'Cryogenic Fusion',
  '70mm Cinema',
  'Epigenetics',
  'Dark Pools',
];

export default function Navigation() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [departmentsOpen, setDepartmentsOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menus on path change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDepartmentsOpen(false);
    setSearchOverlayOpen(false);
  }, [pathname]);

  // Handle outside click for departments dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDepartmentsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when search or mobile drawer is open & handle keyboard '/' shortcut
  useEffect(() => {
    if (searchOverlayOpen || mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !searchOverlayOpen) {
        const target = e.target as HTMLElement;
        if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;
        e.preventDefault();
        setSearchOverlayOpen(true);
      } else if (e.key === 'Escape') {
        setSearchOverlayOpen(false);
        setDepartmentsOpen(false);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchOverlayOpen, mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOverlayOpen(false);
    }
  };

  const handleQuickTagClick = (tag: string) => {
    setSearchQuery(tag);
    router.push(`/search?q=${encodeURIComponent(tag)}`);
    setSearchOverlayOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-brand-bg/95 backdrop-blur-md border-b border-brand-border transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 py-2">
            {/* Mobile Hamburger & Logo */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation drawer"
                className="p-2 text-brand-textMuted hover:text-brand-text focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-brand-accent" /> : <Menu className="w-5 h-5" />}
              </button>
              <Link href="/" className="ml-2 font-serif font-black text-xl tracking-tight text-brand-text">
                SICKSAINT
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 py-1">
              {/* Departments Mega Menu Button */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDepartmentsOpen(!departmentsOpen)}
                  className={`flex items-center gap-1 text-[11px] xl:text-xs font-mono tracking-widest px-3 py-1.5 transition-all duration-150 border ${
                    departmentsOpen
                      ? 'bg-brand-surface border-brand-accent text-brand-accent'
                      : 'border-transparent text-brand-text hover:text-brand-accent hover:bg-brand-surface/80'
                  }`}
                  aria-expanded={departmentsOpen}
                >
                  <Layers className="w-3.5 h-3.5 text-brand-accent" />
                  <span className="font-bold">DEPARTMENTS</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${departmentsOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Departments Mega Dropdown */}
                {departmentsOpen && (
                  <div className="absolute left-0 top-full mt-2 w-[780px] bg-brand-bg border border-brand-border shadow-2xl p-6 z-50 grid grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-2 duration-150">
                    {DEPARTMENT_GROUPS.map((group) => (
                      <div key={group.group} className="space-y-3">
                        <h4 className="text-[10px] font-mono tracking-widest text-brand-accent uppercase font-bold border-b border-brand-border/60 pb-1.5">
                          {group.group}
                        </h4>
                        <ul className="space-y-2">
                          {group.items.map((cat) => (
                            <li key={cat.name}>
                              <Link
                                href={cat.href}
                                className="group/item block"
                                onClick={() => setDepartmentsOpen(false)}
                              >
                                <span className="text-xs font-serif font-semibold text-brand-text group-hover/item:text-brand-accent transition-colors">
                                  {cat.name}
                                </span>
                                <span className="block text-[9px] font-mono text-brand-textSubtle leading-tight group-hover/item:text-brand-textMuted">
                                  {cat.desc}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="col-span-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-[10px] font-mono text-brand-textMuted">
                      <span>20 SPECIALIZED EDITORIAL DEPARTMENTS</span>
                      <Link
                        href="/manifesto"
                        className="text-brand-accent hover:underline flex items-center gap-1 font-semibold"
                        onClick={() => setDepartmentsOpen(false)}
                      >
                        READ EDITORIAL CHARTER →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Primary Format Links */}
              {PRIMARY_NAV.map((sec) => {
                const active = pathname === sec.href;
                return (
                  <Link
                    key={sec.name}
                    href={sec.href}
                    className={`text-xs font-condensed tracking-[0.2em] uppercase whitespace-nowrap px-3 py-1.5 transition-all duration-150 relative ${
                      active
                        ? 'text-brand-text font-bold'
                        : 'text-brand-textMuted hover:text-brand-text'
                    }`}
                  >
                    <span>{sec.name}</span>
                    {active && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-brand-burgundy"></span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Quick Actions: Search & Newsletter */}
            <div className="flex items-center space-x-3 sm:space-x-4 shrink-0 pl-2">
              <button
                onClick={() => setSearchOverlayOpen(true)}
                aria-label="Open search dialog"
                className="p-1.5 sm:px-3 sm:py-1.5 flex items-center gap-2 text-xs font-condensed tracking-wider text-brand-textMuted hover:text-brand-text border border-transparent hover:border-brand-border bg-transparent hover:bg-brand-surface transition-all duration-150"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-semibold">SEARCH</span>
                <kbd className="hidden md:inline text-[9px] px-1.5 py-0.5 bg-brand-card border border-brand-border text-brand-textSubtle font-mono">
                  /
                </kbd>
              </button>

              <Link
                href="/newsletter"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-brand-surface border border-brand-border text-brand-text hover:border-brand-burgundy hover:text-brand-text transition-all duration-150 text-xs font-condensed tracking-wider"
              >
                <span>DISPATCHES</span>
              </Link>

              {/* Contributor Writer Portal Link */}
              <Link
                href="/write/new"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-burgundy text-brand-text hover:bg-brand-burgundy/80 border border-brand-burgundy transition-all duration-150 text-xs font-condensed font-bold tracking-widest"
              >
                <PenLine className="w-3.5 h-3.5" />
                <span>WRITE</span>
              </Link>

              {/* User Account / Auth Entry */}
              {mounted && user ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-brand-border hover:border-brand-burgundy text-brand-text transition-colors text-xs font-condensed tracking-wider"
                >
                  <UserIcon className="w-3.5 h-3.5 text-brand-burgundy" />
                  <span className="hidden md:inline">@{user.username}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1 px-3 py-1.5 border border-brand-border hover:border-brand-text text-brand-text transition-colors text-xs font-condensed tracking-wider"
                >
                  <span>SIGN IN</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Full-Screen Search Modal Overlay */}
      {searchOverlayOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-start pt-16 sm:pt-24 px-4 sm:px-6">
          <div className="w-full max-w-3xl">
            {/* Header / Close */}
            <div className="flex items-center justify-between pb-6 border-b border-brand-border">
              <div className="text-[11px] font-mono tracking-widest text-brand-accent uppercase font-bold flex items-center gap-2">
                <Search className="w-3.5 h-3.5" />
                SICKSAINT ARCHIVAL SEARCH
              </div>
              <button
                onClick={() => setSearchOverlayOpen(false)}
                className="p-2 text-brand-textMuted hover:text-brand-text focus:outline-none flex items-center gap-1 text-xs font-mono"
              >
                <span>ESC</span>
                <X className="w-4 h-4 text-brand-accent" />
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSearchSubmit} className="mt-8 relative">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dispatches, investigations, dossier keywords..."
                className="w-full bg-brand-surface border border-brand-border px-6 py-4 text-lg sm:text-xl font-serif text-brand-text placeholder-brand-textSubtle focus:outline-none focus:border-brand-accent transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-brand-burgundy text-brand-text font-condensed text-xs font-bold tracking-widest hover:bg-brand-burgundy/80 transition-colors"
              >
                QUERY
              </button>
            </form>

            {/* Suggested Searches */}
            <div className="mt-8">
              <p className="text-[10px] font-mono tracking-widest text-brand-textMuted uppercase mb-3 font-semibold">
                CURATED INQUIRY VECTORS
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUERIES.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleQuickTagClick(tag)}
                    className="text-xs font-mono px-3 py-1.5 bg-brand-card border border-brand-border text-brand-textMuted hover:text-brand-accent hover:border-brand-accent transition-all duration-150"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-14 z-40 bg-brand-bg border-t border-brand-border overflow-y-auto lg:hidden p-6 pb-24">
          {/* Mobile User / Contributor Action Bar */}
          <div className="mb-6 pb-4 border-b border-brand-border flex items-center justify-between gap-3">
            <Link
              href="/write/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-brand-accent text-brand-bg font-mono text-xs font-bold tracking-widest uppercase hover:bg-white transition-colors"
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>WRITE ARTICLE</span>
            </Link>

            {mounted && user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-brand-accent/50 text-brand-accent font-mono text-xs font-semibold tracking-wider hover:bg-brand-accent/10 transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>@{user.username}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-brand-border text-brand-text font-mono text-xs tracking-wider hover:border-brand-accent hover:text-brand-accent transition-colors"
              >
                <span>SIGN IN</span>
              </Link>
            )}
          </div>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="mb-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search SICKSAINT..."
              className="w-full bg-brand-surface border border-brand-border px-4 py-3 text-sm font-serif text-brand-text placeholder-brand-textSubtle focus:outline-none focus:border-brand-accent"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-accent text-xs font-mono font-bold"
            >
              FIND
            </button>
          </form>

          {/* Primary Formats */}
          <div className="mb-8">
            <h4 className="text-[10px] font-mono tracking-widest text-brand-accent uppercase font-bold mb-3 pb-1 border-b border-brand-border">
              EDITORIAL FORMATS
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {PRIMARY_NAV.map((sec) => (
                <Link
                  key={sec.name}
                  href={sec.href}
                  className="text-xs font-mono py-2 text-brand-text hover:text-brand-accent"
                >
                  {sec.name}
                </Link>
              ))}
            </div>
          </div>

          {/* 20 Departments Grouped */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-mono tracking-widest text-brand-accent uppercase font-bold pb-1 border-b border-brand-border">
              20 EDITORIAL DEPARTMENTS
            </h4>
            {DEPARTMENT_GROUPS.map((group) => (
              <div key={group.group} className="space-y-2">
                <h5 className="text-[9px] font-mono text-brand-textSubtle tracking-wider uppercase font-bold">
                  {group.group}
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {group.items.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="text-xs font-serif text-brand-textMuted hover:text-brand-accent transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Institutional Links */}
          <div className="mt-8 pt-6 border-t border-brand-border space-y-2 text-xs font-mono text-brand-textMuted">
            <Link href="/about" className="block hover:text-brand-text">ABOUT SICKSAINT</Link>
            <Link href="/editorial-standards" className="block hover:text-brand-text">EDITORIAL STANDARDS</Link>
            <Link href="/manifesto" className="block text-brand-accent font-bold">THE MANIFESTO</Link>
            <Link href="/newsletter" className="block hover:text-brand-text">WEEKLY DISPATCHES</Link>
          </div>
        </div>
      )}
    </>
  );
}
