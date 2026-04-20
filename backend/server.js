const express = require('express');
const cors = require('cors');
const db = require('./database');

require('dotenv').config();

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

// Users: Register
app.post('/api/register', (req, res) => {
    const { name, email, phone, password, role } = req.body;
    db.run(
        `INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)`,
        [name, email, phone, password, role],
        function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json({ id: this.lastID, name, email, role });
        }
    );
});

// Users: Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT id, name, email, role FROM users WHERE email = ? AND password = ?`, [email, password], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(401).json({ error: "Invalid credentials" });
        res.json(row);
    });
});

// Listings: Create
app.post('/api/listings', (req, res) => {
    const { donor_id, food_name, quantity, pickup_time, expiry_time, location } = req.body;
    db.run(
        `INSERT INTO listings (donor_id, food_name, quantity, pickup_time, expiry_time, location) VALUES (?, ?, ?, ?, ?, ?)`,
        [donor_id, food_name, quantity, pickup_time, expiry_time, location],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ id: this.lastID, status: 'pending' });
        }
    );
});

// Listings: Fetch all available for Recipients
app.get('/api/listings', (req, res) => {
    db.all(`SELECT listings.*, users.name as donor_name FROM listings JOIN users ON listings.donor_id = users.id WHERE listings.status = 'pending'`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Listings: Fetch all claimed for Volunteers
app.get('/api/listings/claimed', (req, res) => {
    db.all(`
        SELECT listings.*, donor.name as donor_name, recipient.name as recipient_name 
        FROM listings 
        JOIN users as donor ON listings.donor_id = donor.id 
        JOIN users as recipient ON listings.recipient_id = recipient.id 
        WHERE listings.status = 'claimed'
    `, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Listings: Claim by Recipient
app.put('/api/listings/:id/claim', (req, res) => {
    const { recipient_id } = req.body;
    db.run(
        `UPDATE listings SET recipient_id = ?, status = 'claimed' WHERE id = ? AND status = 'pending'`,
        [recipient_id, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(400).json({ error: "Listing not available to claim." });
            res.json({ message: "Listing claimed successfully" });
        }
    );
});

// Listings: Fetch by donor
app.get('/api/listings/donor/:donor_id', (req, res) => {
    db.all(`SELECT * FROM listings WHERE donor_id = ?`, [req.params.donor_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Tasks: Accept
app.post('/api/tasks', (req, res) => {
    const { volunteer_id, listing_id } = req.body;
    
    db.serialize(() => {
        db.run(`BEGIN TRANSACTION`);
        db.run(`INSERT INTO tasks (volunteer_id, listing_id, status) VALUES (?, ?, 'assigned')`, [volunteer_id, listing_id], function(err) {
            if (err) {
                db.run(`ROLLBACK`);
                return res.status(500).json({ error: err.message });
            }
            const newTaskId = this.lastID;
            db.run(`UPDATE listings SET status = 'accepted' WHERE id = ?`, [listing_id], function(err) {
                if (err) {
                    db.run(`ROLLBACK`);
                    return res.status(500).json({ error: err.message });
                }
                db.run(`COMMIT`, function() {
                    res.json({ message: "Task accepted successfully", task_id: newTaskId });
                });
            });
        });
    });
});

// Tasks: Fetch by volunteer
app.get('/api/tasks/volunteer/:volunteer_id', (req, res) => {
    const query = `
        SELECT tasks.id as task_id, tasks.status as task_status, listings.*, donor.name as donor_name, recipient.name as recipient_name 
        FROM tasks 
        JOIN listings ON tasks.listing_id = listings.id 
        JOIN users as donor ON listings.donor_id = donor.id
        LEFT JOIN users as recipient ON listings.recipient_id = recipient.id
        WHERE tasks.volunteer_id = ?
    `;
    db.all(query, [req.params.volunteer_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Tasks: Update Status
app.put('/api/tasks/:id/status', (req, res) => {
    const { status } = req.body;
    db.run(`UPDATE tasks SET status = ? WHERE id = ?`, [status, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Task status updated" });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
