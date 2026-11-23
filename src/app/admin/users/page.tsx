'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Users, Shield, Check, AlertCircle, RefreshCw } from 'lucide-react'

interface UserItem {
  id: string
  name: string
  username: string
  email: string
  role: string
  avatarUrl: string | null
  createdAt: string
}

const ROLES = ['READER', 'CONTRIBUTOR', 'EDITOR', 'ADMIN']

export default function AdminUsersPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [users, setUsers] = useState<UserItem[]>([])
  const [fetching, setFetching] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/dashboard')
      return
    }

    if (user?.role === 'ADMIN') {
      loadUsers()
    }
  }, [user, loading, router])

  function loadUsers() {
    setFetching(true)
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.users) {
          setUsers(data.users)
        } else if (data.error) {
          setError(data.error)
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setFetching(false))
  }

  async function handleRoleChange(userId: string, newRole: string) {
    setUpdatingId(userId)
    setMessage(null)
    setError(null)

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage(`Permissions updated for user successfully.`)
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        )
      } else {
        setError(data.error || 'Failed to update user role.')
      }
    } catch {
      setError('Connection failure while updating user role.')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading || (fetching && users.length === 0)) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <p className="font-mono text-xs tracking-widest text-brand-muted animate-pulse">
          AUTHENTICATING ADMINISTRATIVE ACCESS...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-brand-border pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="font-mono text-xs tracking-widest text-brand-muted hover:text-brand-accent flex items-center gap-1.5 mb-2 transition-colors uppercase"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO ADMIN DASHBOARD</span>
          </Link>
          <h1 className="font-serif text-3xl text-brand-text font-bold flex items-center gap-3">
            <Users className="w-6 h-6 text-brand-accent" />
            <span>User Management & Permissions</span>
          </h1>
          <p className="font-mono text-xs text-brand-muted mt-1">
            Manage global access credentials, promote contributors, and assign editorial authority.
          </p>
        </div>

        <button
          onClick={loadUsers}
          className="flex items-center gap-2 px-3 py-2 border border-brand-border hover:border-brand-accent font-mono text-xs tracking-widest transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${fetching ? 'animate-spin text-brand-accent' : ''}`} />
          <span>REFRESH DIRECTORY</span>
        </button>
      </div>

      {message && (
        <div className="mb-6 p-4 border border-brand-accent/40 bg-brand-accent/10 text-brand-accent font-mono text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 border border-rose-500/40 bg-rose-500/10 text-rose-400 font-mono text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="border border-brand-border bg-brand-card overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-brand-secondary/60 border-b border-brand-border text-brand-textMuted uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">User / Byline</th>
              <th className="py-3 px-4">Handle</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Current Role</th>
              <th className="py-3 px-4">Joined Date</th>
              <th className="py-3 px-4 text-right">Modify Permission</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/60">
            {users.map((u) => {
              const roleBadgeColor =
                u.role === 'ADMIN'
                  ? 'border-red-500/40 text-red-400 bg-red-500/10'
                  : u.role === 'EDITOR'
                  ? 'border-brand-accent text-brand-accent bg-brand-accent/10'
                  : u.role === 'CONTRIBUTOR'
                  ? 'border-sky-500/40 text-sky-400 bg-sky-500/10'
                  : 'border-brand-border text-brand-muted bg-brand-bg'

              return (
                <tr key={u.id} className="hover:bg-brand-secondary/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      {u.avatarUrl ? (
                        <img
                          src={u.avatarUrl}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover border border-brand-border"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-brand-secondary border border-brand-border flex items-center justify-center font-bold text-[10px] text-brand-accent">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="font-serif font-bold text-sm text-brand-text">
                        {u.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-brand-muted">@{u.username}</td>
                  <td className="py-3.5 px-4 text-brand-textSubtle">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 border text-[10px] tracking-widest font-bold uppercase ${roleBadgeColor}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-brand-textSubtle">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={u.role}
                      disabled={updatingId === u.id || u.id === user?.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="bg-brand-bg border border-brand-border text-brand-text px-2 py-1 text-xs font-mono focus:outline-none focus:border-brand-accent disabled:opacity-50"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
