const Settings = require('../../models/Settings');

exports.index = (req, res) => {
  const bgImage = Settings.get('about_hero_bg_image');

  res.render('public/about', {
    title: 'About Us — My Pet Tree',
    currentPage: 'about',
    hero: {
      title: 'About My Pet Tree',
      subtitle: 'A reforestation advocacy platform connecting people who care about the planet with the communities who nurture it.',
      image_url: bgImage || '/assets/images/hero-placeholder.svg',
    },
    story: {
      title: 'Our Story',
      body: 'My Pet Tree began as a small community initiative to restore local forests. Today, we are a growing platform that connects sponsors, urban planters, and rural growers in a shared mission to reforest the planet. Every tree sponsored through our platform represents a partnership between someone who wants to make a difference and a grower who nurtures that tree to maturity.',
    },
    values: [
      { title: 'Sustainability', description: 'We prioritize long-term ecological health in every planting.' },
      { title: 'Community', description: 'We empower local growers and strengthen rural economies.' },
      { title: 'Transparency', description: 'Every tree is tracked, every contribution is accounted for.' },
      { title: 'Impact', description: 'We measure success by forests restored and lives improved.' },
    ],
  });
};
