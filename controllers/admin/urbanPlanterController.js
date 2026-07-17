const UrbanPlanter = require('../../models/UrbanPlanter');

exports.index = (req, res) => {
  const planters = UrbanPlanter.getAll(true);
  res.render('admin/urban-planters/index', {
    title: 'Urban Planters — My Pet Tree Admin',
    currentPage: 'urban-planters',
    planters,
  });
};

exports.create = (req, res) => {
  res.render('admin/urban-planters/form', {
    title: 'Add Urban Planter — My Pet Tree Admin',
    currentPage: 'urban-planters',
    planter: null,
  });
};

exports.store = (req, res) => {
  const data = req.body;
  data.image_url = req.file ? `/uploads/images/${req.file.filename}` : undefined;

  UrbanPlanter.create(data);
  res.redirect('/admin/urban-planters');
};

exports.edit = (req, res) => {
  const planter = UrbanPlanter.getById(req.params.id);
  if (!planter) return res.redirect('/admin/urban-planters');

  res.render('admin/urban-planters/form', {
    title: `Edit ${planter.name} — My Pet Tree Admin`,
    currentPage: 'urban-planters',
    planter,
  });
};

exports.update = (req, res) => {
  const data = req.body;
  if (req.file) data.image_url = `/uploads/images/${req.file.filename}`;

  UrbanPlanter.update(req.params.id, data);
  res.redirect('/admin/urban-planters');
};

exports.destroy = (req, res) => {
  UrbanPlanter.delete(req.params.id);
  res.redirect('/admin/urban-planters');
};

exports.search = (req, res) => {
  const query = req.query.q || '';
  if (query.length < 1) {
    return res.json([]);
  }
  const results = UrbanPlanter.search(query);
  res.json(results);
};
