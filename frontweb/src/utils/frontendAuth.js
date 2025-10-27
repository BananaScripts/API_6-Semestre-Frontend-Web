// Dev-only frontend auth helper. Stores users in localStorage under 'fw_users'.
// NOT secure. Use only for local development or prototypes.

function _loadUsers() {
  try {
    return JSON.parse(localStorage.getItem('fw_users') || '{}');
  } catch (e) { return {}; }
}

function _saveUsers(users) {
  localStorage.setItem('fw_users', JSON.stringify(users));
}

function _hash(pw) {
  // trivial non-cryptographic hash for demo only
  let h = 0; for (let i=0;i<pw.length;i++){ h = ((h<<5)-h)+pw.charCodeAt(i); h |= 0; } return String(h);
}

export function registerUser({ nome, email, senha }){
  const users = _loadUsers();
  if (users[email]) return { ok: false, status: 409, detail: 'email exists' };
  users[email] = { nome, email, senha_hash: _hash(senha), created_at: Date.now() };
  _saveUsers(users);
  // return fake token
  return { ok: true, status: 201, access_token: `fw-token:${email}` };
}

export function loginUser({ email, senha }){
  const users = _loadUsers();
  const u = users[email];
  if (!u) return { ok: false, status: 404, detail: 'not found' };
  if (u.senha_hash !== _hash(senha)) return { ok: false, status: 401, detail: 'invalid creds' };
  return { ok: true, status: 200, access_token: `fw-token:${email}` };
}

export function listUsers(){ return Object.values(_loadUsers()); }

export default { registerUser, loginUser, listUsers };
