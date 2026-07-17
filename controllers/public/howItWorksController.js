const Content = require('../../models/Content');
const FAQ = require('../../models/FAQ');

exports.index = (req, res) => {
  const heroContent = Content.getByPageAndSection('how-it-works', 'hero');
  const faqs = FAQ.getAll();

  res.render('public/how-it-works', {
    title: 'How It Works — My Pet Tree',
    currentPage: 'how-it-works',
    hero: heroContent,
    faqs,
  });
};
