const Content = require('../../models/Content');
const TreeSpecies = require('../../models/TreeSpecies');
const Sponsorship = require('../../models/Sponsorship');
const Payment = require('../../models/Payment');
const paymentService = require('../../services/paymentService');

exports.index = (req, res) => {
  const heroContent = Content.getByPageAndSection('sponsor', 'hero');
  const trees = TreeSpecies.getAll();
  const faqContent = Content.getByPageAndSection('sponsor', 'faq');

  res.render('public/sponsor', {
    title: 'Sponsor a Tree — My Pet Tree',
    currentPage: 'sponsor',
    hero: heroContent,
    trees,
    faqContent,
    treeId: req.query.tree || null,
    error: null,
  });
};

exports.checkout = (req, res) => {
  const { tree_id, quantity, sponsor_name, sponsor_email, sponsor_phone, message, is_anonymous } = req.body;

  if (!tree_id || !quantity || !sponsor_name || !sponsor_email) {
    const trees = TreeSpecies.getAll();
    return res.render('public/sponsor', {
      title: 'Sponsor a Tree — My Pet Tree',
      currentPage: 'sponsor',
      hero: { title: 'Sponsor a Tree', subtitle: 'Choose a tree species and make a lasting impact.' },
      trees,
      error: 'Please fill in all required fields.',
      treeId: tree_id,
    });
  }

  const tree = TreeSpecies.getById(tree_id);
  if (!tree) {
    return res.redirect('/sponsor');
  }

  const qty = parseInt(quantity, 10) || 1;
  const unitPrice = 100;
  const amount = unitPrice * qty;

  res.render('public/checkout', {
    title: 'Complete Your Sponsorship — My Pet Tree',
    currentPage: 'sponsor',
    tree,
    quantity: qty,
    unitPrice,
    amount,
    sponsor: { name: sponsor_name, email: sponsor_email, phone: sponsor_phone, message, is_anonymous },
    currency: 'PHP',
  });
};

exports.processPayment = async (req, res) => {
  const { tree_id, quantity, amount, sponsor_name, sponsor_email, sponsor_phone, message, is_anonymous } = req.body;

  const result = Sponsorship.create({
    sponsor_name, sponsor_email, sponsor_phone,
    tree_species_id: tree_id || null,
    quantity: parseInt(quantity, 10) || 1,
    amount: parseFloat(amount),
    message,
    is_anonymous: is_anonymous === '1',
    status: 'pending',
  });

  const sponsorshipId = result.lastInsertRowid;

  try {
    const paymentResult = await paymentService.createPayment(
      parseFloat(amount),
      'PHP',
      { sponsorship_id: sponsorshipId, description: 'Tree sponsorship' }
    );

    Payment.create({
      sponsorship_id: sponsorshipId,
      amount: parseFloat(amount),
      currency: 'PHP',
      gateway: paymentResult.reference?.startsWith('mock_') ? 'mock' : 'paymongo',
      gateway_reference: paymentResult.reference,
      status: paymentResult.status,
      metadata: paymentResult,
    });

    Sponsorship.updateStatus(sponsorshipId, paymentResult.status);

    if (paymentResult.success) {
      res.redirect(`/sponsor/thank-you/${sponsorshipId}`);
    } else {
      res.redirect(`/sponsor?error=payment_failed`);
    }
  } catch (err) {
    console.error('Payment error:', err);
    Sponsorship.updateStatus(sponsorshipId, 'failed');
    res.redirect(`/sponsor?error=processing_error`);
  }
};

exports.thankYou = (req, res) => {
  const sponsorship = Sponsorship.getById(req.params.id);

  if (!sponsorship) {
    return res.redirect('/sponsor');
  }

  res.render('public/thank-you', {
    title: 'Thank You — My Pet Tree',
    currentPage: 'sponsor',
    sponsorship,
  });
};
