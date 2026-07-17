const Settings = require('../../models/Settings');
const TreeSpecies = require('../../models/TreeSpecies');
const News = require('../../models/News');
const FAQ = require('../../models/FAQ');

exports.index = (req, res) => {
  const s = Settings.getMultiple([
    'hero_bg_image',
    'hero_overlay_color',
    'hero_overlay_opacity',
    'hero_title',
    'hero_highlight_text',
    'hero_description',
    'hero_btn_primary_text',
    'hero_btn_primary_url',
    'hero_btn_secondary_text',
    'hero_btn_secondary_url',
    'hero_foreground_image',
    'hero_stat_trees_planted',
    'hero_stat_sponsors',
    'hero_stat_rural_growers',
    'hero_stat_communities',
  ]);

  const overlayColor = s.hero_overlay_color || '#0f2606';
  const overlayOpacity = parseFloat(s.hero_overlay_opacity || '0.70');
  const overlayStyle = `linear-gradient(135deg, rgba(${hexToRgb(overlayColor)},${overlayOpacity}), rgba(${hexToRgb(overlayColor)},${overlayOpacity * 0.7}))`;

  const hero = {
    image_url: s.hero_bg_image || '/assets/images/hero-placeholder.svg',
    title: s.hero_title || 'Plant Trees',
    highlight: s.hero_highlight_text || 'Grow Hope',
    description: s.hero_description || 'Join the reforestation movement. Sponsor a tree and help restore our planet\'s forests for generations to come.',
    btn_primary_text: s.hero_btn_primary_text || 'Sponsor a Tree',
    btn_primary_url: s.hero_btn_primary_url || '/sponsor',
    btn_secondary_text: s.hero_btn_secondary_text || 'How It Works',
    btn_secondary_url: s.hero_btn_secondary_url || '/how-it-works',
    foreground_image: s.hero_foreground_image || '',
  };

  const heroStats = {
    treesPlanted: parseInt(s.hero_stat_trees_planted) || 15000,
    sponsors: parseInt(s.hero_stat_sponsors) || 3200,
    ruralGrowers: parseInt(s.hero_stat_rural_growers) || 85,
    communities: parseInt(s.hero_stat_communities) || 42,
  };

  const featuredTrees = TreeSpecies.getAll().slice(0, 3);
  const recentNews = News.getAll().slice(0, 3);
  const faqs = FAQ.getAll().slice(0, 4);

  res.render('public/index', {
    title: 'My Pet Tree — Reforestation Advocacy & Tree Sponsorship',
    currentPage: 'home',
    hero,
    overlayStyle,
    heroStats,
    featuredTrees,
    recentNews,
    faqs,
  });
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
    : '15,38,6';
}
