const FAQ = require('../../models/FAQ');

exports.index = (req, res) => {
  const faqs = FAQ.getAll(true);
  res.render('admin/faqs/index', {
    title: 'FAQs — My Pet Tree Admin',
    currentPage: 'faqs',
    faqs,
  });
};

exports.destroy = (req, res) => {
  FAQ.delete(req.params.id);
  res.redirect('/admin/faqs');
};

// ─── API Methods ──────────────────────────────────────────────

exports.apiList = (req, res) => {
  const faqs = FAQ.getAll(true);
  res.json(faqs);
};

exports.apiGet = (req, res) => {
  const faq = FAQ.getById(req.params.id);
  if (!faq) return res.status(404).json({ error: 'FAQ not found.' });
  res.json({ data: faq });
};

exports.apiStore = (req, res) => {
  try {
    FAQ.create(req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create FAQ.' });
  }
};

exports.apiUpdate = (req, res) => {
  try {
    const result = FAQ.update(req.params.id, req.body);
    if (!result) return res.status(404).json({ error: 'FAQ not found.' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update FAQ.' });
  }
};

exports.apiDestroy = (req, res) => {
  try {
    FAQ.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete FAQ.' });
  }
};