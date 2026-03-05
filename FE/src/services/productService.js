import api from './api';

export const getProducts = (params = {}) => api.get('/products', { params });

// FIX: Pastikan URL menggunakan backtick (`) dan menyisipkan ${slug}
export const getProductBySlug = (slug) => api.get(`/products/${slug}`);

// ─── FIX TAHAP 4: Fungsi untuk mengambil daftar kategori dinamis ───
export const getCategories = () => api.get('/categories');
// ───────────────────────────────────────────────────────────────────

// ─── FITUR BARU: Fungsi untuk mengambil TOP 4 kategori (Untuk UI Publik & Testing) ───
export const getPopularCategories = () => api.get('/categories/popular');
// ─────────────────────────────────────────────────────────────────────────────────────