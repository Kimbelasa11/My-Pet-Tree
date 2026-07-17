const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const { initDatabase } = require('./database/connection');
const config = require('./config');
const seedService = require('./services/seedService');

const app = express();

// ─── Database (async init) ─────────────────────────────────────
let serverStarted = false;

async function start() {
  await initDatabase();

  if (process.argv.includes('--seed')) {
    seedService.seed();
  }

  if (!serverStarted) {
    serverStarted = true;
    startServer();
  }
}

start().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// ─── Security Middleware ──────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: config.isDev ? '*' : false,
}));

// ─── Rate Limiting ────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
if (config.isProd) {
  app.use(limiter);
}

// ─── Cookie Parser ────────────────────────────────────────────
app.use(cookieParser());

// ─── Body Parsing ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── View Engine ──────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/public');

// ─── Static Files ─────────────────────────────────────────────
app.use(express.static(path.resolve(__dirname, 'public'), {
  maxAge: config.isProd ? '1y' : 0,
  etag: true,
}));

// ─── Make config and req available to all views ──────────────
app.locals.config = config;
app.use((req, res, next) => {
  res.locals.req = req;
  res.locals.currentPage = '';
  next();
});

// ─── Routes ───────────────────────────────────────────────────
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

// ─── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('public/404', {
    title: 'Page Not Found — My Pet Tree',
    currentPage: '404',
  });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack || err.message || err);
  const status = err.status || 500;
  res.status(status).json({
    error: config.isDev ? err.message : 'Internal server error',
  });
});

function startServer() {
  app.listen(config.port, () => {
    console.log(`My Pet Tree running at http://localhost:${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
  });
}

// Start is called from the async init above
// If DB init already happened, start immediately
if (serverStarted) startServer();

module.exports = app;
