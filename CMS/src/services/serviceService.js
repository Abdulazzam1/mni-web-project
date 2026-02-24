import api from './api';

export const getAll  = (params) => api.get('/admin/services', { params });
export const getOne  = (id)     => api.get(`/admin/services/${id}`);
export const create  = (data)   => api.post('/admin/services', data);
export const update  = (id, d)  => api.put(`/admin/services/${id}`, d);
export const remove  = (id)     => api.delete(`/admin/services/${id}`);
