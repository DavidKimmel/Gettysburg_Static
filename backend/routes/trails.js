const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// GET all trails as GeoJSON
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, name, length_miles, surface_type, 
        is_accessible, difficulty,
        ST_AsGeoJSON(geom)::json as geometry
      FROM trails
      ORDER BY name
    `);
    
    const geojson = {
      type: 'FeatureCollection',
      features: result.rows.map(row => ({
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
    
    res.json(geojson);
  } catch (err) {
    console.error('Error fetching trails:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;