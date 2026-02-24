import { Pagination } from './index';

/**
 * Komponen tabel yang reusable.
 * @prop {Array}  columns - [{ key, label, render?, align? }]
 * @prop {Array}  data
 * @prop {boolean} loading
 * @prop {number}  total, page, limit
 * @prop {Function} onPageChange
 * @prop {ReactNode} empty
 */
export default function DataTable({
  columns,
  data = [],
  loading,
  total = 0,
  page = 1,
  limit = 10,
  onPageChange,
  emptyNode,
}) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={{ textAlign: col.align || 'left' }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              /* Skeleton rows */
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      <div className="skeleton h-4 w-full max-w-[160px] rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  {emptyNode || <span className="text-obsidian-400 text-sm">Tidak ada data.</span>}
                </td>
              </tr>
            ) : (
              data.map((row, ri) => (
                <tr key={row.id ?? ri}>
                  {columns.map((col) => (
                    <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                      {col.render ? col.render(row) : row[col.key] ?? '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {!loading && total > 0 && (
        <Pagination
          page={page}
          total={total}
          limit={limit}
          onChange={onPageChange}
        />
      )}
    </div>
  );
}
