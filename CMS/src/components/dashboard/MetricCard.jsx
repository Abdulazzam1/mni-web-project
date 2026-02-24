import { TrendingUp } from 'lucide-react';

export default function MetricCard({ title, value, icon: Icon, color, loading, sub }) {
  const colorMap = {
    amber:   { bg: 'bg-amber-50',   icon: 'bg-amber-100  text-amber-600',  val: 'text-amber-600'  },
    navy:    { bg: 'bg-navy-50',    icon: 'bg-navy-100   text-navy-700',   val: 'text-navy-800'   },
    green:   { bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', val: 'text-emerald-700' },
    crimson: { bg: 'bg-crimson-50', icon: 'bg-crimson-100 text-crimson-600', val: 'text-crimson-600' },
  };
  const c = colorMap[color] || colorMap.navy;

  return (
    <div className={`card p-5 ${c.bg} border-0`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.icon}`}>
          <Icon size={20} />
        </div>
      </div>
      {loading ? (
        <div className="skeleton h-8 w-20 rounded mb-1.5" />
      ) : (
        <p className={`text-3xl font-display font-bold ${c.val} leading-none`}>{value ?? '-'}</p>
      )}
      <p className="text-sm text-obsidian-500 mt-1.5 font-medium">{title}</p>
      {sub && <p className="text-xs text-obsidian-400 mt-0.5">{sub}</p>}
    </div>
  );
}
