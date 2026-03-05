const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET /api/categories (Semua kategori untuk dropdown CMS & filter default)
router.get('/', categoryController.getAllCategories);

// ─── FITUR BARU: GET /api/categories/popular (Top 4 kategori untuk UI Publik & Testing) ───
router.get('/popular', categoryController.getPopularCategories);
// ──────────────────────────────────────────────────────────────────────────────────────────

module.exports = router;