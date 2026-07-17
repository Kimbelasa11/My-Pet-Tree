const UrbanPlanter = require('../../models/UrbanPlanter');

exports.index = (req, res) => {
  const planters = UrbanPlanter.getAll(true);
  res.render('admin/urban-planters/index', {
    title: 'Urban Planters — My Pet Tree Admin',
    currentPage: 'urban-planters',
    planters,
  });
};

exports.destroy = (req, res) => {
  UrbanPlanter.delete(req.params.id);
  res.redirect('/admin/urban-planters');
};

exports.search = (req, res) => {
  const query = req.query.q || '';
  const results = UrbanPlanter.search(query);
  res.json(results);
};

// ─── API Methods ──────────────────────────────────────────────

exports.apiList = (req, res) => {
  const planters = UrbanPlanter.getAll(true);
  res.json(planters);
};

exports.apiGet = (req, res) => {
  const planter = UrbanPlanter.getById(req.params.id);
  if (!planter) return res.status(404).json({ error: 'Urban planter not found.' });
  res.json({ data: planter });
};

exports.apiStore = (req, res) => {
  try {
    const data = req.body;
    data.image_url = req.file ? `/uploads/images/${req.file.filename}` : undefined;
    UrbanPlanter.create(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create urban planter.' });
  }
};

exports.apiUpdate = (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image_url = `/uploads/images/${req.file.filename}`;
    const result = UrbanPlanter.update(req.params.id, data);
    if (!result) return res.status(404).json({ error: 'Urban planter not found.' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update urban planter.' });
  }
};

exports.apiDestroy = (req, res) => {
  try {
    UrbanPlanter.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete urban planter.' });
  }
};