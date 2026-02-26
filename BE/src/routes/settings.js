const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const upload = require('../middleware/upload'); // Gunakan middleware upload yang sudah ada

router.get('/', settingsController.getSettings);
// Tambahkan upload.single('about_image') untuk menangani file dari CMS
router.put('/', upload.single('about_image'), settingsController.updateSettings);

module.exports = router;