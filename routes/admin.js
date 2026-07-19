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

router.all('/*', auth.protect);

// ─── Dashboard ───────────────────────────────────────────────
router.get('/', dashboardController.index);

// ─── Tree Species ────────────────────────────────────────────
router.get('/trees', treeSpeciesController.index);
router.post('/trees/delete/:id', treeSpeciesController.destroy);

// ─── Urban Planters ──────────────────────────────────────────
router.get('/urban-planters', urbanPlanterController.index);
router.post('/urban-planters/delete/:id', urbanPlanterController.destroy);

// ─── Rural Growers ───────────────────────────────────────────
router.get('/rural-growers', ruralGrowerController.index);
router.post('/rural-growers/delete/:id', ruralGrowerController.destroy);

// ─── Payments (read-only) ────────────────────────────────────
router.get('/payments', paymentController.index);

// ─── News ────────────────────────────────────────────────────
router.get('/news', newsController.index);
router.post('/news/delete/:id', newsController.destroy);

// ─── FAQs ────────────────────────────────────────────────────
router.get('/faqs', faqController.index);
router.post('/faqs/delete/:id', faqController.destroy);

// ─── Website Settings ────────────────────────────────────────
router.get('/settings/hero', settingsController.hero);
router.post('/settings/hero', upload.fields([
  { name: 'hero_bg_image', maxCount: 1 },
  { name: 'hero_foreground_image', maxCount: 1 },
]), settingsController.update);

router.get('/settings/about', settingsController.about);
router.post('/settings/about', upload.fields([
  { name: 'about_hero_bg_image', maxCount: 1 },
]), settingsController.updateAbout);

router.get('/settings/page-banners', settingsController.pageBanners);
router.post('/settings/page-banners', upload.fields([
  { name: 'how_it_works_bg_image', maxCount: 1 },
  { name: 'impact_bg_image', maxCount: 1 },
  { name: 'contact_bg_image', maxCount: 1 },
  { name: 'sponsor_bg_image', maxCount: 1 },
  { name: 'news_bg_image', maxCount: 1 },
  { name: 'trees_bg_image', maxCount: 1 },
  { name: 'default_page_banner', maxCount: 1 },
]), settingsController.updatePageBanners);

// ══════════════════════════════════════════════════════════════
// API Routes (JSON responses for DataTable + Modal CRUD)
// ══════════════════════════════════════════════════════════════

// ─── Dashboard API ───────────────────────────────────────────
router.get('/api/dashboard/stats', dashboardController.apiStats);

// ─── Tree Species API ────────────────────────────────────────
router.get('/api/trees', treeSpeciesController.apiList);
router.get('/api/trees/:id', treeSpeciesController.apiGet);
router.post('/api/trees', upload.single('image'), treeSpeciesController.apiStore);
router.post('/api/trees/:id', upload.single('image'), treeSpeciesController.apiUpdate);
router.post('/api/trees/:id/delete', treeSpeciesController.apiDestroy);

// ─── Urban Planters API ──────────────────────────────────────
router.get('/api/urban-planters/search', urbanPlanterController.search);
router.get('/api/urban-planters', urbanPlanterController.apiList);
router.get('/api/urban-planters/:id', urbanPlanterController.apiGet);
router.post('/api/urban-planters', upload.single('image'), urbanPlanterController.apiStore);
router.post('/api/urban-planters/:id', upload.single('image'), urbanPlanterController.apiUpdate);
router.post('/api/urban-planters/:id/delete', urbanPlanterController.apiDestroy);

// ─── Rural Growers API ───────────────────────────────────────
router.get('/api/rural-growers', ruralGrowerController.apiList);
router.get('/api/rural-growers/:id', ruralGrowerController.apiGet);
router.post('/api/rural-growers', upload.single('image'), ruralGrowerController.apiStore);
router.post('/api/rural-growers/:id', upload.single('image'), ruralGrowerController.apiUpdate);
router.post('/api/rural-growers/:id/delete', ruralGrowerController.apiDestroy);

// ─── News API ────────────────────────────────────────────────
router.get('/api/news', newsController.apiList);
router.get('/api/news/:id', newsController.apiGet);
router.post('/api/news', upload.single('image'), newsController.apiStore);
router.post('/api/news/:id', upload.single('image'), newsController.apiUpdate);
router.post('/api/news/:id/delete', newsController.apiDestroy);

// ─── FAQs API ────────────────────────────────────────────────
router.get('/api/faqs', faqController.apiList);
router.get('/api/faqs/:id', faqController.apiGet);
router.post('/api/faqs', faqController.apiStore);
router.post('/api/faqs/:id', faqController.apiUpdate);
router.post('/api/faqs/:id/delete', faqController.apiDestroy);

// ─── Payments API ────────────────────────────────────────────
router.get('/api/payments', paymentController.apiList);

module.exports = router;