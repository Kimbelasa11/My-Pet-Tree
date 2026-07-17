const { run, get, all } = require('../database/connection');

const UrbanPlanter = {
  getAll(includeInactive = false) {
    const where = includeInactive ? '' : 'WHERE is_active = 1';
    return all(`SELECT * FROM urban_planters ${where} ORDER BY name ASC`);
  },

  getById(id) {
    return get('SELECT * FROM urban_planters WHERE id = ?', [id]);
  },

  create(data) {
    return run('INSERT INTO urban_planters (name, email, phone, location, organization, bio, image_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [data.name, data.email || null, data.phone || null, data.location || null, data.organization || null, data.bio || null, data.image_url || null, data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1]);
  },

  update(id, data) {
    const existing = this.getById(id);
    if (!existing) return null;
    const fields = []; const values = [];
    for (const key of ['name', 'email', 'phone', 'location', 'organization', 'bio']) {
      if (data[key] !== undefined) { fields.push(`${key} = ?`); values.push(data[key] || null); }
    }
    if (data.image_url !== undefined) { fields.push('image_url = ?'); values.push(data.image_url); }
    if (data.is_active !== undefined) { fields.push('is_active = ?'); values.push(data.is_active ? 1 : 0); }
    if (fields.length === 0) return existing;
    fields.push("updated_at = datetime('now')"); values.push(id);
    return run(`UPDATE urban_planters SET ${fields.join(', ')} WHERE id = ?`, values);
  },

  delete(id) { return run('DELETE FROM urban_planters WHERE id = ?', [id]); },

  count() { return get('SELECT COUNT(*) as count FROM urban_planters WHERE is_active = 1').count; },

  getLinkedGrowers(planterId) {
    return all(`SELECT rg.id, rg.name, rg.location, rg.farm_size, rg.image_url FROM rural_growers rg JOIN rural_grower_urban_planters rgup ON rgup.rural_grower_id = rg.id WHERE rgup.urban_planter_id = ? AND rg.is_active = 1 ORDER BY rg.name ASC`, [planterId]);
  },

  getAllBasic() {
    return all('SELECT id, name, email, location, organization FROM urban_planters WHERE is_active = 1 ORDER BY name ASC');
  },

  search(query) {
    if (!query || query.length < 1) {
      return this.getAllBasic();
    }
    const like = `%${query}%`;
    return all('SELECT id, name, email, location, organization FROM urban_planters WHERE is_active = 1 AND (name LIKE ? OR email LIKE ? OR location LIKE ? OR organization LIKE ?) ORDER BY name ASC LIMIT 20',
      [like, like, like, like]);
  },
};

module.exports = UrbanPlanter;
