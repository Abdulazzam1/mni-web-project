const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

// Endpoint publik untuk Frontend Publik & CMS
router.get('/', settingsController.getSettings);

// Endpoint update untuk CMS
router.put('/', settingsController.updateSettings);

module.exports = router;