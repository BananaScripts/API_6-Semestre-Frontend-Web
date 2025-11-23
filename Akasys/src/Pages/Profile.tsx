import React, { useState } from 'react'

export interface User {
  id: string
  name: string
  email: string
  role?: string
  joinedAt?: string // ISO date string
}

// API Base URL and endpoints from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-6-semestre-backend.onrender.com'
const USUARIO_ENDPOINT = import.meta.env.VITE_USUARIO_ENDPOINT || '/usuario'
const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token'

/**
 * Update profile on the backend via API.
 */
export async function updateProfile(profile: Partial<User>): Promise<User> {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  
  if (!profile.id) {
    throw new Error('User ID is required to update profile')
  }

  const response = await fetch(`${API_BASE_URL}${USUARIO_ENDPOINT}/${profile.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({
      nome: profile.name,
      email: profile.email,
      ...(profile.role && { role: profile.role })
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to update profile: ${response.statusText}`)
  }

  const data = await response.json()
  return {
    id: data.id.toString(),
    name: data.nome,
    email: data.email,
    role: data.role,
    joinedAt: profile.joinedAt
  }
}

/**
 * Logout helper - clears auth token and redirects to login.
 */
export function logout(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  // TODO: Add proper redirect to login page
  // window.location.href = '/login'
  alert('Logged out successfully. Redirecting to login...')
}

export default function Profile(): JSX.Element {
  // TODO: Replace this with injected user from auth/context/store
  const [user, setUser] = useState<User>({
    id: 'user-123',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'Member',
    joinedAt: '2024-01-15T12:00:00.000Z',
  })

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<Partial<User>>({ name: user.name, email: user.email })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setMessage(null)
  }

  async function handleSave() {
    setMessage(null)
    if (!form.name || !form.email) {
      setMessage({ type: 'error', text: 'Name and email are required.' })
      return
    }
    if (!emailRegex.test(form.email)) {
      setMessage({ type: 'error', text: 'Email format is invalid.' })
      return
    }

    setLoading(true)
    try {
      const updated = await updateProfile({ id: user.id, name: form.name, email: form.email })
      setUser(updated)
      setEditing(false)
      setMessage({ type: 'success', text: 'Profile updated.' })
      // TODO: update global auth/user context if used elsewhere
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 16 }}>
      <style>{`
        .card { border:1px solid #e6e6e6; padding:16px; border-radius:8px; background:#fff }
        .row { display:flex; gap:12px; align-items:center }
        .muted { color:#666 }
        .actions { display:flex; gap:8px; margin-top:12px }
      `}</style>

      <h2>Profile</h2>

      <div className="card" role="region" aria-labelledby="profile-heading">
        <h3 id="profile-heading" style={{ marginTop: 0 }}>Account</h3>

        {!editing ? (
          <div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{user.name}</div>
              <div className="muted">{user.email}</div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div className="muted">Role</div>
              <div>{user.role ?? '—'}</div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div className="muted">Joined</div>
              <div>{user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : '—'}</div>
            </div>

            <div className="actions">
              <button onClick={() => { setEditing(true); setForm({ name: user.name, email: user.email }) }}>Edit</button>
              <button onClick={() => { logout(); /* TODO: redirect / show confirmation */ }} aria-label="Logout">Logout</button>
            </div>
          </div>
        ) : (
          <div>
            <label style={{ display: 'block', marginBottom: 8 }}>
              <div style={{ fontSize: 14 }}>Name</div>
              <input name="name" value={form.name ?? ''} onChange={handleChange} style={{ width: '100%', padding: 8, marginTop: 6, borderRadius: 6, border: '1px solid #ddd' }} />
            </label>

            <label style={{ display: 'block', marginBottom: 8 }}>
              <div style={{ fontSize: 14 }}>Email</div>
              <input name="email" value={form.email ?? ''} onChange={handleChange} style={{ width: '100%', padding: 8, marginTop: 6, borderRadius: 6, border: '1px solid #ddd' }} />
            </label>

            <div className="actions">
              <button onClick={handleSave} disabled={loading}>{loading ? 'Saving…' : 'Save'}</button>
              <button onClick={() => { setEditing(false); setMessage(null) }}>Cancel</button>
            </div>
          </div>
        )}

        {message && (
          <div role="status" style={{ marginTop: 12, color: message.type === 'error' ? 'crimson' : 'green' }}>
            {message.text}
          </div>
        )}

        {/*
          Integration notes:
          - Replace local `user` state with data from your auth context or global store.
          - Call `updateProfile` against your API and propagate changes to global state.
          - Consider adding a small confirm modal for destructive actions like account deletion.
        */}
      </div>
    </div>
  )
}
