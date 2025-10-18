import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import Dashboard from '@/pages/Dashboard';
import { server } from '@/test/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock authenticated user
const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user' as const,
};

const renderDashboard = () => {
  localStorage.setItem('token', 'mock-token');
  localStorage.setItem('user', JSON.stringify(mockUser));
  
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Page', () => {
  it('should render dashboard with metrics', () => {
    renderDashboard();
    
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/vendas totais/i)).toBeInTheDocument();
    expect(screen.getByText(/usuários ativos/i)).toBeInTheDocument();
    expect(screen.getByText(/taxa de conversão/i)).toBeInTheDocument();
  });

  it('should render stock table', () => {
    renderDashboard();
    
    expect(screen.getByText(/estoque/i)).toBeInTheDocument();
    expect(screen.getByText(/produto a/i)).toBeInTheDocument();
  });

  it('should render revenue table', () => {
    renderDashboard();
    
    expect(screen.getByText(/receita mensal/i)).toBeInTheDocument();
    expect(screen.getByText(/janeiro/i)).toBeInTheDocument();
  });

  it('should handle send report button click', async () => {
    renderDashboard();
    
    const sendButton = screen.getByRole('button', { name: /enviar relatório/i });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(sendButton).not.toBeDisabled();
    });
  });

  it('should handle file upload', async () => {
    renderDashboard();
    
    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    if (input) {
      fireEvent.change(input, { target: { files: [file] } });
      
      await waitFor(() => {
        expect(input.files?.[0]).toBe(file);
      });
    }
  });
});
