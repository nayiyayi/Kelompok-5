const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'combo_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

const promisePool = pool.promise();

promisePool.getConnection()
  .then(conn => {
    console.log(`✅ MySQL Connected: ${process.env.DB_NAME || 'combo_db'}`);
    conn.release();
  })
  .catch(err => {
    console.error('❌ MySQL Connection Error:', err.message);
    console.error('   Pastikan MySQL berjalan dan database combo_db sudah dibuat.');
  });

module.exports = promisePool;
