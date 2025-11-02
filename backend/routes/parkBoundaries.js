const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// GET park boundaries as GeoJSON
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, name, boundary_type,
        ST_AsGeoJSON(geom)::json as geometry
      FROM park_boundaries
    `);
    
    const geojson = {
      type: 'FeatureCollection',
      features: result.rows.map(row => ({
        type: 'Feature',
        properties: {
          id: row.id,
          name: row.name,
          boundary_type: row.boundary_type
        },
        geometry: row.geometry
      }))
    };
    
    res.json(geojson);
  } catch (err) {
    console.error('Error fetching park boundaries:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;