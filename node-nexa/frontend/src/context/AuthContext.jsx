import { createContext, useContext, useEffect, useState } from 'react';
import api, { ensureCsrfToken } from '../api/client';

const AuthContext = createContext(null);

// Menyediakan state user, login, register, dan logout untuk seluruh aplikasi.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('nueva_user') || 'null'));
  const [loading, setLoading] = useState(true);

  useEffect(() => { Promise.all([api.get('/health'), ensureCsrfToken()]).finally(() => setLoading(false)); }, []);

  // Menyimpan token dan profil user setelah autentikasi berhasil.
  function persistSession(data) {
    localStorage.setItem('nueva_user', JSON.stringify(data.user));
    setUser(data.user);
  }

  async function login(form) { const { data } = await api.post('/auth/login', form); persistSession(data); }
  async function register(form) { const { data } = await api.post('/auth/register', form); persistSession(data); }
  async function logout() { try { await api.post('/auth/logout'); } finally { localStorage.removeItem('nueva_token'); localStorage.removeItem('nueva_user'); setUser(null); } }
  function updateUser(nextUser) { localStorage.setItem('nueva_user', JSON.stringify(nextUser)); setUser(nextUser); }

  return <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
