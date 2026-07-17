const { run, get, all } = require('../database/connection');

const TreeSpecies = {
  getAll(includeInactive = false) {
    const where = includeInactive ? '' : 'WHERE is_active = 1';
    return all(`SELECT * FROM tree_species ${where} ORDER BY name ASC`);
  },

  getById(id) {
    return get('SELECT * FROM tree_species WHERE id = ?', [id]);
  },

  create(data) {
    return run('INSERT INTO tree_species (name, scientific_name, description, benefits, native_region, growth_rate, max_height, climate_zone, image_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [data.name, data.scientific_name || null, data.description || null, data.benefits || null, data.native_region || null, data.growth_rate || null, data.max_height || null, data.climate_zone || null, data.image_url || null, data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1]);
  },

  update(id, data) {
    const existing = this.getById(id);
    if (!existing) return null;

    const fields = [];
    const values = [];

    for (const key of ['name', 'scientific_name', 'description', 'benefits', 'native_region', 'growth_rate', 'max_height', 'climate_zone']) {
      if (data[key] !== undefined) { fields.push(`${key} = ?`); values.push(data[key] || null); }
    }
    if (data.image_url !== undefined) { fields.push('image_url = ?'); values.push(data.image_url); }
    if (data.is_active !== undefined) { fields.push('is_active = ?'); values.push(data.is_active ? 1 : 0); }

    if (fields.length === 0) return existing;

    fields.push("updated_at = datetime('now')");
    values.push(id);

    return run(`UPDATE tree_species SET ${fields.join(', ')} WHERE id = ?`, values);
  },

  delete(id) {
    return run('DELETE FROM tree_species WHERE id = ?', [id]);
  },

  count() {
    return get('SELECT COUNT(*) as count FROM tree_species WHERE is_active = 1').count;
  },
};

module.exports = TreeSpecies;
