import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import AppShell from './components/AppShell';

function AppContent() { const { user, loading } = useAuth(); const [mode, setMode] = useState('login'); if (loading) return null; return user ? <AppShell /> : <AuthForm mode={mode} onToggle={() => setMode(mode === 'login' ? 'register' : 'login')} />; }
export default function App() { return <AuthProvider><AppContent /></AuthProvider>; }
