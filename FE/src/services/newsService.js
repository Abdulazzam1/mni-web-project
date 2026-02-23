import api from './api';
export const getNews = (params = {}) => api.get('/news', { params });
export const getNewsBySlug = (slug) => api.get(/news/);
