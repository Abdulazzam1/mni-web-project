import axios from 'axios';

const api = axios.create({
  // Paksa ke port 5001 agar sinkron dengan BE MNI
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
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
    // Tambahkan pengecekan agar tidak loop redirect saat testing
    if (err.response?.status === 401 && !window.location.href.includes('/login')) {
      localStorage.removeItem('mni_token');
      localStorage.removeItem('mni_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;