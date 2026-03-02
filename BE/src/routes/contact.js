const router = require('express').Router();
const { submit } = require('../controllers/Contactcontroller');

router.post('/', submit);

module.exports = router;
