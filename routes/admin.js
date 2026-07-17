const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const router = Router();

const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
});
const authController = require('../controllers/admin/authController');
const dashboardController = require('../controllers/admin/dashboardController');
const contentController = require('../controllers/admin/contentController');
const treeSpeciesController = require('../controllers/admin/treeSpeciesController');
const urbanPlanterController = require('../controllers/admin/urbanPlanterController');
const ruralGrowerController = require('../controllers/admin/ruralGrowerController');
const paymentController = require('../controllers/admin/paymentController');
const newsController = require('../controllers/admin/newsController');
const faqController = require('../controllers/admin/faqController');
const settingsController = require('../controllers/admin/settingsController');

// ─── Auth routes (no auth middleware) ─────────────────────────
router.get('/login', authController.loginForm);
router.post('/login', loginLimiter, authController.login);
router.get('/logout', authController.logout);

// ─── Protected routes (admin layout + auth) ───────────────────
router.use((req, res, next) => {
  res.locals.layout = 'layouts/admin';
  next();
});

// ─── Protected routes ─────────────────────────────────────────
router.all('/*', auth.protect);

// Dashboard
router.get('/', dashboardController.index);

// Content
router.get('/content', contentController.index);
router.get('/content/edit/:page/:section', contentController.edit);
router.post('/content/edit/:page/:section', upload.single('image'), contentController.update);

// Tree Species
router.get('/trees', treeSpeciesController.index);
router.get('/trees/create', treeSpeciesController.create);
router.post('/trees/create', upload.single('image'), treeSpeciesController.store);
router.get('/trees/edit/:id', treeSpeciesController.edit);
router.post('/trees/edit/:id', upload.single('image'), treeSpeciesController.update);
router.post('/trees/delete/:id', treeSpeciesController.destroy);

// Urban Planters
router.get('/urban-planters', urbanPlanterController.index);
router.get('/urban-planters/create', urbanPlanterController.create);
router.post('/urban-planters/create', upload.single('image'), urbanPlanterController.store);
router.get('/urban-planters/edit/:id', urbanPlanterController.edit);
router.post('/urban-planters/edit/:id', upload.single('image'), urbanPlanterController.update);
router.post('/urban-planters/delete/:id', urbanPlanterController.destroy);

// Search endpoint for Selectize
router.get('/api/urban-planters/search', urbanPlanterController.search);

// Rural Growers
router.get('/rural-growers', ruralGrowerController.index);
router.get('/rural-growers/create', ruralGrowerController.create);
router.post('/rural-growers/create', upload.single('image'), ruralGrowerController.store);
router.get('/rural-growers/edit/:id', ruralGrowerController.edit);
router.post('/rural-growers/edit/:id', upload.single('image'), ruralGrowerController.update);
router.post('/rural-growers/delete/:id', ruralGrowerController.destroy);

// Payments (read-only)
router.get('/payments', paymentController.index);

// News
router.get('/news', newsController.index);
router.get('/news/create', newsController.create);
router.post('/news/create', upload.single('image'), newsController.store);
router.get('/news/edit/:id', newsController.edit);
router.post('/news/edit/:id', upload.single('image'), newsController.update);
router.post('/news/delete/:id', newsController.destroy);

// Website Settings
router.get('/settings/hero', settingsController.hero);
router.post('/settings/hero', upload.fields([
  { name: 'hero_bg_image', maxCount: 1 },
  { name: 'hero_foreground_image', maxCount: 1 },
]), settingsController.update);

// FAQs
router.get('/faqs', faqController.index);
router.get('/faqs/create', faqController.create);
router.post('/faqs/create', faqController.store);
router.get('/faqs/edit/:id', faqController.edit);
router.post('/faqs/edit/:id', faqController.update);
router.post('/faqs/delete/:id', faqController.destroy);

module.exports = router;
