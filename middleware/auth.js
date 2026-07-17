const jwt = require('jsonwebtoken');
const config = require('../config');

function protect(req, res, next) {
  if (req.path === '/login') return next();

  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    if (req.xhr || req.headers.accept?.includes('json')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    return res.redirect('/admin/login');
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    res.locals.user = decoded;
    next();
  } catch {
    res.clearCookie('token');
    return res.redirect('/admin/login');
  }
}

module.exports = { protect };
