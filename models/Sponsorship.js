const { run, get, all } = require('../database/connection');

const Sponsorship = {
  getAll() {
    return all(`SELECT s.*, ts.name as tree_species_name FROM sponsorships s LEFT JOIN tree_species ts ON ts.id = s.tree_species_id ORDER BY s.created_at DESC`);
  },

  getById(id) {
    return get(`SELECT s.*, ts.name as tree_species_name, ts.scientific_name FROM sponsorships s LEFT JOIN tree_species ts ON ts.id = s.tree_species_id WHERE s.id = ?`, [id]);
  },

  create(data) {
    return run('INSERT INTO sponsorships (sponsor_name, sponsor_email, sponsor_phone, tree_species_id, quantity, amount, currency, message, is_anonymous, status, payment_reference) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [data.sponsor_name, data.sponsor_email, data.sponsor_phone || null, data.tree_species_id || null, data.quantity || 1, data.amount, data.currency || 'PHP', data.message || null, data.is_anonymous ? 1 : 0, data.status || 'pending', data.payment_reference || null]);
  },

  updateStatus(id, status) {
    return run("UPDATE sponsorships SET status = ?, updated_at = datetime('now') WHERE id = ?", [status, id]);
  },

  count() { return get('SELECT COUNT(*) as count FROM sponsorships').count; },

  totalAmount(status) {
    const row = status
      ? get('SELECT COALESCE(SUM(amount), 0) as total FROM sponsorships WHERE status = ?', [status])
      : get('SELECT COALESCE(SUM(amount), 0) as total FROM sponsorships');
    return row.total;
  },
};

module.exports = Sponsorship;
