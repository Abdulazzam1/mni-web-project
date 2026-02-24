import api from './api';

export const getAll  = (params) => api.get('/admin/contact', { params });
export const markRead = (id)    => api.patch(`/admin/contact/${id}/read`);
