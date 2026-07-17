const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');
const config = require('../config');

let db = null;
let SQL = null;

async function initDatabase() {
  SQL = await initSqlJs();

  const dbPath = config.db.path;
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON');

  initSchema();

  return db;
}

function initSchema() {
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.run(schema);
}

function saveDatabase() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(config.db.path, buffer);
}

function getDb() {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.');
  return db;
}

function closeDatabase() {
  if (db) {
    saveDatabase();
    db.close();
    db = null;
  }
}

function run(sql, params = []) {
  const d = getDb();
  d.run(sql, params);
  saveDatabase();
  return { changes: d.getRowsModified(), lastInsertRowid: getLastInsertId(d) };
}

function get(sql, params = []) {
  const d = getDb();
  const stmt = d.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const row = stmt.step() ? stmt.getAsObject() : undefined;
  stmt.free();
  return row;
}

function all(sql, params = []) {
  const d = getDb();
  const stmt = d.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function getLastInsertId(database) {
  const stmt = database.prepare('SELECT last_insert_rowid() as id');
  const result = stmt.step() ? stmt.getAsObject() : { id: 0 };
  stmt.free();
  return result.id;
}

function transaction(fn) {
  const d = getDb();
  d.run('BEGIN TRANSACTION');
  try {
    fn();
    d.run('COMMIT');
    saveDatabase();
  } catch (err) {
    d.run('ROLLBACK');
    throw err;
  }
}

module.exports = { initDatabase, closeDatabase, saveDatabase, run, get, all, transaction };
