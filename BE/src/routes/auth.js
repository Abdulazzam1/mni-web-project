const router = require('express').Router();
const { login, me } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/login', login);
router.get('/me', auth, me);
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logout berhasil.' });
});

module.exports = router;
