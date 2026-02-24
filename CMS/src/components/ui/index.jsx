// ─── Spinner ──────────────────────────────────────────────────
export function Spinner({ size = 'md', className = '' }) {
  const s = { sm: 'w-4 h-4 border-2', md: 'w-7 h-7 border-2', lg: 'w-10 h-10 border-3' }[size];
  return (
    <div
      className={`${s} border-navy-200 border-t-amber-500 rounded-full animate-spin ${className}`}
    />
  );
}

export function PageSpinner() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[300px]">
      <Spinner size="lg" />
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────
const badgeVariants = {
  published: 'badge-green',
  draft:     'badge-gray',
  unread:    'badge-amber',
  processed: 'badge-navy',
  active:    'badge-green',
  inactive:  'badge-gray',
  ac:        'badge-navy',
  genset:    'badge-amber',
  berita:    'badge-navy',
  aktivitas: 'badge-green',
  csr:       'badge-amber',
};

export function Badge({ label, variant }) {
  const cls = badgeVariants[variant] || badgeVariants[label?.toLowerCase()] || 'badge-gray';
  return <span className={`badge ${cls}`}>{label}</span>;
}

// ─── Empty State ──────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center mb-4 border border-surface-border">
          <Icon size={26} className="text-obsidian-300" />
        </div>
      )}
      <h3 className="font-display font-semibold text-obsidian-700 text-base mb-1">{title}</h3>
      {desc && <p className="text-sm text-obsidian-400 max-w-xs leading-relaxed">{desc}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────
export function Pagination({ page, total, limit, onChange }) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end   = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-surface-border">
      <p className="text-xs text-obsidian-400">
        Menampilkan <span className="font-semibold">{start}–{end}</span> dari{' '}
        <span className="font-semibold">{total}</span> data
      </p>
      <div className="flex gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="btn btn-ghost btn-sm disabled:opacity-40"
        >
          ‹ Prev
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`btn btn-sm ${page === p ? 'btn-navy' : 'btn-ghost'}`}
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="btn btn-ghost btn-sm disabled:opacity-40"
        >
          Next ›
        </button>
      </div>
    </div>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────
export function Toggle({ checked, onChange, label, disabled = false }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`toggle ${checked ? 'toggle-on' : 'toggle-off'} disabled:opacity-50`}
      >
        <span
          className={`toggle-thumb ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
      {label && <span className="text-sm text-obsidian-600">{label}</span>}
    </label>
  );
}

// ─── Search Input ─────────────────────────────────────────────
import { Search } from 'lucide-react';

export function SearchInput({ value, onChange, placeholder = 'Cari...' }) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-9 w-60 text-sm"
      />
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────
export function SectionHeader({ title, subtitle, actions }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
