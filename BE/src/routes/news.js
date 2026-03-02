const router = require('express').Router();
const ctrl = require('../controllers/Newscontroller');

router.get('/', ctrl.getAll);
router.get('/:slug', ctrl.getBySlug);
router.post('/', ctrl.create);

module.exports = router;
