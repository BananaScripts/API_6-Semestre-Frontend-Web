import React, { useMemo, useState } from 'react'

export interface UserRow {
  id: string
  name: string
  email: string
  role: string
}

// Mock dataset — replace with API fetch in production
const MOCK_USERS: UserRow[] = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
  { id: 'u2', name: 'Bob Smith', email: 'bob@example.com', role: 'member' },
  { id: 'u3', name: 'Carol Lee', email: 'carol@example.com', role: 'member' },
  { id: 'u4', name: 'Dan Brown', email: 'dan@example.com', role: 'moderator' },
  { id: 'u5', name: 'Eve Davis', email: 'eve@example.com', role: 'member' },
  { id: 'u6', name: 'Frank Green', email: 'frank@example.com', role: 'member' },
  { id: 'u7', name: 'Grace Hall', email: 'grace@example.com', role: 'member' },
  { id: 'u8', name: 'Hank Ives', email: 'hank@example.com', role: 'member' },
  { id: 'u9', name: 'Ivy Jones', email: 'ivy@example.com', role: 'member' },
  { id: 'u10', name: 'Jack King', email: 'jack@example.com', role: 'member' },
  { id: 'u11', name: 'Lara Moon', email: 'lara@example.com', role: 'member' },
]

/**
 * TODO: Replace updateUser/deleteUser with real API calls and secure actions.
 */
export async function updateUser(user: UserRow): Promise<UserRow> {
  // TODO: implement API call to update user
  return new Promise((resolve) => setTimeout(() => resolve(user), 600))
}

export async function deleteUser(id: string): Promise<void> {
  // TODO: implement API call to delete user
  return new Promise((resolve) => setTimeout(() => resolve(), 500))
}

export default function Admin(): JSX.Element {
  const [users, setUsers] = useState<UserRow[]>(MOCK_USERS)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<UserRow>>({})
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }, [users, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

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
    const updated: UserRow = { ...target, name: editForm.name ?? target.name, email: editForm.email ?? target.email, role: editForm.role ?? target.role }
    setLoadingMap((m) => ({ ...m, [id]: true }))
    try {
      const res = await updateUser(updated) // TODO: implement API
      setUsers((prev) => prev.map((u) => (u.id === id ? res : u)))
      setEditingId(null)
    } catch (err) {
      // TODO: show error notification
      // eslint-disable-next-line no-console
      console.error('update failed', err)
    } finally {
      setLoadingMap((m) => ({ ...m, [id]: false }))
    }
  }

  async function handleDelete(id: string) {
    // Simple confirm — replace with accessible modal if preferred
    const ok = window.confirm('Delete this user? This action cannot be undone.')
    if (!ok) return
    setLoadingMap((m) => ({ ...m, [id]: true }))
    try {
      await deleteUser(id) // TODO: implement API
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      // TODO: show error
      // eslint-disable-next-line no-console
      console.error('delete failed', err)
    } finally {
      setLoadingMap((m) => ({ ...m, [id]: false }))
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <style>{`
        .table { width:100%; border-collapse: collapse }
        .table th, .table td { text-align:left; padding:8px; border-bottom:1px solid #eee }
        .actions { display:flex; gap:8px }
        .muted { color:#666 }
      `}</style>

      <h2>Admin — Users</h2>

      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <label>
            <span className="muted">Search</span>
            <input aria-label="Search users" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} style={{ marginLeft: 8, padding: 6 }} />
          </label>
        </div>
        <div className="muted">Showing {filtered.length} users</div>
      </div>

      <table className="table" role="table" aria-label="Users table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paged.map((u) => (
            <tr key={u.id}>
              <td>
                {editingId === u.id ? (
                  <input value={editForm.name ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} />
                ) : (
                  u.name
                )}
              </td>
              <td>
                {editingId === u.id ? (
                  <input value={editForm.email ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} />
                ) : (
                  u.email
                )}
              </td>
              <td>
                {editingId === u.id ? (
                  <select value={editForm.role ?? u.role} onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}>
                    <option value="admin">admin</option>
                    <option value="moderator">moderator</option>
                    <option value="member">member</option>
                  </select>
                ) : (
                  u.role
                )}
              </td>
              <td>
                <div className="actions">
                  {editingId === u.id ? (
                    <>
                      <button disabled={!!loadingMap[u.id]} onClick={() => saveEdit(u.id)}>
                        {loadingMap[u.id] ? 'Saving…' : 'Save'}
                      </button>
                      <button onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(u)}>Edit</button>
                      <button disabled={!!loadingMap[u.id]} onClick={() => handleDelete(u.id)} aria-label={`Delete ${u.name}`}>
                        {loadingMap[u.id] ? 'Deleting…' : 'Delete'}
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="muted">Page {page} of {totalPages}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</button>
        </div>
      </div>

      {/* TODO: Replace mock data with server-side API calls and secure endpoints. Add authorization checks so only admins can perform updates/deletes. Consider moving table to a separate component and adding a proper confirm modal for deletes. */}
    </div>
  )
}
