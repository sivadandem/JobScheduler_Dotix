const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'job_scheduler',
  waitForConnections: true,
  connectionLimit: 10
});

// Creating Database automatically than doing manually

const initDB = async () => {
  try {
    // Connect without DB first if in case database is already in Mysql 
    const noDbPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    // Create database if not exists then the database will be created
    await noDbPool.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'job_scheduler'}`);
    console.log('✅ Database created/verified');

    // Create jobs table, instead of manually
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        taskName VARCHAR(255) NOT NULL,
        payload JSON,
        priority VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_priority (priority)
      )
    `);
    console.log('✅ Jobs table ready');

    noDbPool.end();

  } catch (error) {
    console.error('❌ file(databaseconfig) -> DB init failed:', error.message);
  }
};


initDB();

module.exports = pool;
