const Content = require('../../models/Content');
const Sponsorship = require('../../models/Sponsorship');
const RuralGrower = require('../../models/RuralGrower');
const UrbanPlanter = require('../../models/UrbanPlanter');

exports.index = (req, res) => {
  const heroContent = Content.getByPageAndSection('impact', 'hero');
  const statsContent = Content.getByPageAndSection('home', 'stats');

  let stats = { treesPlanted: 0, activeGrowers: 0, communitiesReached: 0, speciesPlanted: 0 };
  if (statsContent?.body) {
    try { stats = JSON.parse(statsContent.body); } catch {}
  }

  const totalSponsorships = Sponsorship.count();
  const totalRaised = Sponsorship.totalAmount('completed');

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
    hero: heroContent,
    stats,
    totalSponsorships,
    totalRaised,
    growers: growersWithPlanters,
    planters: plantersWithGrowers,
  });
};
