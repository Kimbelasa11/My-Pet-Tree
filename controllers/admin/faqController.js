const FAQ = require('../../models/FAQ');

exports.index = (req, res) => {
  const faqs = FAQ.getAll(true);
  res.render('admin/faqs/index', {
    title: 'FAQs — My Pet Tree Admin',
    currentPage: 'faqs',
    faqs,
  });
};

exports.create = (req, res) => {
  res.render('admin/faqs/form', {
    title: 'Add FAQ — My Pet Tree Admin',
    currentPage: 'faqs',
    faq: null,
  });
};

exports.store = (req, res) => {
  FAQ.create(req.body);
  res.redirect('/admin/faqs');
};

exports.edit = (req, res) => {
  const faq = FAQ.getById(req.params.id);
  if (!faq) return res.redirect('/admin/faqs');

  res.render('admin/faqs/form', {
    title: `Edit FAQ — My Pet Tree Admin`,
    currentPage: 'faqs',
    faq,
  });
};

exports.update = (req, res) => {
  FAQ.update(req.params.id, req.body);
  res.redirect('/admin/faqs');
};

exports.destroy = (req, res) => {
  FAQ.delete(req.params.id);
  res.redirect('/admin/faqs');
};
