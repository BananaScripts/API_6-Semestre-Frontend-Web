import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  name: string
  email: string
  role?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-6-semestre-backend.onrender.com'
const LOGIN_ENDPOINT = import.meta.env.VITE_LOGIN_ENDPOINT || '/login'
const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar se já existe token no localStorage ao carregar
  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY)
    const storedUser = localStorage.getItem('user_data')
    
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(userData)
      } catch (err) {
        // Se houver erro ao parsear, limpar dados corrompidos
        localStorage.removeItem(AUTH_TOKEN_KEY)
        localStorage.removeItem('user_data')
      }
    }
    
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Criar form data para enviar ao backend
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)

      const response = await fetch(`${API_BASE_URL}${LOGIN_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Falha no login. Verifique suas credenciais.')
      }

      const data = await response.json()
      
      // O backend retorna access_token e token_type
      const authToken = data.access_token
      
      if (!authToken) {
        throw new Error('Token não recebido do servidor')
      }

      // Criar dados do usuário a partir do email (backend não retorna dados do usuário no login)
      const userData: User = {
        id: '0', // Será atualizado quando buscar dados do usuário
        name: email.split('@')[0], // Nome temporário até buscar dados reais
        email: email,
        role: 'member'
      }

      // Salvar no localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, authToken)
      localStorage.setItem('user_data', JSON.stringify(userData))

      // Atualizar estado
      setToken(authToken)
      setUser(userData)

      // TODO: Fazer uma requisição adicional para buscar dados completos do usuário
      // usando o token recebido
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro ao conectar com o servidor')
    }
  }

  const logout = () => {
    // Limpar dados do localStorage
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem('user_data')
    
    // Limpar estado
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
