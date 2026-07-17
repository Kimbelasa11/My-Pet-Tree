const config = require('../config');

function notFound(req, res, next) {
  res.status(404).render('public/404', {
    title: 'Page Not Found — My Pet Tree',
    currentPage: '404',
  });
}

function serverError(err, req, res, next) {
  console.error(err.stack || err.message || err);
  const status = err.status || 500;

  if (req.xhr || req.headers.accept?.includes('json')) {
    return res.status(status).json({
      error: config.isDev ? err.message : 'Internal server error',
    });
  }

  res.status(status).render('public/404', {
    title: 'Something went wrong — My Pet Tree',
    currentPage: 'error',
    message: config.isDev ? err.message : 'An unexpected error occurred.',
  });
}

module.exports = { notFound, serverError };
