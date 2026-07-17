const TreeSpecies = require('../../models/TreeSpecies');

exports.index = (req, res) => {
  const trees = TreeSpecies.getAll();

  res.render('public/trees', {
    title: 'Tree Directory — My Pet Tree',
    currentPage: 'trees',
    trees,
  });
};

exports.show = (req, res) => {
  const tree = TreeSpecies.getById(req.params.id);

  if (!tree) {
    return res.status(404).render('public/404', {
      title: 'Tree Not Found — My Pet Tree',
      currentPage: '404',
    });
  }

  res.render('public/tree-detail', {
    title: `${tree.name} — My Pet Tree`,
    currentPage: 'trees',
    tree,
  });
};
