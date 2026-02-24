import api from './api';

/**
 * Upload gambar tunggal, kembalikan path relatif dari server.
 * @param {File} file
 * @param {string} folder - subfolder (products, portfolio, news, dll)
 */
export const uploadImage = async (file, folder = 'misc') => {
  const fd = new FormData();
  fd.append('image', file);
  fd.append('folder', folder);
  const res = await api.post('/admin/upload', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data; // { url, path }
};
