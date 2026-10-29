import { createContext, useContext, useEffect, useState } from 'react';
import api, { ensureCsrfToken } from '../api/client';

const AuthContext = createContext(null);

// Menyediakan state user, login, register, dan logout untuk seluruh aplikasi.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('nueva_user') || 'null'));
  const [guest, setGuest] = useState(() => localStorage.getItem('nueva_guest') === '1');
  const [loading, setLoading] = useState(true);

  useEffect(() => { Promise.all([api.get('/health'), ensureCsrfToken()]).finally(() => setLoading(false)); }, []);

  // Menyimpan token dan profil user setelah autentikasi berhasil.
  function persistSession(data) {
    localStorage.setItem('nueva_user', JSON.stringify(data.user));
    setUser(data.user);
  }

  async function login(form) { const { data } = await api.post('/auth/login', form); persistSession(data); }
  async function register(form) { const { data } = await api.post('/auth/register', form); persistSession(data); }
  async function logout() { try { await api.post('/auth/logout'); } catch {} finally { localStorage.removeItem('nueva_token'); localStorage.removeItem('nueva_user'); localStorage.removeItem('nueva_guest'); setUser(null); setGuest(false); } }
  function enterGuest() { localStorage.setItem('nueva_guest', '1'); setGuest(true); }
  function updateUser(nextUser) { localStorage.setItem('nueva_user', JSON.stringify(nextUser)); setUser(nextUser); }

  return <AuthContext.Provider value={{ user, guest, loading, login, register, logout, enterGuest, updateUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
