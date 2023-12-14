const mysql = require('mysql2');
const dbConfig = require('../../config/dbConfig')

const pool = mysql.createPool(dbConfig);
pool.getConnection(async (err, connection) => {
  try {
    console.log('Database connected successfully');
    connection.release();
  } catch (err) {
    console.error('connection failed:', err);
  }
});

module.exports = pool;