const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'foodbridge.db');
const db = new sqlite3.Database(dbPath);

db.run(`ALTER TABLE listings ADD COLUMN recipient_id INTEGER REFERENCES users(id)`, (err) => {
    if (err) {
        if (err.message.includes('duplicate column name')) {
            console.log('Column already exists.');
        } else {
            console.error('Migration error:', err.message);
        }
    } else {
        console.log('Successfully added recipient_id column to listings table.');
    }
    db.close();
});
