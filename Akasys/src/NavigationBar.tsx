import React, { useState } from 'react'
// If your project doesn't use react-router, replace the `Link` imports/usages
// with regular `<a href="...">` elements.
import { Link } from 'react-router-dom'

// Types
export interface NavLinkItem {
  name: string
  to: string
  /** Optional: hide link based on user role or other checks */
  show?: boolean
}

export interface NavigationBarProps {
  links?: NavLinkItem[]
  /** TODO: Inject current user/session here when available */
  currentUser?: { id?: string; name?: string; role?: string } | null
  /** TODO: Implement logout handler and pass it in from parent */
  onLogout?: () => void
}

// Navigation links sourced from the `src/Pages` folder
// Pages present: Admin.tsx, Chat.tsx, Dashboard.tsx, Profile.tsx
export const PAGES: NavLinkItem[] = [
  { name: 'Dashboard', to: '/dashboard' },
  { name: 'Chat', to: '/chat' },
  { name: 'Profile', to: '/profile' },
  { name: 'Admin', to: '/admin' },
]

const DEFAULT_LINKS: NavLinkItem[] = PAGES

/**
 * NavigationBar
 * - Minimal, responsive navigation using react-router `<Link>`
 * - Keyboard accessible toggler and link focus states
 * - Simple state-based mobile menu toggle
 */
export default function NavigationBar({
  links = DEFAULT_LINKS,
  currentUser = null,
  onLogout,
}: NavigationBarProps) {
  const [open, setOpen] = useState(false)

  const visibleLinks = links.filter((l) => l.show !== false)

  return (
    <header role="banner" style={{ borderBottom: '1px solid #e6e6e6' }}>
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{ maxWidth: 1100, margin: '0 auto', padding: '0.5rem 1rem' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/" aria-label="Home" style={{ textDecoration: 'none' }}>
              <strong style={{ fontSize: 18 }}>Akasys</strong>
            </Link>
          </div>

          {/* Mobile burger toggler */}
          <button
            onClick={() => setOpen((s) => !s)}
            aria-expanded={open}
            aria-controls="main-navigation"
            aria-label={open ? 'Close menu' : 'Open menu'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 8,
              background: 'transparent',
              border: '1px solid transparent',
              borderRadius: 6,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              {open ? (
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu: responsive — show horizontally on wide screens, toggle on mobile */}
        <div
          id="main-navigation"
          style={{
            marginTop: 10,
            display: open ? 'block' : 'none',
          }}
        >
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {visibleLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'inline-block',
                    padding: '8px 10px',
                    borderRadius: 6,
                    textDecoration: 'none',
                    color: '#111',
                  }}
                  // keyboard focus visible
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      // allow Enter to behave like click for accessibility
                      ;(e.target as HTMLElement).click()
                    }
                  }}
                >
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: 8 }}>
            {currentUser ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 14 }}>Hi, {currentUser.name ?? 'User'}</span>
                <button
                  onClick={onLogout}
                  style={{ padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/login" style={{ padding: '6px 10px', borderRadius: 6, textDecoration: 'none' }}>
                  Login
                </Link>
                <Link to="/signup" style={{ padding: '6px 10px', borderRadius: 6, textDecoration: 'none' }}>
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Inline small responsive hint: show horizontal menu on wider viewports via media query.
            For simplicity we include a tiny CSS snippet below — paste it into your global css.
        */}

        {/*
          CSS to add to your global stylesheet for horizontal desktop layout:

          @media (min-width: 640px) {
            #main-navigation { display: block !important; }
            #main-navigation ul { flex-direction: row; gap: 12px; align-items: center; }
            #main-navigation ul li a { padding: 8px 12px; }
            button[aria-controls="main-navigation"] { display: none; }
          }

          /* Focus styles example */
          a:focus, button:focus { outline: 3px solid rgba(59,130,246,0.3); outline-offset: 2px; }
        */}
      </nav>
    </header>
  )
}

/* Example integration (comment):
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavigationBar from './Pages/NavigationBar'

function AppLayout() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <main>
        <Routes>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
          <Route path="/chat" element={<div>Chat</div>} />
          <Route path="/profile" element={<div>Profile</div>} />
          <Route path="/admin" element={<div>Admin</div>} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

*/
