const ContactMessage = require('../../models/ContactMessage');
const Settings = require('../../models/Settings');

exports.index = (req, res) => {
  const bgImage = Settings.get('contact_bg_image');
  res.render('public/contact', {
    title: 'Contact Us — My Pet Tree',
    currentPage: 'contact',
    hero: {
      title: 'Get in Touch',
      subtitle: 'Have questions, suggestions, or want to partner with us? We\'d love to hear from you.',
      image_url: bgImage || '/assets/images/hero-placeholder.svg',
    },
    success: req.query.success === '1',
  });
};

exports.submit = (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    const bgImage = Settings.get('contact_bg_image');
    return res.render('public/contact', {
      title: 'Contact Us — My Pet Tree',
      currentPage: 'contact',
      hero: {
        title: 'Get in Touch',
        subtitle: 'Have questions, suggestions, or want to partner with us? We\'d love to hear from you.',
        image_url: bgImage || '/assets/images/hero-placeholder.svg',
      },
      error: 'Please fill in all required fields.',
    });
  }

  ContactMessage.create({ name, email, phone, subject, message });

  res.redirect('/contact?success=1');
};
