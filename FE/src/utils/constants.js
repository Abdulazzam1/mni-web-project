export const COMPANY = {
  name: 'PT. Mitra Niaga Indonesia',
  shortName: 'MNI',
  tagline: 'Solusi Terpadu VAC, Mekanikal & Elektrikal',
  address: import.meta.env.VITE_ADDRESS || 'Jl. Contoh No. 123, Jakarta Selatan',
  phone: {
    sales: import.meta.env.VITE_PHONE_SALES || '(021) 1234-5678',
    service: import.meta.env.VITE_PHONE_SERVICE || '(021) 8765-4321',
  },
  email: import.meta.env.VITE_EMAIL || 'info@mitraniagaindonesia.co.id',
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '6281234567890',
  website: 'www.mitraniagaindonesia.co.id',
  social: {
    instagram: 'https://instagram.com/mitraniagaindonesia',
    linkedin: 'https://linkedin.com/company/mitraniagaindonesia',
    facebook: 'https://facebook.com/mitraniagaindonesia',
  },
};

export const PRODUCT_CATEGORIES = [
  { value: 'all', label: 'Semua Produk' },
  { value: 'ac', label: 'Air Conditioning' },
  { value: 'genset', label: 'Genset' },
  { value: 'lampu_led', label: 'Lampu LED' },
  { value: 'elektrikal', label: 'Elektrikal' },
  { value: 'lainnya', label: 'Lainnya' },
];

export const NAV_LINKS = [
  { label: 'Beranda', path: '/' },
  { label: 'Tentang Kami', path: '/tentang-kami' },
  { label: 'Produk', path: '/produk' },
  { label: 'Layanan', path: '/layanan' },
  { label: 'Informasi', path: '/informasi' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Kontak', path: '/kontak' },
];