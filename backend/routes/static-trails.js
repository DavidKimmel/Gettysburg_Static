const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to static JSON file
const dataPath = path.join(__dirname, '..', 'data', 'static', 'trails.json');

// GET all trails as GeoJSON
router.get('/', (req, res) => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    const geojson = JSON.parse(data);
    res.json(geojson);
  } catch (err) {
    console.error('Error reading trails data:', err);
    res.status(500).json({ error: 'Failed to load trails data' });
  }
});

module.exports = router;
