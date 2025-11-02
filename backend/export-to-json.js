/**
 * Export Database to Static JSON Files
 *
 * Run this script ONCE to export all your database data to JSON files.
 * After running, you can remove the PostgreSQL dependency.
 *
 * Usage: node backend/export-to-json.js
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
});

const dataDir = path.join(__dirname, 'data', 'static');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

async function exportToJSON() {
  console.log('🚀 Starting database export to JSON files...\n');

  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully\n');

    // Export Monuments
    console.log('📍 Exporting monuments...');
    const monumentsResult = await pool.query(`
      SELECT
        id,
        name,
        description,
        dedication_date,
        accessibility_rating,
        photo_url,
        ST_AsGeoJSON(geom)::json as geometry
      FROM monuments
      ORDER BY name
    `);

    const monumentsGeoJSON = {
      type: 'FeatureCollection',
      features: monumentsResult.rows.map(row => ({
        type: 'Feature',
        properties: {
          id: row.id,
          name: row.name,
          description: row.description,
          dedication_date: row.dedication_date,
          accessibility_rating: row.accessibility_rating,
          photo_url: row.photo_url
        },
        geometry: row.geometry
      }))
    };

    fs.writeFileSync(
      path.join(dataDir, 'monuments.json'),
      JSON.stringify(monumentsGeoJSON, null, 2)
    );
    console.log(`✅ Exported ${monumentsResult.rows.length} monuments\n`);

    // Export Trails
    console.log('🥾 Exporting trails...');
    const trailsResult = await pool.query(`
      SELECT
        id, name, length_miles, surface_type,
        is_accessible, difficulty,
        ST_AsGeoJSON(geom)::json as geometry
      FROM trails
      ORDER BY name
    `);

    const trailsGeoJSON = {
      type: 'FeatureCollection',
      features: trailsResult.rows.map(row => ({
        type: 'Feature',
        properties: {
          id: row.id,
          name: row.name,
          length_miles: row.length_miles,
          surface_type: row.surface_type,
          is_accessible: row.is_accessible,
          difficulty: row.difficulty
        },
        geometry: row.geometry
      }))
    };

    fs.writeFileSync(
      path.join(dataDir, 'trails.json'),
      JSON.stringify(trailsGeoJSON, null, 2)
    );
    console.log(`✅ Exported ${trailsResult.rows.length} trails\n`);

    // Export Facilities
    console.log('🅿️ Exporting facilities...');
    const facilitiesResult = await pool.query(`
      SELECT
        id, name, type, is_accessible, hours_open,
        ST_AsGeoJSON(geom)::json as geometry
      FROM facilities
      ORDER BY name
    `);

    const facilitiesGeoJSON = {
      type: 'FeatureCollection',
      features: facilitiesResult.rows.map(row => ({
        type: 'Feature',
        properties: {
          id: row.id,
          name: row.name,
          type: row.type,
          is_accessible: row.is_accessible,
          hours_open: row.hours_open
        },
        geometry: row.geometry
      }))
    };

    fs.writeFileSync(
      path.join(dataDir, 'facilities.json'),
      JSON.stringify(facilitiesGeoJSON, null, 2)
    );
    console.log(`✅ Exported ${facilitiesResult.rows.length} facilities\n`);

    // Export Battle Sites
    console.log('⚔️ Exporting battle sites...');
    const battleSitesResult = await pool.query(`
      SELECT
        id, name, battle_date, description, casualties,
        ST_AsGeoJSON(geom)::json as geometry
      FROM battle_sites
      ORDER BY name
    `);

    const battleSitesGeoJSON = {
      type: 'FeatureCollection',
      features: battleSitesResult.rows.map(row => ({
        type: 'Feature',
        properties: {
          id: row.id,
          name: row.name,
          battle_date: row.battle_date,
          description: row.description,
          casualties: row.casualties
        },
        geometry: row.geometry
      }))
    };

    fs.writeFileSync(
      path.join(dataDir, 'battle-sites.json'),
      JSON.stringify(battleSitesGeoJSON, null, 2)
    );
    console.log(`✅ Exported ${battleSitesResult.rows.length} battle sites\n`);

    // Export Park Boundaries
    console.log('🟢 Exporting park boundaries...');
    const boundariesResult = await pool.query(`
      SELECT
        id, name, boundary_type,
        ST_AsGeoJSON(geom)::json as geometry
      FROM park_boundaries
      ORDER BY name
    `);

    const boundariesGeoJSON = {
      type: 'FeatureCollection',
      features: boundariesResult.rows.map(row => ({
        type: 'Feature',
        properties: {
          id: row.id,
          name: row.name,
          boundary_type: row.boundary_type
        },
        geometry: row.geometry
      }))
    };

    fs.writeFileSync(
      path.join(dataDir, 'park-boundaries.json'),
      JSON.stringify(boundariesGeoJSON, null, 2)
    );
    console.log(`✅ Exported ${boundariesResult.rows.length} park boundaries\n`);

    // Export User Submissions (if any)
    console.log('📝 Exporting user submissions...');
    const submissionsResult = await pool.query(`
      SELECT
        us.id, us.monument_id, us.user_name,
        us.story_text, us.photo_url, us.submitted_at,
        m.name as monument_name,
        ST_AsGeoJSON(us.geom)::json as geometry
      FROM user_submissions us
      LEFT JOIN monuments m ON us.monument_id = m.id
      ORDER BY us.submitted_at DESC
    `);

    const submissionsGeoJSON = {
      type: 'FeatureCollection',
      features: submissionsResult.rows.map(row => ({
        type: 'Feature',
        properties: {
          id: row.id,
          monument_id: row.monument_id,
          monument_name: row.monument_name,
          user_name: row.user_name,
          story_text: row.story_text,
          photo_url: row.photo_url,
          submitted_at: row.submitted_at
        },
        geometry: row.geometry
      }))
    };

    fs.writeFileSync(
      path.join(dataDir, 'user-submissions.json'),
      JSON.stringify(submissionsGeoJSON, null, 2)
    );
    console.log(`✅ Exported ${submissionsResult.rows.length} user submissions\n`);

    console.log('🎉 Export complete!\n');
    console.log('📂 Files created in:', dataDir);
    console.log('   - monuments.json');
    console.log('   - trails.json');
    console.log('   - facilities.json');
    console.log('   - battle-sites.json');
    console.log('   - park-boundaries.json');
    console.log('   - user-submissions.json\n');

  } catch (error) {
    console.error('❌ Error exporting data:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run export
exportToJSON();
