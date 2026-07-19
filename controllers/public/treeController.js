const TreeSpecies = require('../../models/TreeSpecies');
const Settings = require('../../models/Settings');

exports.index = (req, res) => {
  const trees = TreeSpecies.getAll();
  const bgImage = Settings.get('trees_bg_image');

  res.render('public/trees', {
    title: 'Tree Directory — My Pet Tree',
    currentPage: 'trees',
    hero: {
      title: 'Tree Directory',
      subtitle: 'Browse native and endemic tree species available for sponsorship.',
      image_url: bgImage || '/assets/images/hero-placeholder.svg',
    },
    trees,
  });
};

exports.show = (req, res) => {
  const tree = TreeSpecies.getById(req.params.id);
  const bgImage = Settings.get('trees_bg_image');
  const defaultBg = Settings.get('default_page_banner');

  if (!tree) {
    return res.status(404).render('public/404', {
      title: 'Tree Not Found — My Pet Tree',
      currentPage: '404',
      hero: {
        title: '404 — Page Not Found',
        subtitle: 'The page you\'re looking for doesn\'t exist or has been moved.',
        image_url: defaultBg || '/assets/images/hero-placeholder.svg',
      },
    });
  }

  res.render('public/tree-detail', {
    title: `${tree.name} — My Pet Tree`,
    currentPage: 'trees',
    hero: {
      title: tree.name,
      subtitle: tree.scientific_name,
      image_url: bgImage || '/assets/images/hero-placeholder.svg',
    },
    tree,
  });
};
