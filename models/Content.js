const { run, get, all } = require('../database/connection');

const Content = {
  getByPage(page) {
    return all('SELECT * FROM content WHERE page = ? ORDER BY sort_order ASC', [page]);
  },

  getByPageAndSection(page, section) {
    return get('SELECT * FROM content WHERE page = ? AND section = ?', [page, section]);
  },

  getAll() {
    return all('SELECT * FROM content ORDER BY page, sort_order');
  },

  update(page, section, data) {
    const existing = this.getByPageAndSection(page, section);
    if (existing) {
      return run("UPDATE content SET title = ?, subtitle = ?, body = ?, image_url = COALESCE(?, image_url), updated_at = datetime('now') WHERE page = ? AND section = ?",
        [data.title || null, data.subtitle || null, data.body || null, data.image_url || null, page, section]);
    } else {
      return run('INSERT INTO content (page, section, title, subtitle, body, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        [page, section, data.title || null, data.subtitle || null, data.body || null, data.image_url || null]);
    }
  },
};

module.exports = Content;
