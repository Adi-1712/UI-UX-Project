const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'foodbridge.db');
const db = new sqlite3.Database(dbPath);

const dummyUsers = [
  { name: 'Admin 1', email: 'admin1@example.com', phone: '111-111-1111', password: 'password', role: 'Donor' },
  { name: 'Admin 2', email: 'admin2@example.com', phone: '222-222-2222', password: 'password', role: 'Receiver' },
  { name: 'Admin 3', email: 'admin3@example.com', phone: '333-333-3333', password: 'password', role: 'Volunteer' }
];

db.serialize(() => {
  const stmt = db.prepare(`INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)`);
  
  dummyUsers.forEach(user => {
    stmt.run(user.name, user.email, user.phone, user.password, user.role, (err) => {
      if (err) {
        // Ignore unique constraint errors if running multiple times
        if (err.message.includes('UNIQUE constraint failed')) {
           console.log(`User ${user.email} already exists.`);
        } else {
           console.error('Error inserting user:', err);
        }
      } else {
        console.log(`Added ${user.role}: ${user.name} (${user.email})`);
      }
    });
  });
  
  stmt.finalize(() => {
    db.close((err) => {
      if (err) console.error(err.message);
      else console.log('Database connection closed.');
    });
  });
});
