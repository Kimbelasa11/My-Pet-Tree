const Sponsorship = require('../../models/Sponsorship');
const Payment = require('../../models/Payment');

exports.index = (req, res) => {
  const payments = Payment.getAll();
  const sponsorships = Sponsorship.getAll();

  res.render('admin/payments/index', {
    title: 'Payments — My Pet Tree Admin',
    currentPage: 'payments',
    payments,
    sponsorships,
  });
};

exports.show = (req, res) => {
  const payment = Payment.getById(req.params.id);
  if (!payment) return res.redirect('/admin/payments');

  res.render('admin/payments/show', {
    title: `Payment #${payment.id} — My Pet Tree Admin`,
    currentPage: 'payments',
    payment,
  });
};

// ─── API Methods ──────────────────────────────────────────────

exports.apiList = (req, res) => {
  const sponsorships = Sponsorship.getAll();
  res.json(sponsorships);
};