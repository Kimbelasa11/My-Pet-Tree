const { run, get, all } = require('../database/connection');

const ContactMessage = {
  getAll() { return all('SELECT * FROM contact_messages ORDER BY created_at DESC'); },

  getById(id) { return get('SELECT * FROM contact_messages WHERE id = ?', [id]); },

  create(data) {
    return run('INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [data.name, data.email, data.phone || null, data.subject || null, data.message]);
  },

  markRead(id) { return run('UPDATE contact_messages SET is_read = 1 WHERE id = ?', [id]); },

  countUnread() { return get("SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0").count; },
};

module.exports = ContactMessage;
