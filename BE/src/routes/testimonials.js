const router = require('express').Router();
const { getAll } = require('../controllers/Testimonialcontroller');

router.get('/', getAll);

module.exports = router;
