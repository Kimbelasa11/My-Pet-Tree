const { Router } = require('express');
const router = Router();

const homeController = require('../controllers/public/homeController');
const aboutController = require('../controllers/public/aboutController');
const howItWorksController = require('../controllers/public/howItWorksController');
const treeController = require('../controllers/public/treeController');
const impactController = require('../controllers/public/impactController');
const newsController = require('../controllers/public/newsController');
const contactController = require('../controllers/public/contactController');
const sponsorController = require('../controllers/public/sponsorController');

router.get('/', homeController.index);
router.get('/about', aboutController.index);
router.get('/how-it-works', howItWorksController.index);
router.get('/trees', treeController.index);
router.get('/trees/:id', treeController.show);
router.get('/impact', impactController.index);
router.get('/news', newsController.index);
router.get('/news/:slug', newsController.show);
router.get('/contact', contactController.index);
router.post('/contact', contactController.submit);
router.get('/sponsor', sponsorController.index);
router.post('/sponsor/checkout', sponsorController.checkout);
router.post('/sponsor/payment', sponsorController.processPayment);
router.get('/sponsor/thank-you/:id', sponsorController.thankYou);

module.exports = router;
