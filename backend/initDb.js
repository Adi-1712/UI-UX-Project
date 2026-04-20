const { pool } = require('./db');

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      phone TEXT,
      password TEXT,
      role TEXT
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS listings (
      id SERIAL PRIMARY KEY,
      donor_id INTEGER REFERENCES users(id),
      recipient_id INTEGER REFERENCES users(id),
      food_name TEXT,
      quantity TEXT,
      pickup_time TEXT,
      expiry_time TEXT,
      location TEXT,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      volunteer_id INTEGER REFERENCES users(id),
      listing_id INTEGER UNIQUE REFERENCES listings(id),
      status TEXT DEFAULT 'assigned',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

module.exports = { initDb };

