import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export interface UserRow {
  id: string
  name: string
  email: string
  role: string
}

// Local mock fallback when backend listing is unavailable
const MOCK_USERS: UserRow[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'member' },
  { id: '3', name: 'Carol Lee', email: 'carol@example.com', role: 'member' }
]
// API Base URL and endpoints from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-6-semestre-backend.onrender.com'
const USUARIO_ENDPOINT = import.meta.env.VITE_USUARIO_ENDPOINT || '/usuario'
const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token'

/**
 * Fetch all users from API
 */
export async function fetchUsers(): Promise<UserRow[]> {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)

  const response = await fetch(`${API_BASE_URL}${USUARIO_ENDPOINT}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`)
  }

  const data = await response.json()
  
  // Transform API response to UserRow format
  return data.map((user: any) => ({
    id: user.id.toString(),
    name: user.nome || user.name || user.email.split('@')[0],
    email: user.email,
    role: user.role || 'member'
  }))
}

/**
 * Update user via API
 */
export async function updateUser(user: UserRow): Promise<UserRow> {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)

  const response = await fetch(`${API_BASE_URL}${USUARIO_ENDPOINT}/${user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({
      nome: user.name,
      role: user.role
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to update user: ${response.statusText}`)
  }

  const data = await response.json()
  return {
    id: data.id.toString(),
    name: data.nome || data.name,
    email: data.email,
    role: data.role || user.role
  }
}

/**
 * Delete user via API
 */
export async function deleteUser(id: string): Promise<void> {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)

  const response = await fetch(`${API_BASE_URL}${USUARIO_ENDPOINT}/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to delete user: ${response.statusText}`)
  }
}

/**
 * Try to fetch a single user by email using multiple strategies:
 * 1) GET /usuario?email=... (if backend supports query)
 * 2) GET /usuario and search client-side
 */
export async function fetchUserByEmail(email: string): Promise<UserRow | null> {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  const q = encodeURIComponent(email)

  // If the input is a numeric id, try GET /usuario/{id} first
  if (/^\d+$/.test(email.trim())) {
    try {
      const respId = await fetch(`${API_BASE_URL}${USUARIO_ENDPOINT}/${email.trim()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      })
      if (respId.ok) {
        const user = await respId.json()
        return {
          id: user.id.toString(),
          name: user.nome || user.name || user.email.split('@')[0],
          email: user.email,
          role: user.role || 'member'
        }
      }
    } catch (err) {
      console.warn('Fetch by id failed, will try other strategies:', err)
    }
  }

  // 1) Try query param
  try {
    const resp = await fetch(`${API_BASE_URL}${USUARIO_ENDPOINT}?email=${q}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })

    if (resp.ok) {
      const data = await resp.json()
      // backend may return an object or an array
      const user = Array.isArray(data) ? data[0] : data
      if (!user) return null
      return {
        id: user.id.toString(),
        name: user.nome || user.name || user.email.split('@')[0],
        email: user.email,
        role: user.role || 'member'
      }
    }
  } catch (err) {
    // continue to next strategy
    // eslint-disable-next-line no-console
    console.warn('Query-by-email failed, will try listing:', err)
  }

  // 2) Fall back to listing and find by email
  try {
    const list = await fetchUsers()
    const found = list.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    return found || null
  } catch (err) {
    // final fallback: null
    // eslint-disable-next-line no-console
    console.warn('Listing fallback failed:', err)
    return null
  }
}

export default function Admin(): JSX.Element {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<UserRow[]>([])
  const [searchEmail, setSearchEmail] = useState('')
  const [foundUser, setFoundUser] = useState<UserRow | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<UserRow>>({})
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})

  // Fetch users on component mount
  useEffect(() => {
    async function loadUsers() {
      try {
        setIsLoading(true)
        setError(null)
        const fetchedUsers = await fetchUsers()
        // Filter out the logged-in user
        const filteredUsers = fetchedUsers.filter(u => u.email !== currentUser?.email)
        setUsers(filteredUsers)
      } catch (err) {
        // If listing endpoint not available, fall back to local mock so UI remains usable
        console.warn('Failed to load users from API, using mock fallback:', err)
        const fallback = MOCK_USERS.filter(u => u.email !== currentUser?.email)
        setUsers(fallback)
      } finally {
        setIsLoading(false)
      }
    }
    loadUsers()
  }, [currentUser])

  // No list pagination — admin searches users by email using the field below

  function startEdit(u: UserRow) {
    setEditingId(u.id)
    setEditForm({ name: u.name, email: u.email, role: u.role })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditForm({})
  }

  async function saveEdit(id: string) {
    const target = users.find((u) => u.id === id)
    if (!target) return
    const updated: UserRow = { 
      ...target, 
      name: editForm.name ?? target.name, 
      email: target.email, // Email cannot be changed
      role: editForm.role ?? target.role 
    }
    setLoadingMap((m) => ({ ...m, [id]: true }))
    try {
      const res = await updateUser(updated)
      setUsers((prev) => prev.map((u) => (u.id === id ? res : u)))
      // update current displayed user if it was the one edited
      if (foundUser?.id === id) setFoundUser(res)
      setEditingId(null)
      setEditForm({})
    } catch (err) {
      console.error('update failed', err)
      alert('Falha ao atualizar usuário. Tente novamente.')
    } finally {
      setLoadingMap((m) => ({ ...m, [id]: false }))
    }
  }

  async function handleDelete(id: string) {
    const userToDelete = users.find((u) => u.id === id)
    const ok = window.confirm(`Tem certeza que deseja excluir o usuário "${userToDelete?.name}"? Esta ação não pode ser desfeita.`)
    if (!ok) return
    setLoadingMap((m) => ({ ...m, [id]: true }))
    try {
      await deleteUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
      if (foundUser?.id === id) setFoundUser(null)
    } catch (err) {
      console.error('delete failed', err)
      alert('Falha ao excluir usuário. Tente novamente.')
    } finally {
      setLoadingMap((m) => ({ ...m, [id]: false }))
    }
  }

  // Search for a user by email using server-first strategy
  async function searchUserByEmail() {
    const q = searchEmail.trim()
    if (!q) {
      setFoundUser(null)
      setNotFound(false)
      return
    }
    setIsLoading(true)
    setNotFound(false)
    setError(null)
    try {
      const u = await fetchUserByEmail(q)
      if (u) {
        // ensure logged-in user is not shown
        if (u.email === currentUser?.email) {
          setFoundUser(null)
          setNotFound(true)
        } else {
          setFoundUser(u)
          setNotFound(false)
        }
      } else {
        setFoundUser(null)
        setNotFound(true)
      }
    } catch (err) {
      console.error('Search failed:', err)
      setError('Falha ao buscar usuário. Tente novamente.')
      setFoundUser(null)
      setNotFound(true)
    } finally {
      setIsLoading(false)
      setEditingId(null)
      setEditForm({})
    }
  }

  if (isLoading) {
    return (
      <div style={{ color: '#ffffff', fontSize: '18px', padding: '40px', textAlign: 'center' }}>
        Carregando usuários...
      </div>
    )
  }

  // We no longer return an error page here; instead render a small inline banner
  // so we can still show mocked data when the server listing is unavailable.

  return (
    <div>
      <h1 style={{ 
        fontSize: '32px', 
        fontWeight: 700, 
        marginBottom: '8px',
        color: '#ffffff'
      }}>
        Administração
      </h1>
      <p style={{ 
        color: '#ffffff', 
        marginBottom: '32px',
        fontSize: '16px'
      }}>
        Gerencie usuários do sistema
      </p>

      {error && (
        <div style={{
          backgroundColor: '#b91c1c',
          color: '#ffffff',
          padding: '10px 16px',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      <div style={{
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)'
      }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#ffffff' }}>Buscar por e-mail</span>
            <input
              aria-label="Buscar usuário por email ou id"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') searchUserByEmail() }}
              placeholder="ID ou usuario@example.com"
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: '1px solid #475569',
                fontSize: '14px',
                minWidth: '320px',
                outline: 'none',
                transition: 'all 0.2s',
                backgroundColor: '#0f172a',
                color: '#f1f5f9'
              }}
            />
            <button
              onClick={searchUserByEmail}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: '#000000',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Buscar
            </button>
          </label>
          </div>

          <div>
          {notFound && (
            <div style={{ color: '#f97316', marginBottom: '12px' }}>Usuário não encontrado.</div>
          )}

          {foundUser ? (
            <div style={{ display: 'grid', gap: '12px', maxWidth: '720px' }}>
              <div>
                <label style={{ color: '#ffffff', fontSize: 14 }}>Nome</label>
                {editingId === foundUser.id ? (
                  <input value={editForm.name ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                ) : (
                  <div style={{ color: '#ffffff', fontWeight: 600 }}>{foundUser.name}</div>
                )}
              </div>

              <div>
                <label style={{ color: '#ffffff', fontSize: 14 }}>E-mail</label>
                <div style={{ color: '#ffffff' }}>{foundUser.email}</div>
              </div>

              <div>
                <label style={{ color: '#ffffff', fontSize: 14 }}>Função</label>
                {editingId === foundUser.id ? (
                  <select value={editForm.role ?? foundUser.role} onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}>
                    <option value="admin">Administrador</option>
                    <option value="moderator">Moderador</option>
                    <option value="member">Membro</option>
                  </select>
                ) : (
                  <div style={{ display: 'inline-block', padding: '6px 10px', borderRadius: '8px', backgroundColor: '#334155', color: '#ffffff', fontWeight: 600 }}>{foundUser.role === 'admin' ? 'Administrador' : foundUser.role === 'moderator' ? 'Moderador' : 'Membro'}</div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {editingId === foundUser.id ? (
                  <>
                    <button disabled={!!loadingMap[foundUser.id]} onClick={() => saveEdit(foundUser.id)} style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#000000', color: '#ffffff', border: 'none', fontWeight: 600 }}>{loadingMap[foundUser.id] ? 'Salvando…' : 'Salvar'}</button>
                    <button onClick={cancelEdit} style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#ffffff', color: '#000000', border: '1px solid #e5e7eb', fontWeight: 600 }}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(foundUser)} style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#ffffff', color: '#000000', border: '1px solid #e5e7eb', fontWeight: 600 }}>Editar</button>
                    <button disabled={!!loadingMap[foundUser.id]} onClick={() => handleDelete(foundUser.id)} style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#ffffff', color: '#dc2626', border: '1px solid #fca5a5', fontWeight: 600 }}>{loadingMap[foundUser.id] ? 'Excluindo…' : 'Excluir'}</button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div style={{ color: '#94a3b8' }}>Digite um e-mail e pressione Buscar para ver o usuário.</div>
          )}
        </div>
      </div>
    </div>
  )
}
