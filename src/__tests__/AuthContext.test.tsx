import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { server } from '@/test/mocks/server';

// Setup MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Test component that uses auth context
const TestComponent = () => {
  const { user, token, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <div data-testid="user-name">{user?.name || 'No user'}</div>
      <div data-testid="user-email">{user?.email || 'No email'}</div>
      <div data-testid="token">{token || 'No token'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  it('should provide initial state with no user', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('user-name')).toHaveTextContent('No user');
    expect(screen.getByTestId('token')).toHaveTextContent('No token');
  });

  it('should load user from localStorage', async () => {
    const mockUser = {
      id: '1',
      name: 'Stored User',
      email: 'stored@example.com',
      role: 'user' as const,
    };
    
    localStorage.setItem('token', 'stored-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('Stored User');
      expect(screen.getByTestId('token')).toHaveTextContent('stored-token');
    });
  });
});
