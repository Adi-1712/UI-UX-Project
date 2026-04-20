const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('Missing DATABASE_URL (set it in backend/.env or in hosting env vars)');
}

// Render provides DATABASE_URL; SSL is typically required in hosted PG.
const pool = new Pool({
  connectionString,
  ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
});

module.exports = { pool };

