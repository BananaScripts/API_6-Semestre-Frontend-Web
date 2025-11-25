import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import NavigationBar from './NavigationBar'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import Chat from './Pages/Chat'
import Profile from './Pages/Profile'
import Admin from './Pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rota pública de login */}
          <Route path="/login" element={<Login />} />
          
          {/* Rotas protegidas - requerem autenticação */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div style={{ 
                  fontFamily: 'system-ui, sans-serif', 
                  minHeight: '100vh',
                  backgroundColor: '#0f172a',
                  display: 'flex'
                }}>
                  <NavigationBar />
                  <main style={{ 
                    marginLeft: '220px',
                    flex: 1,
                    padding: '32px',
                    minHeight: '100vh',
                    width: 'calc(100% - 220px)'
                  }}>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/admin" element={<Admin />} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
