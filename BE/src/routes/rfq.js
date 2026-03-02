const router = require('express').Router();
const { submit } = require('../controllers/Rfqcontroller');

router.post('/', submit);

module.exports = router;
