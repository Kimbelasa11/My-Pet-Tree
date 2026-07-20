-- ============================================================
-- My Pet Tree — Database Schema
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  must_change_password INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT (datetime('now')),
  updated_at DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tree_species (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  scientific_name TEXT,
  description TEXT,
  benefits TEXT,
  native_region TEXT,
  growth_rate TEXT,
  max_height TEXT,
  climate_zone TEXT,
  image_url TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT (datetime('now')),
  updated_at DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS urban_planters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  location TEXT,
  organization TEXT,
  bio TEXT,
  image_url TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT (datetime('now')),
  updated_at DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS rural_growers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  location TEXT,
  farm_size TEXT,
  bio TEXT,
  image_url TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT (datetime('now')),
  updated_at DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS rural_grower_urban_planters (
  rural_grower_id INTEGER NOT NULL,
  urban_planter_id INTEGER NOT NULL,
  PRIMARY KEY (rural_grower_id, urban_planter_id),
  FOREIGN KEY (rural_grower_id) REFERENCES rural_growers(id) ON DELETE CASCADE,
  FOREIGN KEY (urban_planter_id) REFERENCES urban_planters(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  body TEXT,
  image_url TEXT,
  author TEXT,
  is_published INTEGER NOT NULL DEFAULT 0,
  published_at DATETIME,
  created_at DATETIME DEFAULT (datetime('now')),
  updated_at DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT (datetime('now')),
  updated_at DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sponsorships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sponsor_name TEXT NOT NULL,
  sponsor_email TEXT NOT NULL,
  sponsor_phone TEXT,
  tree_species_id INTEGER,
  quantity INTEGER NOT NULL DEFAULT 1,
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PHP',
  message TEXT,
  is_anonymous INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_reference TEXT,
  created_at DATETIME DEFAULT (datetime('now')),
  updated_at DATETIME DEFAULT (datetime('now')),
  FOREIGN KEY (tree_species_id) REFERENCES tree_species(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sponsorship_id INTEGER,
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PHP',
  gateway TEXT NOT NULL DEFAULT 'mock',
  gateway_reference TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  metadata TEXT,
  created_at DATETIME DEFAULT (datetime('now')),
  updated_at DATETIME DEFAULT (datetime('now')),
  FOREIGN KEY (sponsorship_id) REFERENCES sponsorships(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tracking_updates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rural_grower_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  update_date DATE NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at DATETIME DEFAULT (datetime('now')),
  updated_at DATETIME DEFAULT (datetime('now')),
  FOREIGN KEY (rural_grower_id) REFERENCES rural_growers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tracking_update_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tracking_update_id INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT (datetime('now')),
  FOREIGN KEY (tracking_update_id) REFERENCES tracking_updates(id) ON DELETE CASCADE
);
