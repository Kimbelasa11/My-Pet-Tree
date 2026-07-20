const { run, get, all, transaction } = require('../database/connection');

const TrackingUpdate = {
  getAllByGrower(growerId, includeAll = false) {
    const where = includeAll ? '' : "AND tu.status = 'active'";
    return all(`SELECT tu.*, COALESCE(img.image_count, 0) as image_count
      FROM tracking_updates tu
      LEFT JOIN (SELECT tracking_update_id, COUNT(*) as image_count FROM tracking_update_images GROUP BY tracking_update_id) img ON img.tracking_update_id = tu.id
      WHERE tu.rural_grower_id = ? ${where}
      ORDER BY tu.update_date DESC, tu.created_at DESC`, [growerId]);
  },

  getById(id) {
    return get('SELECT * FROM tracking_updates WHERE id = ?', [id]);
  },

  getImages(updateId) {
    return all('SELECT * FROM tracking_update_images WHERE tracking_update_id = ? ORDER BY sort_order ASC, id ASC', [updateId]);
  },

  getFullById(id) {
    const update = this.getById(id);
    if (!update) return null;
    update.images = this.getImages(id);
    return update;
  },

  create(data) {
    const result = run(`INSERT INTO tracking_updates (rural_grower_id, title, description, update_date, notes, status)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [data.rural_grower_id, data.title, data.description || null, data.update_date, data.notes || null, data.status || 'active']);
    return result;
  },

  addImages(updateId, imageUrls) {
    transaction(() => {
      const existing = all('SELECT COALESCE(MAX(sort_order), -1) as max_sort FROM tracking_update_images WHERE tracking_update_id = ?', [updateId]);
      let sortOrder = (existing[0]?.max_sort ?? -1) + 1;
      for (const url of imageUrls) {
        run('INSERT INTO tracking_update_images (tracking_update_id, image_url, sort_order) VALUES (?, ?, ?)',
          [updateId, url, sortOrder++]);
      }
    });
  },

  update(id, data) {
    const existing = this.getById(id);
    if (!existing) return null;
    const fields = []; const values = [];
    for (const key of ['rural_grower_id', 'title', 'description', 'update_date', 'notes', 'status']) {
      if (data[key] !== undefined) { fields.push(`${key} = ?`); values.push(data[key]); }
    }
    if (fields.length === 0) return existing;
    fields.push("updated_at = datetime('now')"); values.push(id);
    return run(`UPDATE tracking_updates SET ${fields.join(', ')} WHERE id = ?`, values);
  },

  delete(id) {
    return run('DELETE FROM tracking_updates WHERE id = ?', [id]);
  },

  deleteImage(imageId) {
    return run('DELETE FROM tracking_update_images WHERE id = ?', [imageId]);
  },

  countByGrower(growerId) {
    return get('SELECT COUNT(*) as count FROM tracking_updates WHERE rural_grower_id = ?', [growerId]).count;
  },

  getLatestUpdateDate(growerId) {
    const row = get('SELECT update_date FROM tracking_updates WHERE rural_grower_id = ? ORDER BY update_date DESC LIMIT 1', [growerId]);
    return row ? row.update_date : null;
  },

  getAllByPlanter(planterId) {
    return all(`SELECT tu.*, rg.name as grower_name FROM tracking_updates tu
      JOIN rural_growers rg ON rg.id = tu.rural_grower_id
      JOIN rural_grower_urban_planters rgup ON rgup.rural_grower_id = rg.id
      WHERE rgup.urban_planter_id = ?
      ORDER BY tu.update_date DESC`, [planterId]);
  },
};

module.exports = TrackingUpdate;
