const FAQ = require('../../models/FAQ');
const Settings = require('../../models/Settings');

exports.index = (req, res) => {
  const faqs = FAQ.getAll();
  const bgImage = Settings.get('how_it_works_bg_image');

  res.render('public/how-it-works', {
    title: 'How It Works — My Pet Tree',
    currentPage: 'how-it-works',
    hero: {
      title: 'How It Works',
      subtitle: 'Sponsor a tree in three simple steps and watch your impact grow.',
      image_url: bgImage || '/assets/images/hero-placeholder.svg',
    },
    faqs,
  });
};
