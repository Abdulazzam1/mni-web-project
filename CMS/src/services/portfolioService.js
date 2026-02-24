import api from './api';

export const getAll  = (params) => api.get('/admin/portfolio', { params });
export const getOne  = (id)     => api.get(`/admin/portfolio/${id}`);
export const create  = (data)   => api.post('/admin/portfolio', data);
export const update  = (id, d)  => api.put(`/admin/portfolio/${id}`, d);
export const remove  = (id)     => api.delete(`/admin/portfolio/${id}`);
