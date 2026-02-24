import api from './api';

export const getAll  = (params) => api.get('/admin/news', { params });
export const getOne  = (id)     => api.get(`/admin/news/${id}`);
export const create  = (data)   => api.post('/admin/news', data);
export const update  = (id, d)  => api.put(`/admin/news/${id}`, d);
export const remove  = (id)     => api.delete(`/admin/news/${id}`);
export const toggle  = (id)     => api.patch(`/admin/news/${id}/toggle`);
