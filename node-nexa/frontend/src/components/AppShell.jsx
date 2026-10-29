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
export default function AppShell({ guest = false }) {
  const { user, updateUser, logout } = useAuth();
  const [page, setPage] = useState('home');
  const [toast, setToast] = useState(''); const [tourStep, setTourStep] = useState(() => guest ? 0 : -1);
  const tour = [{ title: 'Selamat datang di Nueva', text: 'Ikuti tur singkat ini untuk mengenal fungsi utama aplikasi.', page: 'home' }, { title: 'Saldo utama', text: 'Di sini kamu dapat melihat saldo dan nomor rekening. Tekan ikon mata untuk menyembunyikan saldo.', page: 'home' }, { title: 'Akses cepat', text: 'Gunakan Transfer, Top up, atau Portofolio dari area ini.', page: 'home' }, { title: 'Navigasi aplikasi', text: 'Pindah halaman melalui menu Home, Transfer, Portofolio, dan Mutasi di bagian bawah.', page: 'home' }];
  const finishTour = () => setTourStep(-1);
  const nextTour = () => tourStep === tour.length - 1 ? finishTour() : setTourStep(tourStep + 1);
  const prevTour = () => setTourStep(Math.max(0, tourStep - 1));

  useEffect(() => {
    if (guest) return undefined; const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', { withCredentials: true });
    socket.on('balance:updated', (nextUser) => { updateUser(nextUser); setToast('Saldo berhasil diperbarui realtime'); setTimeout(() => setToast(''), 2800); });
    return () => socket.disconnect();
  }, [guest]);

  const demoUser = guest ? { name: 'Guest', balance: 12500000, accountNumber: '0000000000', id: 'guest' } : user;
  const content = { home: <DashboardPage onNavigate={setPage} guest={guest} demoUser={demoUser} tourStep={tourStep} />, transfer: <TransferPage onSuccess={() => setPage('home')} guest={guest} demoUser={demoUser} />, investasi: <PortfolioPage />, history: <HistoryPage /> }[page];
  return <main className="relative mx-auto flex min-h-screen w-full max-w-[420px] flex-col overflow-hidden bg-[#f6f9fd] shadow-[0_0_0_1px_rgba(15,48,91,.12),0_24px_70px_rgba(15,48,91,.18)] md:my-8 md:min-h-[calc(100vh-4rem)] md:rounded-[34px]">
    <header className="flex items-center justify-between px-6 pb-2 pt-7"><div><p className="text-[11px] font-semibold uppercase tracking-[.2em] text-[#0b4aa2]">Nueva</p><p className="text-xs text-slate-400">{guest ? 'Mode guest' : 'Digital banking'}</p></div><div className="flex items-center gap-2"><button className="rounded-full bg-white p-2 text-slate-500 shadow-sm"><Bell size={17} /></button><button onClick={logout} className="rounded-full bg-white p-2 text-slate-500 shadow-sm" title={guest ? 'Keluar dari demo' : 'Keluar'}><LogOut size={16} /></button></div></header>
    <section className="min-h-0 flex-1 overflow-y-auto px-5 pb-28">{guest && <div className="mb-4 rounded-2xl bg-teal-50 p-4 text-xs text-teal-800"><b>Mode guest aktif</b><br />Data di bawah hanya contoh. Transaksi dinonaktifkan.</div>}{content}</section>
    {tourStep >= 0 && <div className="absolute inset-0 z-50 bg-[#071c36]/65"><div className={`absolute left-5 right-5 ${tourStep === 0 ? 'top-1/2 -translate-y-1/2' : tourStep === 1 ? 'top-[245px]' : tourStep === 2 ? 'top-[340px]' : 'bottom-24'} rounded-[24px] bg-white p-5 shadow-2xl`}><p className="text-[10px] font-bold uppercase tracking-widest text-[#0badae]">Pengenalan Nueva · {tourStep + 1}/{tour.length}</p><h2 className="mt-2 text-lg font-bold text-[#102f5c]">{tour[tourStep].title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{tour[tourStep].text}</p><div className="mt-5 flex items-center justify-between gap-3"><button onClick={finishTour} className="text-xs font-semibold text-slate-400">Lewati</button><div className="flex gap-2">{tourStep > 0 && <button onClick={prevTour} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600">Prev</button>}<button onClick={nextTour} className="rounded-xl bg-[#0b4aa2] px-4 py-2 text-xs font-bold text-white">{tourStep === 0 ? 'Mulai' : tourStep === tour.length - 1 ? 'Selesai' : 'Next'}</button></div></div></div></div>}
    {toast && <div className="absolute left-5 right-5 top-5 z-40 rounded-2xl bg-[#0b4aa2] px-4 py-3 text-center text-xs font-semibold text-white shadow-xl">{toast}</div>}
    <BottomNav page={page} onChange={setPage} />
  </main>;
}
