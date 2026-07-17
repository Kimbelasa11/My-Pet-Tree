const { run, get, all } = require('../database/connection');

const News = {
  getAll(publishedOnly = true) {
    const where = publishedOnly ? 'WHERE is_published = 1' : '';
    return all(`SELECT * FROM news ${where} ORDER BY published_at DESC, created_at DESC`);
  },

  getById(id) { return get('SELECT * FROM news WHERE id = ?', [id]); },

  getBySlug(slug) { return get('SELECT * FROM news WHERE slug = ?', [slug]); },

  create(data) {
    return run('INSERT INTO news (title, slug, excerpt, body, image_url, author, is_published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [data.title, data.slug, data.excerpt || null, data.body || null, data.image_url || null, data.author || null, data.is_published ? 1 : 0, data.is_published ? new Date().toISOString() : null]);
  },

  update(id, data) {
    const existing = this.getById(id);
    if (!existing) return null;
    const fields = []; const values = [];
    for (const key of ['title', 'slug', 'excerpt', 'body', 'author']) {
      if (data[key] !== undefined) { fields.push(`${key} = ?`); values.push(data[key] || null); }
    }
    if (data.image_url !== undefined) { fields.push('image_url = ?'); values.push(data.image_url); }
    if (data.is_published !== undefined) {
      fields.push('is_published = ?'); values.push(data.is_published ? 1 : 0);
      fields.push('published_at = ?'); values.push(data.is_published ? new Date().toISOString() : null);
    }
    if (fields.length === 0) return existing;
    fields.push("updated_at = datetime('now')"); values.push(id);
    return run(`UPDATE news SET ${fields.join(', ')} WHERE id = ?`, values);
  },

  delete(id) { return run('DELETE FROM news WHERE id = ?', [id]); },

  count() { return get('SELECT COUNT(*) as count FROM news WHERE is_published = 1').count; },
};

module.exports = News;
