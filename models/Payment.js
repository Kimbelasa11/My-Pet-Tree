const { run, get, all } = require('../database/connection');

const Payment = {
  getAll() {
    return all(`SELECT p.*, s.sponsor_name, s.sponsor_email FROM payments p LEFT JOIN sponsorships s ON s.id = p.sponsorship_id ORDER BY p.created_at DESC`);
  },

  getById(id) {
    return get(`SELECT p.*, s.sponsor_name, s.sponsor_email FROM payments p LEFT JOIN sponsorships s ON s.id = p.sponsorship_id WHERE p.id = ?`, [id]);
  },

  create(data) {
    return run('INSERT INTO payments (sponsorship_id, amount, currency, gateway, gateway_reference, status, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [data.sponsorship_id || null, data.amount, data.currency || 'PHP', data.gateway || 'mock', data.gateway_reference || null, data.status || 'pending', data.metadata ? JSON.stringify(data.metadata) : null]);
  },

  updateStatus(id, status, gatewayReference) {
    const fields = ["status = ?"]; const values = [status];
    if (gatewayReference) { fields.push("gateway_reference = ?"); values.push(gatewayReference); }
    fields.push("updated_at = datetime('now')"); values.push(id);
    return run(`UPDATE payments SET ${fields.join(', ')} WHERE id = ?`, values);
  },

  totalByGateway() {
    return all("SELECT gateway, COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'completed' GROUP BY gateway");
  },
};

module.exports = Payment;
