const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const upload = require('../middleware/upload');

router.get('/', settingsController.getSettings);

// Kembali menggunakan upload.single karena PDF sudah tidak diunggah ke server
router.put('/', upload.single('about_image'), settingsController.updateSettings);

module.exports = router;