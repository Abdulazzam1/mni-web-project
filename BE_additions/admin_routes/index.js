/**
 * Admin API Routes
 * Mount di: /api/admin
 * Semua route di sini dilindungi JWT middleware
 */
const router = require('express').Router();
const auth   = require('../middleware/auth');

// Apply auth to all admin routes
router.use(auth);

// Dashboard
router.use('/dashboard', require('./admin/dashboard'));

// Resource routes
router.use('/products',     require('./admin/products'));
router.use('/services',     require('./admin/services'));
router.use('/portfolio',    require('./admin/portfolio'));
router.use('/news',         require('./admin/news'));
router.use('/testimonials', require('./admin/testimonials'));
router.use('/rfq',          require('./admin/rfq'));
router.use('/contact',      require('./admin/contact'));
router.use('/upload',       require('./admin/upload'));

module.exports = router;
