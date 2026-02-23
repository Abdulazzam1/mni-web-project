const router = require('express').Router();
const { getAll } = require('../controllers/testimonialController');

router.get('/', getAll);

module.exports = router;
