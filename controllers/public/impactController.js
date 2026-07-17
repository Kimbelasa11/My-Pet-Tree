const Content = require('../../models/Content');
const Sponsorship = require('../../models/Sponsorship');
const RuralGrower = require('../../models/RuralGrower');

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

  res.render('public/impact', {
    title: 'Our Impact — My Pet Tree',
    currentPage: 'impact',
    hero: heroContent,
    stats,
    totalSponsorships,
    totalRaised,
    growers,
  });
};
