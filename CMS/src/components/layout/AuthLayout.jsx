import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-navy-950">
      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-navy-900 px-12 py-10 relative overflow-hidden">
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Amber glow */}
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
            <span className="font-display font-black text-navy-900 text-base">MNI</span>
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm leading-none">Mitra Niaga Indonesia</p>
            <p className="text-navy-400 text-xs mt-0.5">Admin Panel</p>
          </div>
        </div>

        {/* Quote */}
        <div className="relative z-10">
          <p className="text-3xl font-display font-bold text-white leading-tight mb-4">
            Kelola konten,<br />
            <span className="text-gradient-gold">pantau prospek,</span><br />
            dan tingkatkan bisnis.
          </p>
          <p className="text-navy-400 text-sm leading-relaxed max-w-xs">
            Panel administrasi terpadu untuk PT. Mitra Niaga Indonesia.
            Produk, layanan, portfolio, dan inbox semua dalam satu tempat.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-6 relative z-10">
          {[
            { num: '500+', label: 'Produk' },
            { num: '200+', label: 'Klien' },
            { num: '24/7', label: 'Support' },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display font-bold text-amber-400 text-xl">{s.num}</p>
              <p className="text-navy-400 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-surface">
        <Outlet />
      </div>
    </div>
  );
}
