import api from './api';

export const getAll  = (params) => api.get('/admin/rfq', { params });
export const markRead      = (id) => api.patch(`/admin/rfq/${id}/read`);
export const markProcessed = (id) => api.patch(`/admin/rfq/${id}/processed`);
