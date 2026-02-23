/**
 * Format tanggal Indonesia
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(dateStr));
};

/**
 * Truncate text
 */
export const truncate = (str, n = 120) =>
  str?.length > n ? str.slice(0, n).trim() + '...' : str;

/**
 * Get image URL (handles relative paths from BE)
 */
export const imgUrl = (path) => {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_URL?.replace('/api', '') || ''}/uploads/${path}`;
};

/**
 * WhatsApp chat URL
 */
export const waUrl = (phone, msg = '') =>
  `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;