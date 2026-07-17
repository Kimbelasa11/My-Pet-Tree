const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('../../models/User');

exports.loginForm = (req, res) => {
  res.render('admin/login', {
    layout: false,
    title: 'Admin Login — My Pet Tree',
    error: null,
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('admin/login', {
      layout: false,
      title: 'Admin Login — My Pet Tree',
      error: 'Please enter username and password.',
    });
  }

  const user = User.findByUsername(username);
  if (!user) {
    return res.render('admin/login', {
      layout: false,
      title: 'Admin Login — My Pet Tree',
      error: 'Invalid credentials.',
    });
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    return res.render('admin/login', {
      layout: false,
      title: 'Admin Login — My Pet Tree',
      error: 'Invalid credentials.',
    });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: config.isProd,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.redirect('/admin');
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/admin/login');
};
