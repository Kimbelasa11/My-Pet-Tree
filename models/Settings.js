const { run, get, all } = require('../database/connection');

const Settings = {
  get(setting_key) {
    const row = get('SELECT * FROM site_settings WHERE setting_key = ?', [setting_key]);
    return row ? row.setting_value : null;
  },

  getJSON(setting_key) {
    const val = this.get(setting_key);
    if (!val) return null;
    try { return JSON.parse(val); } catch { return val; }
  },

  getMultiple(keys) {
    if (!keys.length) return {};
    const placeholders = keys.map(() => '?').join(',');
    const rows = all(`SELECT * FROM site_settings WHERE setting_key IN (${placeholders})`, keys);
    const result = {};
    for (const row of rows) {
      result[row.setting_key] = row.setting_value;
    }
    for (const key of keys) {
      if (!(key in result)) result[key] = null;
    }
    return result;
  },

  set(setting_key, setting_value) {
    const existing = get('SELECT id FROM site_settings WHERE setting_key = ?', [setting_key]);
    if (existing) {
      return run("UPDATE site_settings SET setting_value = ?, updated_at = datetime('now') WHERE setting_key = ?",
        [setting_value, setting_key]);
    } else {
      return run('INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)',
        [setting_key, setting_value]);
    }
  },

  setJSON(setting_key, obj) {
    return this.set(setting_key, JSON.stringify(obj));
  },

  getAll() {
    return all('SELECT * FROM site_settings ORDER BY setting_key');
  },

  delete(setting_key) {
    return run('DELETE FROM site_settings WHERE setting_key = ?', [setting_key]);
  },
};

module.exports = Settings;
