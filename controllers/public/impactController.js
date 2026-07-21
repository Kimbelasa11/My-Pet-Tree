const Sponsorship = require('../../models/Sponsorship');
const RuralGrower = require('../../models/RuralGrower');
const UrbanPlanter = require('../../models/UrbanPlanter');
const Settings = require('../../models/Settings');

exports.index = (req, res) => {
  const totalSponsorships = Sponsorship.count();
  const totalRaised = Sponsorship.totalAmount('completed');
  const bgImage = Settings.get('impact_bg_image');

  const growers = RuralGrower.getAll();
  const growersWithPlanters = growers.map(g => {
    const linked = RuralGrower.getLinkedPlanters(g.id);
    return { ...g, linkedPlanter: linked.length > 0 ? linked[0] : null };
  });

  const planters = UrbanPlanter.getAll();
  const plantersWithGrowers = planters.map(p => {
    const linked = UrbanPlanter.getLinkedGrowers(p.id);
    return { ...p, linkedGrowers: linked };
  });

  res.render('public/impact', {
    title: 'Our Impact — My Pet Tree',
    currentPage: 'impact',
    hero: {
      title: 'Our Impact',
      subtitle: 'Every tree tells a story. See the difference we\'re making together.',
      image_url: bgImage || '/assets/images/hero-placeholder.svg',
    },
    stats: {
      treesPlanted: 15000,
      activeGrowers: 85,
      communitiesReached: 42,
      speciesPlanted: 30,
    },
    totalSponsorships,
    totalRaised,
    growers: growersWithPlanters,
    planters: plantersWithGrowers,
  });
};

exports.planterDetail = (req, res) => {
  const planter = UrbanPlanter.getById(req.params.id);
  if (!planter) return res.redirect('/impact');

  const linkedGrowers = UrbanPlanter.getLinkedGrowers(planter.id);
  const bgImage = Settings.get('impact_bg_image');

  res.render('public/urban-planter-detail', {
    title: `${planter.name} — Urban Planter — My Pet Tree`,
    currentPage: 'impact',
    hero: {
      title: 'Urban Planter',
      subtitle: 'Learn more about the inspiring individuals supporting reforestation and creating a greener future through tree sponsorship.',
      image_url: bgImage || '/assets/images/hero-placeholder.svg',
    },
    planter,
    linkedGrowers,
  });
};

exports.growerDetail = (req, res) => {
  const grower = RuralGrower.getById(req.params.id);
  if (!grower) return res.redirect('/impact');

  const linkedPlanters = RuralGrower.getLinkedPlanters(grower.id);
  const bgImage = Settings.get('impact_bg_image');

  res.render('public/rural-grower-detail', {
    title: `${grower.name} — Rural Grower — My Pet Tree`,
    currentPage: 'impact',
    hero: {
      title: 'Rural Grower',
      subtitle: 'Meet the dedicated Rural Growers who plant, nurture, and care for every sponsored tree, making reforestation possible.',
      image_url: bgImage || '/assets/images/hero-placeholder.svg',
    },
    grower,
    linkedPlanters,
  });
};
