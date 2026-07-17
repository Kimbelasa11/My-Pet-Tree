const News = require('../../models/News');
const { v4: uuidv4 } = require('uuid');

exports.index = (req, res) => {
  const articles = News.getAll(false);
  res.render('admin/news/index', {
    title: 'News & Stories — My Pet Tree Admin',
    currentPage: 'news',
    articles,
  });
};

exports.destroy = (req, res) => {
  News.delete(req.params.id);
  res.redirect('/admin/news');
};

// ─── API Methods ──────────────────────────────────────────────

exports.apiList = (req, res) => {
  const articles = News.getAll(false);
  res.json(articles);
};

exports.apiGet = (req, res) => {
  const article = News.getById(req.params.id);
  if (!article) return res.status(404).json({ error: 'Article not found.' });
  res.json({ data: article });
};

exports.apiStore = (req, res) => {
  try {
    const data = req.body;
    data.image_url = req.file ? `/uploads/images/${req.file.filename}` : undefined;

    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        + '-' + uuidv4().split('-')[0];
    }

    News.create(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create article.' });
  }
};

exports.apiUpdate = (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image_url = `/uploads/images/${req.file.filename}`;
    const result = News.update(req.params.id, data);
    if (!result) return res.status(404).json({ error: 'Article not found.' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update article.' });
  }
};

exports.apiDestroy = (req, res) => {
  try {
    News.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete article.' });
  }
};