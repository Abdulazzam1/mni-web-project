const router = require('express').Router();
const { submit } = require('../controllers/rfqController');

router.post('/', submit);

module.exports = router;
