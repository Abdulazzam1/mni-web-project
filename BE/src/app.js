const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middleware/errorHandler');
const productRoutes = require('./routes/products');
// ─── IMPORT RUTE BARU (KATEGORI) ─────────────────────────────
const categoryRoutes = require('./routes/categories');
// ─────────────────────────────────────────────────────────────
const serviceRoutes = require('./routes/services');
const portfolioRoutes = require('./routes/portfolio');
const newsRoutes = require('./routes/news');
const contactRoutes = require('./routes/contact');
const rfqRoutes = require('./routes/rfq');
const testimonialRoutes = require('./routes/testimonials');

// ─── IMPORT RUTE BARU (BANNER) ───────────────────────────────
const bannerRoutes = require('./routes/banner');
// ─────────────────────────────────────────────────────────────

// ─── IMPORT RUTE ADMIN & AUTH BARU ───────────────────────────
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/index');
const settingsRoutes = require('./routes/settings');
// ─────────────────────────────────────────────────────────────

const app = express();

// ─── Security & Parsing ──────────────────────────────────────
app.use(helmet({
  // Penting: Izinkan resource agar gambar bisa tampil di frontend (cross-origin)
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ─── CORS UPDATE UNTUK CMS & FE (Dinamis & Preflight Fix) ────
app.use(cors({
  origin: function (origin, callback) {
    // 1. Izinkan Postman (tanpa origin) atau localhost (FE/CMS lokal)
    if (!origin || origin.startsWith('http://localhost')) {
      return callback(null, true);
    }
    
    // 2. Izinkan semua subdomain dari domain produksi (termasuk cms.)
    if (origin.includes('myrasindo.com') || origin.includes('mitraniagaindonesia.co.id')) {
      return callback(null, true);
    }

    // 3. Izinkan custom env jika ada
    if (process.env.CORS_ORIGIN && origin === process.env.CORS_ORIGIN) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // OPTIONS wajib ada untuk preflight check browser
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Wajib diaktifkan jika menggunakan token/header authorization
  optionsSuccessStatus: 200 // Membantu browser merespons preflight dengan status 200 OK
}));
// ─────────────────────────────────────────────────────────────

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── FIX AKAR MASALAH: Static Files (Global Uploads) ──────────
// Kita kembalikan ke folder induk 'uploads' agar semua gambar (Produk, Portfolio, dll) terbaca lagi
const uploadsPath = path.resolve(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Log untuk memastikan lokasi fisik folder saat server dijalankan
console.log('Static images served from:', uploadsPath);
// ─────────────────────────────────────────────────────────────

// ─── Rate Limiting (REVISI 3: DILONGGARKAN AGAR CMS STABIL) ──
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  // Menggunakan env variable jika ada, jika tidak default ke 1000 (Standar CMS Enterprise)
  max: parseInt(process.env.API_RATE_LIMIT, 10) || 1000, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Terlalu banyak request, coba lagi nanti.' },
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  // Dinaikkan menjadi 30 agar proses testing RFQ/Kontak oleh admin tidak mudah terblokir
  max: parseInt(process.env.CONTACT_RATE_LIMIT, 10) || 30, 
  message: { success: false, message: 'Terlalu banyak pengiriman form, coba lagi dalam 1 jam.' },
});
// ─────────────────────────────────────────────────────────────

// ─── Routes ──────────────────────────────────────────────────
app.use('/api', apiLimiter);
app.use('/api/products', productRoutes);
// ─── MOUNT RUTE KATEGORI ─────────────────────────────────────
app.use('/api/categories', categoryRoutes);
// ─────────────────────────────────────────────────────────────
app.use('/api/services', serviceRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/testimonials', testimonialRoutes);

// ─── MOUNT RUTE BANNER (Masuk ke dalam apiLimiter) ───────────
app.use('/api/banner', bannerRoutes);
// ─────────────────────────────────────────────────────────────
app.use('/api/settings', settingsRoutes);
app.use('/api/contact', contactLimiter, contactRoutes);
app.use('/api/rfq', contactLimiter, rfqRoutes);

// ─── MOUNT RUTE ADMIN & AUTH BARU ────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
// ─────────────────────────────────────────────────────────────

// ─── Health Check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'MNI API is running', timestamp: new Date().toISOString() });
});

// ─── 404 ──────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan.' });
});

// ─── Error Handler ────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;