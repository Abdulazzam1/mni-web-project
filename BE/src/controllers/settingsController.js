const { query } = require('../config/db');

const settingsController = {
  // GET: Ambil data pengaturan (Hanya akan mengembalikan baris id = 1)
  getSettings: async (req, res) => {
    try {
      const result = await query('SELECT * FROM company_settings WHERE id = 1');
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Data pengaturan belum diinisialisasi.' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching settings:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // PUT: Update data pengaturan
  updateSettings: async (req, res) => {
    try {
      const {
        about_title, about_description, vision, mission,
        stats_projects, stats_clients, stats_years, stats_support,
        contact_sales, contact_service, contact_email, contact_address, operational_hours,
        social_instagram, social_linkedin, social_facebook
      } = req.body;

      const result = await query(
        `UPDATE company_settings SET 
          about_title = $1, about_description = $2, vision = $3, mission = $4,
          stats_projects = $5, stats_clients = $6, stats_years = $7, stats_support = $8,
          contact_sales = $9, contact_service = $10, contact_email = $11, contact_address = $12, 
          operational_hours = $13, social_instagram = $14, social_linkedin = $15, social_facebook = $16,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = 1 RETURNING *`,
        [
          about_title, about_description, vision, mission,
          stats_projects, stats_clients, stats_years, stats_support,
          contact_sales, contact_service, contact_email, contact_address, operational_hours,
          social_instagram, social_linkedin, social_facebook
        ]
      );

      res.json({ success: true, message: 'Pengaturan berhasil diperbarui.', data: result.rows[0] });
    } catch (err) {
      console.error('Error updating settings:', err);
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = settingsController;