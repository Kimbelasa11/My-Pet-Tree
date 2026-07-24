const ContactMessage = require('../../models/ContactMessage');

exports.index = (req, res) => {
  const messages = ContactMessage.getAll();
  res.render('admin/contact-messages/index', {
    title: 'Contact Messages — My Pet Tree Admin',
    currentPage: 'contact-messages',
    messages,
  });
};

exports.destroy = (req, res) => {
  ContactMessage.delete(req.params.id);
  res.redirect('/admin/contact-messages');
};

exports.apiList = (req, res) => {
  const messages = ContactMessage.getAll();
  res.json(messages);
};

exports.apiGet = (req, res) => {
  const message = ContactMessage.getById(req.params.id);
  if (!message) return res.status(404).json({ error: 'Message not found.' });
  res.json({ data: message });
};

exports.apiMarkRead = (req, res) => {
  try {
    ContactMessage.markRead(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to mark message as read.' });
  }
};

exports.apiDestroy = (req, res) => {
  try {
    ContactMessage.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete message.' });
  }
};
