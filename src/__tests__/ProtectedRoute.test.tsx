import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const TestComponent = () => <div>Protected Content</div>;
const LoginComponent = () => <div>Login Page</div>;

const renderProtectedRoute = (isAdmin = false) => {
  const mockUser = isAdmin ? {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin' as const,
  } : {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user' as const,
  };

  if (isAdmin || !isAdmin) {
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
  }

  return render(
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route 
            path="/protected" 
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly>
                <TestComponent />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('ProtectedRoute', () => {
  it('should redirect to login when not authenticated', () => {
    localStorage.clear();
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <TestComponent />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );

    // Should eventually redirect to login
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should allow admin access to admin-only routes', () => {
    renderProtectedRoute(true);
    
    // Navigate to admin route
    window.history.pushState({}, '', '/admin');
    
    // Admin should see content
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should block non-admin from admin routes', () => {
    renderProtectedRoute(false);
    
    // Navigate to admin route
    window.history.pushState({}, '', '/admin');
    
    // Non-admin should be redirected
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
