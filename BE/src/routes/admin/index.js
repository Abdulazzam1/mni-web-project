/**
 * Admin API Routes
 * Mount di: /api/admin
 * Semua route di sini dilindungi JWT middleware
 */
const router = require('express').Router();
const auth   = require('../../middleware/auth');

// Apply auth to all admin routes
router.use(auth);

// Dashboard
router.use('/dashboard', require('./dashboard'));

// Resource routes
router.use('/products',     require('./products'));
// ─── FIX TAHAP 3: Mount Rute Manajemen Kategori Admin ────────
router.use('/categories',   require('./categories'));
// ─────────────────────────────────────────────────────────────
router.use('/services',     require('./services'));
router.use('/portfolio',    require('./portfolio'));
router.use('/news',         require('./news'));
router.use('/testimonials', require('./testimonials'));
router.use('/rfq',          require('./rfq'));
router.use('/contact',      require('./contact'));
router.use('/upload',       require('./upload'));

module.exports = router;