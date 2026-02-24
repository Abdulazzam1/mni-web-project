const router = require('express').Router();
const { query } = require('../../config/db');
const { paginate, sendSuccess } = require('../../utils/helpers');

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);
    const { filter, search } = req.query;
    let conds = [], params = [];
    if (filter === 'unread')    { conds.push('is_read = false AND is_processed = false'); }
    if (filter === 'processed') { conds.push('is_processed = true'); }
    if (search) { conds.push(`(company_name ILIKE $${params.length+1} OR contact_name ILIKE $${params.length+1})`); params.push(`%${search}%`); }
    const where = conds.length ? 'WHERE ' + conds.join(' AND ') : '';
    const [d,c] = await Promise.all([
      query(`SELECT * FROM rfq_submissions ${where} ORDER BY created_at DESC LIMIT $${params.length+1} OFFSET $${params.length+2}`, [...params,limit,offset]),
      query(`SELECT COUNT(*) FROM rfq_submissions ${where}`, params),
    ]);
    sendSuccess(res, { items: d.rows, total: parseInt(c.rows[0].count), page, limit });
  } catch(err) { next(err); }
});

router.patch('/:id/read', async (req, res, next) => {
  try {
    await query('UPDATE rfq_submissions SET is_read=true WHERE id=$1', [req.params.id]);
    sendSuccess(res, null, 'Ditandai sudah dibaca.');
  } catch(err) { next(err); }
});

router.patch('/:id/processed', async (req, res, next) => {
  try {
    await query('UPDATE rfq_submissions SET is_processed=true, is_read=true WHERE id=$1', [req.params.id]);
    sendSuccess(res, null, 'RFQ ditandai sudah diproses.');
  } catch(err) { next(err); }
});

module.exports = router;
