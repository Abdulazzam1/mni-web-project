import api from './api';

export const getAll    = (params) => api.get('/admin/products', { params });
export const getOne    = (id)     => api.get(`/admin/products/${id}`);
export const create    = (data)   => api.post('/admin/products', data);
export const update    = (id, d)  => api.put(`/admin/products/${id}`, d);
export const remove    = (id)     => api.delete(`/admin/products/${id}`);
export const toggle    = (id)     => api.patch(`/admin/products/${id}/toggle`);
export const uploadImg = (id, f)  => {
  const fd = new FormData(); fd.append('image', f);
  return api.post(`/admin/products/${id}/images`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
