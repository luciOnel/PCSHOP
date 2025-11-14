const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'techstore.db');

const db = new sqlite3.Database(DB_PATH);

const initDatabase = () => {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS login_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                email TEXT NOT NULL,
                success INTEGER NOT NULL CHECK (success IN (0, 1)),
                details TEXT,
                login_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )
        `);
    });
};

const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
};

const createUser = ({ name, email, passwordHash }) => {
    return new Promise((resolve, reject) => {
        const stmt = `
            INSERT INTO users (name, email, password_hash)
            VALUES (?, ?, ?)
        `;

        db.run(stmt, [name, email, passwordHash], function (err) {
            if (err) return reject(err);

            resolve({
                id: this.lastID,
                name,
                email,
                created_at: new Date().toISOString()
            });
        });
    });
};

const recordLoginAttempt = ({ userId = null, email, success, details = null }) => {
    return new Promise((resolve, reject) => {
        const stmt = `
            INSERT INTO login_history (user_id, email, success, details)
            VALUES (?, ?, ?, ?)
        `;

        db.run(stmt, [userId, email, success ? 1 : 0, details], function (err) {
            if (err) return reject(err);
            resolve(this.lastID);
        });
    });
};

initDatabase();

module.exports = {
    db,
    findUserByEmail,
    createUser,
    recordLoginAttempt
};

