const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// GET all battle sites as GeoJSON
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, name, battle_date, description, casualties,
        ST_AsGeoJSON(geom)::json as geometry
      FROM battle_sites
      ORDER BY battle_date
    `);
    
    const geojson = {
      type: 'FeatureCollection',
      features: result.rows.map(row => ({
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
    
    res.json(geojson);
  } catch (err) {
    console.error('Error fetching battle sites:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;