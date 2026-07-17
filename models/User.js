const { run, get, all } = require('../database/connection');

const User = {
  findByUsername(username) {
    return get('SELECT * FROM users WHERE username = ?', [username]);
  },

  findById(id) {
    return get('SELECT id, username, role, must_change_password, created_at FROM users WHERE id = ?', [id]);
  },

  create(username, passwordHash) {
    return run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', [username, passwordHash, 'admin']);
  },

  updatePassword(id, passwordHash) {
    return run("UPDATE users SET password_hash = ?, must_change_password = 0, updated_at = datetime('now') WHERE id = ?", [passwordHash, id]);
  },

  count() {
    const row = get('SELECT COUNT(*) as count FROM users');
    return row.count;
  },
};

module.exports = User;
