const { query }  = require('../../config/db');
const { sendSuccess } = require('../../utils/helpers');
const router = require('express').Router();

// GET /api/admin/dashboard/metrics
router.get('/metrics', async (req, res, next) => {
  try {
    const [
      rfq_unread, contact_unread,
      products_active, products_total,
      news_published, news_total,
      services_total, portfolio_total,
      testimonials_total, rfq_total,
    ] = await Promise.all([
      query("SELECT COUNT(*) FROM rfq_submissions WHERE is_read = false"),
      query("SELECT COUNT(*) FROM contact_submissions WHERE is_read = false"),
      query("SELECT COUNT(*) FROM products WHERE is_active = true"),
      query("SELECT COUNT(*) FROM products"),
      query("SELECT COUNT(*) FROM news WHERE is_published = true"),
      query("SELECT COUNT(*) FROM news"),
      query("SELECT COUNT(*) FROM services WHERE is_active = true"),
      query("SELECT COUNT(*) FROM portfolios WHERE is_active = true"),
      query("SELECT COUNT(*) FROM testimonials WHERE is_active = true"),
      query("SELECT COUNT(*) FROM rfq_submissions"),
    ]);

    sendSuccess(res, {
      rfq_unread:        parseInt(rfq_unread.rows[0].count),
      contact_unread:    parseInt(contact_unread.rows[0].count),
      products_active:   parseInt(products_active.rows[0].count),
      products_total:    parseInt(products_total.rows[0].count),
      news_published:    parseInt(news_published.rows[0].count),
      news_total:        parseInt(news_total.rows[0].count),
      services_total:    parseInt(services_total.rows[0].count),
      portfolio_total:   parseInt(portfolio_total.rows[0].count),
      testimonials_total:parseInt(testimonials_total.rows[0].count),
      rfq_total:         parseInt(rfq_total.rows[0].count),
    });
  } catch (err) { next(err); }
});

// GET /api/admin/dashboard/trend  — data 30 hari terakhir
router.get('/trend', async (req, res, next) => {
  try {
    const rfqTrend = await query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM rfq_submissions
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at) ORDER BY date
    `);

    const contactTrend = await query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM contact_submissions
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at) ORDER BY date
    `);

    // Merge menjadi array [{date, rfq, pesan}]
    const map = {};
    rfqTrend.rows.forEach((r) => {
      const d = r.date.toISOString().slice(0, 10);
      if (!map[d]) map[d] = { date: d, rfq: 0, pesan: 0 };
      map[d].rfq = parseInt(r.count);
    });
    contactTrend.rows.forEach((r) => {
      const d = r.date.toISOString().slice(0, 10);
      if (!map[d]) map[d] = { date: d, rfq: 0, pesan: 0 };
      map[d].pesan = parseInt(r.count);
    });

    const data = Object.values(map)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((item) => ({
        ...item,
        date: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' })
              .format(new Date(item.date)),
      }));

    sendSuccess(res, data);
  } catch (err) { next(err); }
});

// GET /api/admin/dashboard/recent-rfq
router.get('/recent-rfq', async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, company_name, contact_name, email, phone, product_interest, is_read, created_at
       FROM rfq_submissions ORDER BY created_at DESC LIMIT 5`
    );
    sendSuccess(res, result.rows);
  } catch (err) { next(err); }
});

module.exports = router;
