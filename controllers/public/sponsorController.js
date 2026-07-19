const TreeSpecies = require('../../models/TreeSpecies');
const Sponsorship = require('../../models/Sponsorship');
const Payment = require('../../models/Payment');
const paymentService = require('../../services/paymentService');
const Settings = require('../../models/Settings');

exports.index = (req, res) => {
  const trees = TreeSpecies.getAll();
  const bgImage = Settings.get('sponsor_bg_image');

  res.render('public/sponsor', {
    title: 'Sponsor a Tree — My Pet Tree',
    currentPage: 'sponsor',
    hero: {
      title: 'Sponsor a Tree',
      subtitle: 'Choose a tree species and make a lasting impact on our planet.',
      image_url: bgImage || '/assets/images/hero-placeholder.svg',
    },
    trees,
    treeId: req.query.tree || null,
    error: null,
  });
};

exports.checkout = (req, res) => {
  const { tree_id, quantity, sponsor_name, sponsor_email, sponsor_phone, message, is_anonymous } = req.body;

  if (!tree_id || !quantity || !sponsor_name || !sponsor_email) {
    const trees = TreeSpecies.getAll();
    const bgImage = Settings.get('sponsor_bg_image');
    return res.render('public/sponsor', {
      title: 'Sponsor a Tree — My Pet Tree',
      currentPage: 'sponsor',
      hero: { title: 'Sponsor a Tree', subtitle: 'Choose a tree species and make a lasting impact.', image_url: bgImage || '/assets/images/hero-placeholder.svg' },
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

  const defaultBg = Settings.get('default_page_banner');
  res.render('public/checkout', {
    title: 'Complete Your Sponsorship — My Pet Tree',
    currentPage: 'sponsor',
    hero: {
      title: 'Complete Your Sponsorship',
      subtitle: 'Review your sponsorship details and proceed to payment.',
      image_url: defaultBg || '/assets/images/hero-placeholder.svg',
    },
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
  const defaultBg = Settings.get('default_page_banner');

  if (!sponsorship) {
    return res.redirect('/sponsor');
  }

  res.render('public/thank-you', {
    title: 'Thank You — My Pet Tree',
    currentPage: 'sponsor',
    hero: {
      title: 'Thank You!',
      subtitle: 'Your sponsorship makes a real difference for reforestation.',
      image_url: defaultBg || '/assets/images/hero-placeholder.svg',
    },
    sponsorship,
  });
};
