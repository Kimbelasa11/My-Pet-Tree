const { run, get, all } = require('../database/connection');

const ContactMessage = {
  getAll() { return all('SELECT * FROM contact_messages ORDER BY created_at DESC'); },

  getById(id) { return get('SELECT * FROM contact_messages WHERE id = ?', [id]); },

  create(data) {
    return run('INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [data.name, data.email, data.phone || null, data.subject || null, data.message]);
  },

  markRead(id) { return run('UPDATE contact_messages SET is_read = 1 WHERE id = ?', [id]); },

  update(id, data) {
    const existing = this.getById(id);
    if (!existing) return null;
    const fields = []; const values = [];
    for (const key of ['name', 'email', 'phone', 'subject', 'message']) {
      if (data[key] !== undefined) { fields.push(`${key} = ?`); values.push(data[key]); }
    }
    if (data.is_read !== undefined) { fields.push('is_read = ?'); values.push(data.is_read ? 1 : 0); }
    if (fields.length === 0) return existing;
    values.push(id);
    return run(`UPDATE contact_messages SET ${fields.join(', ')} WHERE id = ?`, values);
  },

  delete(id) { return run('DELETE FROM contact_messages WHERE id = ?', [id]); },

  countUnread() { return get("SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0").count; },
};

module.exports = ContactMessage;
