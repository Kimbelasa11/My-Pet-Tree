const TreeSpecies = require('../../models/TreeSpecies');
const UrbanPlanter = require('../../models/UrbanPlanter');
const RuralGrower = require('../../models/RuralGrower');
const Sponsorship = require('../../models/Sponsorship');
const ContactMessage = require('../../models/ContactMessage');
const News = require('../../models/News');
const FAQ = require('../../models/FAQ');

exports.index = (req, res) => {
  const stats = {
    treeSpecies: TreeSpecies.count(),
    urbanPlanters: UrbanPlanter.count(),
    ruralGrowers: RuralGrower.count(),
    sponsorships: Sponsorship.count(),
    totalRaised: Sponsorship.totalAmount('completed'),
    unreadMessages: ContactMessage.countUnread(),
    publishedNews: News.count(),
    faqs: FAQ.count(),
  };

  const recentSponsorships = Sponsorship.getAll().slice(0, 5);
  const unreadMessages = ContactMessage.getAll().filter(m => !m.is_read).slice(0, 5);

  res.render('admin/dashboard', {
    title: 'Dashboard — My Pet Tree Admin',
    currentPage: 'dashboard',
    stats,
    recentSponsorships,
    unreadMessages,
  });
};
