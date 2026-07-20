const UrbanPlanter = require('../../models/UrbanPlanter');
const RuralGrower = require('../../models/RuralGrower');
const TrackingUpdate = require('../../models/TrackingUpdate');
const Settings = require('../../models/Settings');

function getHero() {
  const bg = Settings.get('tracking_bg_image');
  return {
    title: 'Updates & Tracking',
    subtitle: 'Track the progress of reforestation efforts — browse Urban Planters, their Rural Growers, and real-time updates.',
    image_url: bg || '/assets/images/hero-placeholder.svg',
  };
}

exports.index = (req, res) => {
  const planters = UrbanPlanter.getAll();

  const plantersWithStats = planters.map(p => {
    const growers = UrbanPlanter.getLinkedGrowers(p.id);
    return { ...p, totalGrowers: growers.length };
  });

  res.render('public/tracking/index', {
    title: 'Updates & Tracking — My Pet Tree',
    currentPage: 'tracking',
    hero: getHero(),
    planters: plantersWithStats,
  });
};

exports.growers = (req, res) => {
  const planter = UrbanPlanter.getById(req.params.planterId);
  if (!planter) return res.redirect('/tracking');

  const growers = UrbanPlanter.getLinkedGrowers(req.params.planterId);
  const growersWithStats = growers.map(g => {
    const totalUpdates = TrackingUpdate.countByGrower(g.id);
    const latestDate = TrackingUpdate.getLatestUpdateDate(g.id);
    return { ...g, totalUpdates, latestUpdateDate: latestDate };
  });

  res.render('public/tracking/growers', {
    title: `${planter.name} — Rural Growers — My Pet Tree`,
    currentPage: 'tracking',
    hero: getHero(),
    planter,
    growers: growersWithStats,
  });
};

exports.updates = (req, res) => {
  const grower = RuralGrower.getById(req.params.growerId);
  if (!grower) return res.redirect('/tracking');

  const linkedPlanters = RuralGrower.getLinkedPlanters(grower.id);
  const planter = linkedPlanters.length > 0 ? linkedPlanters[0] : null;

  const rawUpdates = TrackingUpdate.getAllByGrower(req.params.growerId);
  const updates = rawUpdates.map(u => {
    const images = TrackingUpdate.getImages(u.id);
    return { ...u, images };
  });

  res.render('public/tracking/updates', {
    title: `${grower.name} — Updates — My Pet Tree`,
    currentPage: 'tracking',
    hero: getHero(),
    grower,
    planter,
    updates,
  });
};
