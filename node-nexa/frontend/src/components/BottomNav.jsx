import { BarChart3, History, Home, Send } from 'lucide-react';

const items = [
  { key: 'home', label: 'Home', Icon: Home }, { key: 'transfer', label: 'Transfer', Icon: Send },
  { key: 'investasi', label: 'Portofolio', Icon: BarChart3 }, { key: 'history', label: 'Mutasi', Icon: History }
];

// Navigasi utama bergaya bottom tab pada aplikasi mobile.
export default function BottomNav({ page, onChange }) {
  return <nav className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-4 pt-3"><div className="flex justify-around rounded-[24px] border border-slate-100 bg-white/95 p-2 shadow-[0_12px_32px_rgba(13,44,92,.14)] backdrop-blur">
    {items.map(({ key, label, Icon }) => <button key={key} onClick={() => onChange(key)} className={`flex min-w-[64px] flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[10px] font-semibold transition ${page === key ? 'bg-blue-50 text-[#0b4aa2]' : 'text-slate-400 hover:text-slate-700'}`}><Icon size={19} strokeWidth={page === key ? 2.5 : 2} /><span>{label}</span></button>)}
  </div></nav>;
}
