import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// Request: sertakan token jika ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mni_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response: tangani 401 → auto logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mni_token');
      localStorage.removeItem('mni_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
