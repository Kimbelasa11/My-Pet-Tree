const TreeSpecies = require('../../models/TreeSpecies');

exports.index = (req, res) => {
  const trees = TreeSpecies.getAll(true);
  res.render('admin/trees/index', {
    title: 'Tree Species — My Pet Tree Admin',
    currentPage: 'trees',
    trees,
  });
};

exports.destroy = (req, res) => {
  TreeSpecies.delete(req.params.id);
  res.redirect('/admin/trees');
};

// ─── API Methods ──────────────────────────────────────────────

exports.apiList = (req, res) => {
  const trees = TreeSpecies.getAll(true);
  res.json(trees);
};

exports.apiGet = (req, res) => {
  const tree = TreeSpecies.getById(req.params.id);
  if (!tree) return res.status(404).json({ error: 'Tree species not found.' });
  res.json({ data: tree });
};

exports.apiStore = (req, res) => {
  try {
    const data = req.body;
    data.image_url = req.file ? `/uploads/images/${req.file.filename}` : undefined;
    TreeSpecies.create(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create tree species.' });
  }
};

exports.apiUpdate = (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image_url = `/uploads/images/${req.file.filename}`;
    const result = TreeSpecies.update(req.params.id, data);
    if (!result) return res.status(404).json({ error: 'Tree species not found.' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update tree species.' });
  }
};

exports.apiDestroy = (req, res) => {
  try {
    TreeSpecies.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete tree species.' });
  }
};