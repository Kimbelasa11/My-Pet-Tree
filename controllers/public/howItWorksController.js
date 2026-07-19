const FAQ = require('../../models/FAQ');
const Settings = require('../../models/Settings');

exports.index = (req, res) => {
  const faqs = FAQ.getAll();
  const bgImage = Settings.get('how_it_works_bg_image');

  const stepSettings = Settings.getMultiple([
    'how_it_works_step1_image',
    'how_it_works_step2_image',
    'how_it_works_step3_image',
    'how_it_works_whoweare_image',
    'how_it_works_urban_planters_image',
    'how_it_works_rural_growers_image',
  ]);

  res.render('public/how-it-works', {
    title: 'How It Works — My Pet Tree',
    currentPage: 'how-it-works',
    hero: {
      title: 'How It Works',
      subtitle: 'Sponsor a tree in three simple steps and watch your impact grow.',
      image_url: bgImage || '/assets/images/hero-placeholder.svg',
    },
    faqs,
    steps: {
      step1_image: stepSettings.how_it_works_step1_image,
      step2_image: stepSettings.how_it_works_step2_image,
      step3_image: stepSettings.how_it_works_step3_image,
    },
    peopleImage: stepSettings.how_it_works_whoweare_image,
    urbanPlantersImage: stepSettings.how_it_works_urban_planters_image,
    ruralGrowersImage: stepSettings.how_it_works_rural_growers_image,
  });
};
