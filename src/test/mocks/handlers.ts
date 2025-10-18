import { http, HttpResponse } from 'msw';

const BASE_URL = 'http://localhost:3000';

export const handlers = [
  // Auth endpoints
  http.post(`${BASE_URL}/api/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    
    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        token: 'mock-jwt-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user',
        },
      });
    }
    
    if (body.email === 'admin@example.com' && body.password === 'admin123') {
      return HttpResponse.json({
        token: 'mock-admin-token',
        user: {
          id: '2',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
        },
      });
    }
    
    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  // User endpoints
  http.get(`${BASE_URL}/api/users/me`, () => {
    return HttpResponse.json({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    });
  }),

  http.get(`${BASE_URL}/api/users`, () => {
    return HttpResponse.json([
      { id: '1', name: 'User 1', email: 'user1@example.com', role: 'user', status: 'active', createdAt: '2024-01-01' },
      { id: '2', name: 'User 2', email: 'user2@example.com', role: 'admin', status: 'active', createdAt: '2024-01-02' },
    ]);
  }),

  http.post(`${BASE_URL}/api/users`, async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      id: '3',
      name: body.name,
      email: body.email,
      role: body.role,
      status: body.status,
      createdAt: new Date().toISOString(),
    }, { status: 201 });
  }),

  http.put(`${BASE_URL}/api/users/:id`, async ({ request, params }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      id: params.id,
      name: body.name,
      email: body.email,
      role: body.role,
      status: body.status,
    });
  }),

  http.delete(`${BASE_URL}/api/users/:id`, ({ params }) => {
    return HttpResponse.json({ success: true });
  }),

  // Reports endpoints
  http.post(`${BASE_URL}/api/reports/send`, () => {
    return HttpResponse.json({ success: true, message: 'Report sent successfully' });
  }),

  // Upload endpoint
  http.post(`${BASE_URL}/api/upload`, () => {
    return HttpResponse.json({ 
      success: true, 
      filename: 'test-file.csv',
      message: 'File uploaded successfully' 
    });
  }),

  // Chat endpoints
  http.get(`${BASE_URL}/api/conversations`, () => {
    return HttpResponse.json([
      { id: '1', name: 'Chat 1', lastMessage: 'Hello', time: '10:00', unread: 2 },
      { id: '2', name: 'Chat 2', lastMessage: 'Hi there', time: '09:00', unread: 0 },
    ]);
  }),

  http.get(`${BASE_URL}/api/conversations/:id/messages`, ({ params }) => {
    return HttpResponse.json([
      { id: '1', text: 'Hello', sender: 'other', time: '10:00' },
      { id: '2', text: 'Hi', sender: 'user', time: '10:01' },
    ]);
  }),
];
