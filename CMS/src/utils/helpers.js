export const slugify = (str) =>
  str.toLowerCase()
    .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').replace(/-+/g, '-');

export const getErrorMsg = (err) =>
  err?.response?.data?.message || err?.message || 'Terjadi kesalahan.';

export const PRODUCT_CATEGORIES = [
  { value: 'ac',        label: 'Air Conditioning' },
  { value: 'genset',    label: 'Genset' },
  { value: 'lampu_led', label: 'Lampu LED' },
  { value: 'elektrikal',label: 'Elektrikal' },
  { value: 'lainnya',   label: 'Lainnya' },
];

export const NEWS_CATEGORIES = [
  { value: 'berita',    label: 'Berita' },
  { value: 'aktivitas', label: 'Aktivitas' },
  { value: 'csr',       label: 'CSR' },
];
