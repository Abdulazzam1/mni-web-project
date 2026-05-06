// FE/src/services/newsService.js
// REVISI TAHAP 6: Tambah getHomeNews() untuk fetch artikel
// yang ditandai "Tampilkan di Beranda" (show_on_home=true).

import api from './api';

// Semua artikel publik (dengan opsional filter category, dll)
export const getNews      = (params = {}) => api.get('/news', { params });

// Artikel berdasarkan slug/id
export const getNewsBySlug = (slug) => api.get(`/news/${slug}`);

// TAHAP 6: Hanya artikel bertanda "Tampilkan di Beranda"
// Batasi 4 item agar section homepage tidak terlalu panjang
export const getHomeNews  = () =>
  api.get('/news', { params: { show_on_home: true, limit: 4 } });