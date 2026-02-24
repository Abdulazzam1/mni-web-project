export const formatDate = (d) =>
  d ? new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(d)) : '-';

export const formatDateShort = (d) =>
  d ? new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(d)) : '-';

export const formatDateTime = (d) =>
  d ? new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(d)) : '-';

export const truncate = (str, n = 60) =>
  str?.length > n ? str.slice(0, n) + '…' : str ?? '-';

export const imgUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_URL?.replace('/api', '') || ''}/uploads/${path}`;
};
