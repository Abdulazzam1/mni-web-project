const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const upload = require('../middleware/upload');
// Rute Admin: Pastikan upload.single('image') ada di tengah-tengah
router.post('/', upload.single('image'), bannerController.createBanner);

// Rute lainnya tetap sama
router.get('/', bannerController.getAllBanners);
router.get('/active', bannerController.getActiveBanners);
router.put('/:id', upload.single('image'), bannerController.updateBanner);
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;