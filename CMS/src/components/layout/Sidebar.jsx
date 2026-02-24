import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Wrench, Image, Newspaper,
  MessageSquare, FileText, Star, ChevronRight,
} from 'lucide-react';

const NAV = [
  {
    group: 'Utama',
    items: [
      { path: '/dashboard',  label: 'Dashboard',    icon: LayoutDashboard },
    ],
  },
  {
    group: 'Konten',
    items: [
      { path: '/produk',     label: 'Produk',       icon: Package },
      { path: '/layanan',    label: 'Layanan',       icon: Wrench },
      { path: '/portfolio',  label: 'Portfolio',     icon: Image },
      { path: '/berita',     label: 'Berita & Info', icon: Newspaper },
      { path: '/testimoni',  label: 'Testimoni',     icon: Star },
    ],
  },
  {
    group: 'Inbox',
    items: [
      { path: '/rfq',   label: 'RFQ',   icon: FileText,      badge: 'rfq' },
      { path: '/pesan', label: 'Pesan', icon: MessageSquare, badge: 'contact' },
    ],
  },
];

export default function Sidebar({ unread = {}, collapsed, onToggle }) {
  const { pathname } = useLocation();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-navy-900 flex flex-col z-30
                  transition-all duration-300
                  ${collapsed ? 'w-16' : 'w-[260px]'}
                  shadow-sidebar`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-navy-800 shrink-0">
        <div className="w-8 h-8 rounded-md bg-amber-500 flex items-center justify-center shrink-0">
          <span className="font-display font-black text-navy-900 text-sm tracking-tight">MNI</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-display font-bold text-white text-sm leading-none">Mitra Niaga</p>
            <p className="text-navy-300 text-xs mt-0.5 leading-none">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {NAV.map((group) => (
          <div key={group.group}>
            {!collapsed && (
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-navy-500 px-3 mb-2">
                {group.group}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(({ path, label, icon: Icon, badge }) => {
                const isActive = pathname.startsWith(path);
                const count = badge ? (unread[badge] ?? 0) : 0;

                return (
                  <NavLink
                    key={path}
                    to={path}
                    className={`sidebar-item ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
                    title={collapsed ? label : undefined}
                  >
                    <Icon size={17} className="shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate text-sm">{label}</span>
                        {count > 0 && (
                          <span className="text-[10px] font-bold bg-crimson-500 text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                            {count > 99 ? '99+' : count}
                          </span>
                        )}
                        {isActive && <ChevronRight size={13} className="opacity-60" />}
                      </>
                    )}
                    {/* Dot for collapsed + unread */}
                    {collapsed && count > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-crimson-500" />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-navy-800 px-3 py-3 shrink-0">
        <div
          className={`sidebar-item sidebar-item-inactive cursor-pointer`}
          onClick={onToggle}
          title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
        >
          <ChevronRight
            size={17}
            className={`shrink-0 transition-transform ${collapsed ? '' : 'rotate-180'}`}
          />
          {!collapsed && <span className="text-sm">Ciutkan</span>}
        </div>
      </div>
    </aside>
  );
}
