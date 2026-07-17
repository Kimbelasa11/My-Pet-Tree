const TreeSpecies = require('../../models/TreeSpecies');

exports.index = (req, res) => {
  const trees = TreeSpecies.getAll(true);
  res.render('admin/trees/index', {
    title: 'Tree Species — My Pet Tree Admin',
    currentPage: 'trees',
    trees,
  });
};

exports.create = (req, res) => {
  res.render('admin/trees/form', {
    title: 'Add Tree Species — My Pet Tree Admin',
    currentPage: 'trees',
    tree: null,
  });
};

exports.store = (req, res) => {
  const data = req.body;
  data.image_url = req.file ? `/uploads/images/${req.file.filename}` : undefined;

  TreeSpecies.create(data);
  res.redirect('/admin/trees');
};

exports.edit = (req, res) => {
  const tree = TreeSpecies.getById(req.params.id);
  if (!tree) return res.redirect('/admin/trees');

  res.render('admin/trees/form', {
    title: `Edit ${tree.name} — My Pet Tree Admin`,
    currentPage: 'trees',
    tree,
  });
};

exports.update = (req, res) => {
  const data = req.body;
  if (req.file) data.image_url = `/uploads/images/${req.file.filename}`;

  TreeSpecies.update(req.params.id, data);
  res.redirect('/admin/trees');
};

exports.destroy = (req, res) => {
  TreeSpecies.delete(req.params.id);
  res.redirect('/admin/trees');
};
