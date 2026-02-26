import api from './api';

export const getNews = (params = {}) => api.get('/news', { params });

// FIX: Gunakan backtick (`) dan masukkan variabel ${slug} ke dalam URL
export const getNewsBySlug = (slug) => api.get(`/news/${slug}`);