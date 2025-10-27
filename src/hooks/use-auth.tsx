import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";
import { Usuario } from "@/types/api";

interface User {
  id: number;
  nome: string;
  email: string;
  role?: 'admin' | 'user'; // Optional since backend doesn't provide role
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: { nome: string; email: string; senha: string }) => Promise<boolean>;
  isLoading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in by checking token
    const token = apiService.getToken();
    const savedUser = localStorage.getItem("akasys_user");

    if (token) {
      // If we have a token but no saved user, try to decode it
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (error) {
          apiService.clearToken();
          localStorage.removeItem("akasys_user");
        }
      } else {
        // Try to decode JWT to populate minimal user info (if token is a JWT)
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            const inferredUser: User = {
              id: payload.sub ? Number(payload.sub) : 0,
              nome: payload.nome || payload.name || (payload.email ? payload.email.split('@')[0] : 'user'),
              email: payload.email || payload.preferred_username || '',
            };
            setUser(inferredUser);
            localStorage.setItem('akasys_user', JSON.stringify(inferredUser));
          }
        } catch (e) {
          // ignore decode errors
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Call real API login
      const loginResponse = await apiService.login({ username: email, password });

      // apiService already stored the token. Try to decode token for user info
      let userData: User | null = null;
      const token = loginResponse.access_token;

      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          userData = {
            id: payload.sub ? Number(payload.sub) : 0,
            nome: payload.nome || payload.name || email.split('@')[0],
            email: payload.email || email,
          };
        }
      } catch (e) {
        // fallback
      }

      if (!userData) {
        userData = {
          id: 0,
          nome: email.split('@')[0],
          email,
        };
      }

      setUser(userData);
      localStorage.setItem("akasys_user", JSON.stringify(userData));
      setIsLoading(false);
      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: { nome: string; email: string; senha: string }): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await apiService.createUser(userData);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    apiService.clearToken();
    localStorage.removeItem("akasys_user");
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      isLoading, 
      token: apiService.getToken() 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}