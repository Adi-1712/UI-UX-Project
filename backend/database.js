const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'foodbridge.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            phone TEXT,
            password TEXT,
            role TEXT
        )`, (err) => {
            if (err) console.error("Error creating users table", err);
        });

        db.run(`CREATE TABLE IF NOT EXISTS listings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            donor_id INTEGER,
            recipient_id INTEGER,
            food_name TEXT,
            quantity TEXT,
            pickup_time TEXT,
            expiry_time TEXT,
            location TEXT,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (donor_id) REFERENCES users (id),
            FOREIGN KEY (recipient_id) REFERENCES users (id)
        )`, (err) => {
            if (err) console.error("Error creating listings table", err);
        });

        db.run(`CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            volunteer_id INTEGER,
            listing_id INTEGER UNIQUE,
            status TEXT DEFAULT 'assigned',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (volunteer_id) REFERENCES users (id),
            FOREIGN KEY (listing_id) REFERENCES listings (id)
        )`, (err) => {
            if (err) console.error("Error creating tasks table", err);
        });
    }
});

module.exports = db;
