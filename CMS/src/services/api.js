import axios from 'axios';

/**
 * ─── DYNAMIC BASE URL ─────────────────────────────────────────
 * 1. Lokal (npm run dev) : Menggunakan '/api' (Vite Proxy ke 5001/5005).
 * 2. VPS (Domain Utama) : Menggunakan '/api' (Nginx Proxy).
 * 3. VPS (Subdomain CMS): Menggunakan URL Absolut ke Domain Utama agar 
 * tidak terjadi 404 pada domain cms.
 * ──────────────────────────────────────────────────────────────
 */
const getBaseURL = () => {
  // Jika diakses via subdomain cms di VPS
  if (window.location.hostname.startsWith('cms.')) {
    return 'http://mitraniagaindonesia.myrasindo.com/api';
  }
  // Default menggunakan relative path (Lokal & Production Utama)
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── INTERCEPTORS (FITUR STABIL - JANGAN DIUBAH) ──────────────

// Request: Sertakan token mni_token dari localStorage jika tersedia
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mni_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response: Tangani auto-logout jika token expired (401)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Jika 401 Unauthorized dan bukan di halaman login, paksa logout
    if (err.response?.status === 401 && !window.location.href.includes('/login')) {
      localStorage.removeItem('mni_token');
      localStorage.removeItem('mni_user');
      
      // Menggunakan replace agar tidak bisa "back" ke halaman terproteksi
      window.location.replace('/#/login'); 
    }
    return Promise.reject(err);
  }
);

export default api;