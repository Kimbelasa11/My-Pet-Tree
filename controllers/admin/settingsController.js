const Settings = require('../../models/Settings');
const path = require('path');
const fs = require('fs');
const config = require('../../config');

exports.hero = (req, res) => {
  const settings = Settings.getMultiple([
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

  res.render('admin/settings/hero', {
    title: 'Hero Section Settings — My Pet Tree Admin',
    currentPage: 'settings-hero',
    settings,
  });
};

exports.update = (req, res) => {
  const {
    hero_title, hero_highlight_text, hero_description,
    hero_btn_primary_text, hero_btn_primary_url,
    hero_btn_secondary_text, hero_btn_secondary_url,
    hero_overlay_color, hero_overlay_opacity,
    hero_stat_trees_planted, hero_stat_sponsors,
    hero_stat_rural_growers, hero_stat_communities,
  } = req.body;

  const textSettings = {
    hero_title,
    hero_highlight_text,
    hero_description,
    hero_btn_primary_text,
    hero_btn_primary_url,
    hero_btn_secondary_text,
    hero_btn_secondary_url,
    hero_overlay_color,
    hero_overlay_opacity,
    hero_stat_trees_planted,
    hero_stat_sponsors,
    hero_stat_rural_growers,
    hero_stat_communities,
  };

  for (const [key, value] of Object.entries(textSettings)) {
    Settings.set(key, value ?? '');
  }

  const bgImage = req.files?.['hero_bg_image']?.[0];
  if (bgImage) {
    const oldBg = Settings.get('hero_bg_image');
    Settings.set('hero_bg_image', `/uploads/images/${bgImage.filename}`);
    if (oldBg) removeOldImage(oldBg);
  }

  const fgImage = req.files?.['hero_foreground_image']?.[0];
  if (fgImage) {
    const oldFg = Settings.get('hero_foreground_image');
    Settings.set('hero_foreground_image', `/uploads/images/${fgImage.filename}`);
    if (oldFg) removeOldImage(oldFg);
  }

  const removeBg = req.body['remove_hero_bg_image'];
  if (removeBg === '1') {
    const oldBg = Settings.get('hero_bg_image');
    Settings.set('hero_bg_image', '');
    if (oldBg) removeOldImage(oldBg);
  }

  const removeFg = req.body['remove_hero_foreground_image'];
  if (removeFg === '1') {
    const oldFg = Settings.get('hero_foreground_image');
    Settings.set('hero_foreground_image', '');
    if (oldFg) removeOldImage(oldFg);
  }

  res.redirect('/admin/settings/hero?saved=1');
};

function removeOldImage(url) {
  if (!url) return;
  const filename = path.basename(url);
  const filepath = path.join(config.uploads.directory, filename);
  if (fs.existsSync(filepath)) {
    try { fs.unlinkSync(filepath); } catch {}
  }
}
