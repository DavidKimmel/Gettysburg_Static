/**
 * Database Initialization Script for Render.com
 *
 * This script sets up the database schema and imports all data for production.
 * Run this ONCE after deploying to Render to populate the database.
 *
 * Usage:
 *   node backend/database/init-production-db.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...');
  console.log(`📍 Connecting to: ${process.env.DB_HOST}/${process.env.DB_NAME}`);

  try {
    // Test connection
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully at:', testResult.rows[0].now);

    // Enable PostGIS extension
    console.log('📦 Enabling PostGIS extension...');
    await pool.query('CREATE EXTENSION IF NOT EXISTS postgis');
    console.log('✅ PostGIS extension enabled');

    // Read and execute schema file
    console.log('📋 Creating database schema...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schemaSql);
    console.log('✅ Database schema created successfully');

    console.log('\n🎉 Database initialization complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Import your data using the import scripts:');
    console.log('   - node backend/import_places.js');
    console.log('   - node backend/import_facilities.js');
    console.log('   - node backend/import-trails.js');
    console.log('   - node backend/import_boundary.js');
    console.log('\n2. Or manually import data through the Render dashboard');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run initialization
initializeDatabase();
