import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, User, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Topbar({ sidebarCollapsed, unread = {} }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const totalUnread = (unread.rfq ?? 0) + (unread.contact ?? 0);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const sidebarW = sidebarCollapsed ? '64px' : '260px';

  return (
    <header
      className="fixed top-0 right-0 h-16 bg-white border-b border-surface-border z-20
                 flex items-center justify-between px-5 shadow-topbar transition-all duration-300"
      style={{ left: sidebarW }}
    >
      {/* Left: breadcrumb or title (kosong untuk sekarang) */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-amber-500" />
        <span className="text-xs font-semibold text-obsidian-400 uppercase tracking-wider">
          Admin Panel
        </span>
      </div>

      {/* Right: Notif + Profile */}
      <div className="flex items-center gap-2">
        {/* Notifikasi */}
        <button
          onClick={() => navigate('/rfq')}
          className="relative btn btn-ghost btn-sm"
        >
          <Bell size={18} />
          {totalUnread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-crimson-500 text-white text-[9px] font-bold flex items-center justify-center">
              {totalUnread > 9 ? '9+' : totalUnread}
            </span>
          )}
        </button>

        {/* Lihat website */}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost btn-sm"
          title="Buka website publik"
        >
          <ExternalLink size={16} />
        </a>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-lg
                       hover:bg-surface-hover transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-navy-900 flex items-center justify-center">
              <span className="text-xs font-bold text-amber-400 font-display">
                {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
              </span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-obsidian-800 leading-none">{user?.name ?? 'Admin'}</p>
              <p className="text-[10px] text-obsidian-400 mt-0.5">Super Admin</p>
            </div>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-surface-border z-20 py-1 animate-fade-in">
                <button
                  onClick={() => { setMenuOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-obsidian-600 hover:bg-surface-hover"
                >
                  <User size={14} /> Profil
                </button>
                <div className="h-px bg-surface-border my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-crimson-500 hover:bg-crimson-50"
                >
                  <LogOut size={14} /> Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
