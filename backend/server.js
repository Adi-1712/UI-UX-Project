const express = require('express');
const cors = require('cors');

require('dotenv').config();

const { pool } = require('./db');
const { initDb } = require('./initDb');

const app = express();
const corsOrigin = process.env.CORS_ORIGIN;
app.use(
  cors(
    corsOrigin
      ? {
          origin: corsOrigin.split(',').map((s) => s.trim()).filter(Boolean),
        }
      : undefined
  )
);
app.use(express.json());

async function start() {
  await initDb();

// Users: Register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const result = await pool.query(
      `INSERT INTO users (name, email, phone, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role`,
      [name, email, phone, password, role]
    );
    res.json(result.rows[0]);
  } catch (err) {
    // Unique email violation
    if (err && err.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Users: Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(
      `SELECT id, name, email, role
       FROM users
       WHERE email = $1 AND password = $2`,
      [email, password]
    );
    const row = result.rows[0];
    if (!row) return res.status(401).json({ error: 'Invalid credentials' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listings: Create
app.post('/api/listings', async (req, res) => {
  try {
    const { donor_id, food_name, quantity, pickup_time, expiry_time, location } = req.body;
    const result = await pool.query(
      `INSERT INTO listings (donor_id, food_name, quantity, pickup_time, expiry_time, location)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, status`,
      [donor_id, food_name, quantity, pickup_time, expiry_time, location]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listings: Fetch all available for Recipients
app.get('/api/listings', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT listings.*, users.name as donor_name
       FROM listings
       JOIN users ON listings.donor_id = users.id
       WHERE listings.status = 'pending'`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listings: Fetch all claimed for Volunteers
app.get('/api/listings/claimed', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT listings.*, donor.name as donor_name, recipient.name as recipient_name
      FROM listings
      JOIN users as donor ON listings.donor_id = donor.id
      JOIN users as recipient ON listings.recipient_id = recipient.id
      WHERE listings.status = 'claimed'
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listings: Claim by Recipient
app.put('/api/listings/:id/claim', async (req, res) => {
  try {
    const { recipient_id } = req.body;
    const listingId = req.params.id;
    const result = await pool.query(
      `UPDATE listings
       SET recipient_id = $1, status = 'claimed'
       WHERE id = $2 AND status = 'pending'`,
      [recipient_id, listingId]
    );
    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'Listing not available to claim.' });
    }
    res.json({ message: 'Listing claimed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listings: Fetch by donor
app.get('/api/listings/donor/:donor_id', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM listings WHERE donor_id = $1`, [
      req.params.donor_id,
    ]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tasks: Accept
app.post('/api/tasks', async (req, res) => {
  const client = await pool.connect();
  try {
    const { volunteer_id, listing_id } = req.body;
    await client.query('BEGIN');
    const insertTask = await client.query(
      `INSERT INTO tasks (volunteer_id, listing_id, status)
       VALUES ($1, $2, 'assigned')
       RETURNING id`,
      [volunteer_id, listing_id]
    );
    const newTaskId = insertTask.rows[0].id;
    await client.query(`UPDATE listings SET status = 'accepted' WHERE id = $1`, [listing_id]);
    await client.query('COMMIT');
    res.json({ message: 'Task accepted successfully', task_id: newTaskId });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Tasks: Fetch by volunteer
app.get('/api/tasks/volunteer/:volunteer_id', async (req, res) => {
  try {
    const query = `
      SELECT
        tasks.id as task_id,
        tasks.status as task_status,
        listings.*,
        donor.name as donor_name,
        recipient.name as recipient_name
      FROM tasks
      JOIN listings ON tasks.listing_id = listings.id
      JOIN users as donor ON listings.donor_id = donor.id
      LEFT JOIN users as recipient ON listings.recipient_id = recipient.id
      WHERE tasks.volunteer_id = $1
    `;
    const result = await pool.query(query, [req.params.volunteer_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tasks: Update Status
app.put('/api/tasks/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query(`UPDATE tasks SET status = $1 WHERE id = $2`, [status, req.params.id]);
    res.json({ message: 'Task status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
