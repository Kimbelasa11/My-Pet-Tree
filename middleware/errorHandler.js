const config = require('../config');
const Settings = require('../models/Settings');

function notFound(req, res, next) {
  const defaultBg = Settings.get('default_page_banner');
  res.status(404).render('public/404', {
    title: 'Page Not Found — My Pet Tree',
    currentPage: '404',
    hero: {
      title: '404 — Page Not Found',
      subtitle: 'The page you\'re looking for doesn\'t exist or has been moved.',
      image_url: defaultBg || '/assets/images/hero-placeholder.svg',
    },
  });
}

function serverError(err, req, res, next) {
  console.error(err.stack || err.message || err);
  const status = err.status || 500;
  const defaultBg = Settings.get('default_page_banner');

  if (req.xhr || (req.headers.accept && req.headers.accept.includes('json'))) {
    return res.status(status).json({
      error: config.isDev ? err.message : 'Internal server error',
    });
  }

  res.status(status).render('public/404', {
    title: 'Something went wrong — My Pet Tree',
    currentPage: 'error',
    hero: {
      title: 'Something went wrong',
      subtitle: 'An unexpected error occurred.',
      image_url: defaultBg || '/assets/images/hero-placeholder.svg',
    },
    message: config.isDev ? err.message : 'An unexpected error occurred.',
  });
}

module.exports = { notFound, serverError };
