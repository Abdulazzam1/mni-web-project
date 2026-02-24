const router  = require('express').Router();
const upload  = require('../../middleware/upload');
const path    = require('path');
const { sendSuccess, sendError } = require('../../utils/helpers');

router.post('/', (req, res, next) => {
  const folder = req.body?.folder || 'misc';
  req.uploadSubdir = folder;

  upload.single('image')(req, res, (err) => {
    if (err) return sendError(res, err.message, 400);
    if (!req.file) return sendError(res, 'File tidak ditemukan.', 400);

    const relativePath = `${folder}/${req.file.filename}`;
    const url = `${req.protocol}://${req.get('host')}/uploads/${relativePath}`;

    sendSuccess(res, { path: relativePath, url }, 'Upload berhasil.');
  });
});

module.exports = router;
