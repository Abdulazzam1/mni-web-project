const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/categoryController');

// Rute POST, PUT, DELETE (Aman karena sudah di-protect middleware auth di index.js)
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;