import api from './api';

export const getAll  = (params) => api.get('/admin/testimonials', { params });
export const create  = (data)   => api.post('/admin/testimonials', data);
export const update  = (id, d)  => api.put(`/admin/testimonials/${id}`, d);
export const remove  = (id)     => api.delete(`/admin/testimonials/${id}`);
