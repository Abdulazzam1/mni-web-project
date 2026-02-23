import api from './api';
export const getProducts = (params = {}) => api.get('/products', { params });
export const getProductBySlug = (slug) => api.get(/products/);
