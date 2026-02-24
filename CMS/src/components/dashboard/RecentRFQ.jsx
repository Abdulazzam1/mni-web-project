import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/index';
import { formatDateShort } from '@/utils/formatters';
import { replyRFQ } from '@/utils/whatsapp';

export default function RecentRFQ({ data = [], loading }) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Perusahaan</th>
              <th>Kontak</th>
              <th>Produk</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j}><div className="skeleton h-4 w-full rounded" /></td>
                    ))}
                  </tr>
                ))
              : data.map((row) => (
                  <tr key={row.id}>
                    <td className="font-medium text-obsidian-800 max-w-[140px] truncate">
                      {row.company_name}
                    </td>
                    <td className="text-obsidian-500">{row.contact_name}</td>
                    <td className="max-w-[120px] truncate text-obsidian-500">
                      {row.product_interest}
                    </td>
                    <td className="text-obsidian-400 whitespace-nowrap">
                      {formatDateShort(row.created_at)}
                    </td>
                    <td>
                      <Badge
                        label={row.is_read ? 'Sudah Dibaca' : 'Belum Dibaca'}
                        variant={row.is_read ? 'processed' : 'unread'}
                      />
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => replyRFQ(row)}
                          className="btn btn-primary btn-sm"
                          title="Balas via WhatsApp"
                        >
                          <MessageSquare size={13} />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {!loading && (
        <div className="px-4 py-3 border-t border-surface-border flex justify-end">
          <button
            onClick={() => navigate('/rfq')}
            className="btn btn-ghost btn-sm text-navy-700"
          >
            Lihat semua RFQ <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
