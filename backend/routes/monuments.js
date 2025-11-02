const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// GET all monuments as GeoJSON
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
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
    
    const geojson = {
      type: 'FeatureCollection',
      features: result.rows.map(row => ({
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
    
    res.json(geojson);
  } catch (err) {
    console.error('Error fetching monuments:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;