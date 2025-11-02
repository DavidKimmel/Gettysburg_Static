const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// GET all facilities as GeoJSON
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, name, type, is_accessible, hours_open,
        ST_AsGeoJSON(geom)::json as geometry
      FROM facilities
      ORDER BY name
    `);
    
    const geojson = {
      type: 'FeatureCollection',
      features: result.rows.map(row => ({
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
    
    res.json(geojson);
  } catch (err) {
    console.error('Error fetching facilities:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;