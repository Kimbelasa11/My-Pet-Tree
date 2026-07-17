const { run, get, all } = require('../database/connection');

const FAQ = {
  getAll(includeInactive = false) {
    const where = includeInactive ? '' : 'WHERE is_active = 1';
    return all(`SELECT * FROM faqs ${where} ORDER BY sort_order ASC, created_at DESC`);
  },

  getById(id) { return get('SELECT * FROM faqs WHERE id = ?', [id]); },

  create(data) {
    return run('INSERT INTO faqs (question, answer, category, sort_order, is_active) VALUES (?, ?, ?, ?, ?)',
      [data.question, data.answer, data.category || null, data.sort_order || 0, data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1]);
  },

  update(id, data) {
    const existing = this.getById(id);
    if (!existing) return null;
    const fields = []; const values = [];
    for (const key of ['question', 'answer', 'category']) {
      if (data[key] !== undefined) { fields.push(`${key} = ?`); values.push(data[key] || null); }
    }
    if (data.sort_order !== undefined) { fields.push('sort_order = ?'); values.push(data.sort_order); }
    if (data.is_active !== undefined) { fields.push('is_active = ?'); values.push(data.is_active ? 1 : 0); }
    if (fields.length === 0) return existing;
    fields.push("updated_at = datetime('now')"); values.push(id);
    return run(`UPDATE faqs SET ${fields.join(', ')} WHERE id = ?`, values);
  },

  delete(id) { return run('DELETE FROM faqs WHERE id = ?', [id]); },

  count() { return get('SELECT COUNT(*) as count FROM faqs WHERE is_active = 1').count; },
};

module.exports = FAQ;
