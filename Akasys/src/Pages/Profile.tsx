import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

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

export default function Profile(): JSX.Element {
  const { user: authUser, logout: authLogout } = useAuth()
  const navigate = useNavigate()

  const [user] = useState<User>({
    id: authUser?.id || 'unknown',
    name: authUser?.name || 'User',
    email: authUser?.email || '',
    role: authUser?.role || 'Member',
    joinedAt: new Date().toISOString(),
  })

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<Partial<User>>({ name: user.name, email: user.email })
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
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
      await updateProfile({ id: user.id, name: form.name, email: form.email })
      setEditing(false)
      setMessage({ type: 'success', text: 'Profile updated.' })
      // Atualizar dados no localStorage
      const storedUser = localStorage.getItem('user_data')
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        userData.name = form.name
        userData.email = form.email
        localStorage.setItem('user_data', JSON.stringify(userData))
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' })
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    if (window.confirm('Tem certeza que deseja sair?')) {
      authLogout()
      navigate('/login', { replace: true })
    }
  }

  async function handleDeleteAccount() {
    if (!window.confirm('ATENÇÃO: isto irá deletar permanentemente sua conta. Continuar?')) return
    setMessage(null)
    setDeleting(true)
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY)
      const response = await fetch(`${API_BASE_URL}${USUARIO_ENDPOINT}/${user.id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      })

      if (!response.ok && response.status !== 204) {
        throw new Error(`Failed to delete account: ${response.statusText}`)
      }

      // Successful deletion: clear local auth and navigate to login
      authLogout()
      localStorage.removeItem('user_data')
      setMessage({ type: 'success', text: 'Conta deletada com sucesso.' })
      navigate('/login', { replace: true })
    } catch (err) {
      setMessage({ type: 'error', text: 'Falha ao deletar a conta.' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <h1 style={{ 
        fontSize: '32px', 
        fontWeight: 700, 
        marginBottom: '8px',
        color: '#f1f5f9'
      }}>
        Perfil
      </h1>
      <p style={{ 
        color: '#94a3b8', 
        marginBottom: '32px',
        fontSize: '16px'
      }}>
        Gerencie suas informações pessoais
      </p>

      <div 
        style={{
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '700px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)'
        }}
        role="region" 
        aria-labelledby="profile-heading"
      >
        <h2 
          id="profile-heading" 
          style={{ 
            marginTop: 0,
            fontSize: '20px',
            fontWeight: 600,
            marginBottom: '24px',
            color: '#f1f5f9'
          }}
        >
          Informações da Conta
        </h2>

        {!editing ? (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 500, 
                color: '#94a3b8',
                marginBottom: '6px'
              }}>
                Nome
              </div>
              <div style={{ 
                fontSize: 16, 
                fontWeight: 600,
                color: '#f1f5f9'
              }}>
                {user.name}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 500, 
                color: '#94a3b8',
                marginBottom: '6px'
              }}>
                E-mail
              </div>
              <div style={{ 
                fontSize: 16,
                color: '#f1f5f9'
              }}>
                {user.email}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 500, 
                color: '#94a3b8',
                marginBottom: '6px'
              }}>
                Função
              </div>
              <div>
                <span style={{
                  display: 'inline-block',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#f1f5f9',
                  backgroundColor: '#334155',
                  padding: '6px 12px',
                  borderRadius: '8px'
                }}>
                  {user.role ?? '—'}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 500, 
                color: '#94a3b8',
                marginBottom: '6px'
              }}>
                Membro desde
              </div>
              <div style={{ 
                fontSize: 16,
                color: '#f1f5f9'
              }}>
                {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString('pt-BR') : '—'}
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '12px',
              paddingTop: '24px',
              borderTop: '1px solid #334155'
            }}>
              <button 
                onClick={() => { 
                  setEditing(true); 
                  setForm({ name: user.name, email: user.email }) 
                }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6'
                }}
              >
                ✏️ Editar Perfil
              </button>
              <button 
                onClick={handleLogout}
                aria-label="Sair da conta"
                style={{ 
                  padding: '12px 24px',
                  borderRadius: '10px',
                  backgroundColor: 'transparent',
                  color: '#f87171',
                  border: '1px solid #7f1d1d',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#7f1d1d'
                  e.currentTarget.style.color = '#ffffff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#f87171'
                }}
              >
                🚪 Sair da Conta
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                aria-label="Deletar conta"
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  backgroundColor: 'transparent',
                  color: '#fecaca',
                  border: '1px solid #7f1d1d',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  opacity: deleting ? 0.6 : 1,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!deleting) {
                    e.currentTarget.style.backgroundColor = '#7f1d1d'
                    e.currentTarget.style.color = '#ffffff'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!deleting) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#fecaca'
                  }
                }}
              >
                {deleting ? 'Deletando…' : '🗑️ Deletar Conta'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <label style={{ display: 'block', marginBottom: '16px' }}>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 500, 
                marginBottom: '8px',
                color: '#cbd5e1'
              }}>
                Nome
              </div>
              <input 
                name="name" 
                value={form.name ?? ''} 
                onChange={handleChange} 
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '10px', 
                  border: '1px solid #475569',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: '#0f172a',
                  color: '#f1f5f9'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#64748b'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(100, 116, 139, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#475569'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: '20px' }}>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 500, 
                marginBottom: '8px',
                color: '#cbd5e1'
              }}>
                E-mail
              </div>
              <input 
                name="email" 
                value={form.email ?? ''} 
                onChange={handleChange} 
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '10px', 
                  border: '1px solid #475569',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: '#0f172a',
                  color: '#f1f5f9'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#64748b'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(100, 116, 139, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#475569'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </label>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={handleSave} 
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#2563eb'
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#3b82f6'
                }}
              >
                {loading ? 'Salvando…' : 'Salvar'}
              </button>
              <button 
                onClick={() => { 
                  setEditing(false); 
                  setMessage(null) 
                }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  backgroundColor: 'transparent',
                  color: '#cbd5e1',
                  border: '1px solid #475569',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#334155'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {message && (
          <div 
            role="status" 
            style={{ 
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: '10px',
              backgroundColor: message.type === 'error' ? '#7f1d1d' : '#14532d',
              border: `1px solid ${message.type === 'error' ? '#991b1b' : '#166534'}`,
              color: message.type === 'error' ? '#fca5a5' : '#86efac',
              fontSize: '14px'
            }}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}
