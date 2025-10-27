// Minimal API wrapper for the CRA frontweb app
const API_BASE = '';// proxy in frontweb/package.json points to backend (http://localhost:8000)

function getToken(){
  return localStorage.getItem('token') || null;
}

function setToken(token){
  if(token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

function authHeader(){
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function login({ email, senha }){
  const form = new URLSearchParams();
  form.append('username', email);
  form.append('password', senha);

  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form
  });

  if (!res.ok) {
    const txt = await res.text().catch(()=>res.statusText);
    throw new Error(txt || 'Login failed');
  }

  const data = await res.json();
  if (data.access_token) setToken(data.access_token);
  return data;
}

async function createUser({ nome, email, senha }){
  const res = await fetch(`${API_BASE}/usuario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha })
  });
  if (!res.ok) {
    const err = await res.json().catch(()=>({ detail: res.statusText }));
    throw new Error(err.detail || 'Create user failed');
  }
  return res.json();
}

async function listUsers(){
  const res = await fetch(`${API_BASE}/usuario`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...authHeader() }
  });
  if (!res.ok) return [];
  return res.json();
}

async function getVendas(){
  const res = await fetch(`${API_BASE}/vendas`, { headers: { ...authHeader() } });
  if (!res.ok) return [];
  return res.json();
}

async function getEstoque(){
  const res = await fetch(`${API_BASE}/estoque`, { headers: { ...authHeader() } });
  if (!res.ok) return [];
  return res.json();
}

async function sendReport(email, assunto, corpo){
  const params = new URLSearchParams();
  params.append('assunto', assunto);
  params.append('corpo', corpo);
  const res = await fetch(`${API_BASE}/relatorios/enviar?${params.toString()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw new Error('Send report failed');
  return res.json();
}

function decodeToken(){
  const t = getToken();
  if(!t) return null;
  try{
    const parts = t.split('.');
    if(parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/g,'/')));
    return payload;
  }catch(e){ return null; }
}

function logout(){ setToken(null); }

export default {
  login,
  createUser,
  listUsers,
  getVendas,
  getEstoque,
  sendReport,
  decodeToken,
  logout,
  getToken
};
