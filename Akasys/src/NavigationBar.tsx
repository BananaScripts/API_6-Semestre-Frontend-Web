import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Types
export interface NavLinkItem {
  name: string
  to: string
  icon: string
  /** Optional: hide link based on user role or other checks */
  show?: boolean
}

export interface NavigationBarProps {
  links?: NavLinkItem[]
}

// Navigation links sourced from the `src/Pages` folder
// Pages present: Admin.tsx, Chat.tsx, Dashboard.tsx, Profile.tsx
export const PAGES: NavLinkItem[] = [
  { name: 'Dashboard', to: '/dashboard', icon: '📊' },
  { name: 'Chat', to: '/chat', icon: '💬' },
  { name: 'Perfil', to: '/profile', icon: '👤' },
  { name: 'Admin', to: '/admin', icon: '⚙️' },
]

const DEFAULT_LINKS: NavLinkItem[] = PAGES

/**
 * NavigationBar
 * - Barra de navegação vertical minimalista
 * - Design preto e branco com bordas arredondadas
 * - Ícones e nomes para cada página
 */
export default function NavigationBar({
  links = DEFAULT_LINKS,
}: NavigationBarProps) {
  const { user } = useAuth()
  const location = useLocation()

  const visibleLinks = links.filter((l) => l.show !== false)

  return (
    <aside 
      role="navigation"
      aria-label="Navegação principal"
      style={{ 
        width: '220px',
        minHeight: '100vh',
        backgroundColor: '#1e293b',
        borderRight: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: '40px', paddingLeft: '8px' }}>
        <Link to="/" aria-label="Início" style={{ 
          textDecoration: 'none',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: '-0.025em',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ⚡ Akasys
        </Link>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1 }}>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {visibleLinks.map((l) => {
            const isActive = location.pathname === l.to
            return (
              <li key={l.to}>
                <Link
                  to={l.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: 12,
                    textDecoration: 'none',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    backgroundColor: isActive ? '#334155' : 'transparent',
                    transition: 'all 0.2s',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '15px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#475569'
                      e.currentTarget.style.color = '#ffffff'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = '#94a3b8'
                    }
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{l.icon}</span>
                  <span>{l.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Info */}
      {user && (
        <div style={{ 
          padding: '16px',
          borderTop: '1px solid #334155',
          marginTop: '16px'
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '6px'
          }}>
            <span style={{ 
              fontSize: 14, 
              color: '#f1f5f9',
              fontWeight: 600
            }}>
              {user.name}
            </span>
            <span style={{ 
              fontSize: 12, 
              color: '#cbd5e1',
              backgroundColor: '#334155',
              padding: '4px 8px',
              borderRadius: 8,
              display: 'inline-block',
              width: 'fit-content'
            }}>
              {user.role || 'Membro'}
            </span>
          </div>
        </div>
      )}
    </aside>
  )
}
