import { Bell, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import BottomNav from './BottomNav';
import DashboardPage from '../pages/DashboardPage';
import TransferPage from '../pages/TransferPage';
import PortfolioPage from '../pages/PortfolioPage';
import HistoryPage from '../pages/HistoryPage';

// Membungkus seluruh halaman dalam frame mobile dan mengaktifkan realtime Socket.io.
export default function AppShell() {
  const { user, updateUser, logout } = useAuth();
  const [page, setPage] = useState('home');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', { withCredentials: true });
    socket.on('balance:updated', (nextUser) => { updateUser(nextUser); setToast('Saldo berhasil diperbarui realtime'); setTimeout(() => setToast(''), 2800); });
    return () => socket.disconnect();
  }, []);

  const content = { home: <DashboardPage onNavigate={setPage} />, transfer: <TransferPage onSuccess={() => setPage('home')} />, investasi: <PortfolioPage />, history: <HistoryPage /> }[page];
  return <main className="relative mx-auto flex min-h-screen w-full max-w-[420px] flex-col overflow-hidden bg-[#f6f9fd] shadow-[0_0_0_1px_rgba(15,48,91,.12),0_24px_70px_rgba(15,48,91,.18)] md:my-8 md:min-h-[calc(100vh-4rem)] md:rounded-[34px]">
    <header className="flex items-center justify-between px-6 pb-2 pt-7"><div><p className="text-[11px] font-semibold uppercase tracking-[.2em] text-[#0b4aa2]">Nueva</p><p className="text-xs text-slate-400">Digital banking</p></div><div className="flex items-center gap-2"><button className="rounded-full bg-white p-2 text-slate-500 shadow-sm"><Bell size={17} /></button><button onClick={logout} className="rounded-full bg-white p-2 text-slate-500 shadow-sm" title="Keluar"><LogOut size={16} /></button></div></header>
    <section className="min-h-0 flex-1 overflow-y-auto px-5 pb-28">{content}</section>
    {toast && <div className="absolute left-5 right-5 top-5 z-40 rounded-2xl bg-[#0b4aa2] px-4 py-3 text-center text-xs font-semibold text-white shadow-xl">{toast}</div>}
    <BottomNav page={page} onChange={setPage} />
  </main>;
}
