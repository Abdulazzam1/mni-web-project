// settingsService.js
import api from './api';

export const getSettings = () => api.get('/settings');

export const updateSettings = (data) => api.put('/settings', data, {
  headers: {
    'Content-Type': 'multipart/form-data', // Memastikan backend (multer) bisa membaca file
  },
});