const Content = require('../../models/Content');

exports.index = (req, res) => {
  const heroContent = Content.getByPageAndSection('about', 'hero');
  const storyContent = Content.getByPageAndSection('about', 'story');
  const valuesContent = Content.getByPageAndSection('about', 'values');

  let values = [];
  if (valuesContent?.body) {
    try { values = JSON.parse(valuesContent.body); } catch {}
  }

  res.render('public/about', {
    title: 'About Us — My Pet Tree',
    currentPage: 'about',
    hero: heroContent,
    story: storyContent,
    values,
  });
};
