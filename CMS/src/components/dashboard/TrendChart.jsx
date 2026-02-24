import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { PageSpinner } from '@/components/ui/index';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-surface-border rounded-lg shadow-lg px-4 py-3 text-xs">
      <p className="font-display font-semibold text-obsidian-700 mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: p.fill }} />
          <span className="text-obsidian-500">{p.name}:</span>
          <span className="font-semibold text-obsidian-700">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function TrendChart({ data, loading }) {
  if (loading) return <PageSpinner />;
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-obsidian-400">
        Belum ada data tren.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E6ED" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#8A9BB0', fontFamily: 'DM Sans' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#8A9BB0', fontFamily: 'DM Sans' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F4F8' }} />
        <Legend
          wrapperStyle={{ fontSize: '12px', fontFamily: 'Syne, sans-serif', paddingTop: '12px' }}
          iconType="square"
          iconSize={10}
        />
        <Bar dataKey="rfq"   name="RFQ"   fill="#E8A020" radius={[4, 4, 0, 0]} maxBarSize={32} />
        <Bar dataKey="pesan" name="Pesan" fill="#1E3570" radius={[4, 4, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}
