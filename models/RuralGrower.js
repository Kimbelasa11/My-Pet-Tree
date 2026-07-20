const { run, get, all, transaction } = require('../database/connection');

const RuralGrower = {
  getAll(includeInactive = false) {
    const where = includeInactive ? '' : 'WHERE is_active = 1';
    return all(`SELECT * FROM rural_growers ${where} ORDER BY name ASC`);
  },

  getById(id) { return get('SELECT * FROM rural_growers WHERE id = ?', [id]); },

  create(data) {
    return run('INSERT INTO rural_growers (name, email, phone, location, farm_size, bio, image_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [data.name, data.email || null, data.phone || null, data.location || null, data.farm_size || null, data.bio || null, data.image_url || null, data.is_active !== undefined ? (Number(data.is_active) ? 1 : 0) : 1]);
  },

  update(id, data) {
    const existing = this.getById(id);
    if (!existing) return null;
    const fields = []; const values = [];
    for (const key of ['name', 'email', 'phone', 'location', 'farm_size', 'bio']) {
      if (data[key] !== undefined) { fields.push(`${key} = ?`); values.push(data[key] || null); }
    }
    if (data.image_url !== undefined) { fields.push('image_url = ?'); values.push(data.image_url); }
    if (data.is_active !== undefined) { fields.push('is_active = ?'); values.push(Number(data.is_active) ? 1 : 0); }
    if (fields.length === 0) return existing;
    fields.push("updated_at = datetime('now')"); values.push(id);
    return run(`UPDATE rural_growers SET ${fields.join(', ')} WHERE id = ?`, values);
  },

  delete(id) { return run('DELETE FROM rural_growers WHERE id = ?', [id]); },

  count() { return get('SELECT COUNT(*) as count FROM rural_growers WHERE is_active = 1').count; },

  // ─── Urban Planter linking ──────────────────────────────────

  getLinkedPlanters(growerId) {
    return all(`SELECT up.id, up.name, up.email, up.location, up.organization FROM urban_planters up JOIN rural_grower_urban_planters rgup ON rgup.urban_planter_id = up.id WHERE rgup.rural_grower_id = ? ORDER BY up.name ASC`, [growerId]);
  },

  getLinkedPlanterIds(growerId) {
    const rows = all('SELECT urban_planter_id FROM rural_grower_urban_planters WHERE rural_grower_id = ?', [growerId]);
    return rows.map(r => r.urban_planter_id);
  },

  setLinkedPlanters(growerId, planterIds) {
    transaction(() => {
      run('DELETE FROM rural_grower_urban_planters WHERE rural_grower_id = ?', [growerId]);
      if (planterIds && planterIds.length > 0) {
        for (const id of planterIds) {
          run('INSERT INTO rural_grower_urban_planters (rural_grower_id, urban_planter_id) VALUES (?, ?)', [growerId, id]);
        }
      }
    });
  },
};

module.exports = RuralGrower;
