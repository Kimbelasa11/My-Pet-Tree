const Content = require('../../models/Content');
const ContactMessage = require('../../models/ContactMessage');

exports.index = (req, res) => {
  const heroContent = Content.getByPageAndSection('contact', 'hero');

  res.render('public/contact', {
    title: 'Contact Us — My Pet Tree',
    currentPage: 'contact',
    hero: heroContent,
    success: req.query.success === '1',
  });
};

exports.submit = (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.render('public/contact', {
      title: 'Contact Us — My Pet Tree',
      currentPage: 'contact',
      error: 'Please fill in all required fields.',
    });
  }

  ContactMessage.create({ name, email, phone, subject, message });

  res.redirect('/contact?success=1');
};
