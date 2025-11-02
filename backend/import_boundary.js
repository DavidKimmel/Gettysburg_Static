const fs = require('fs');
const pool = require('./database/db');

// Path to your downloaded GeoJSON file
const geojsonPath = 'C:/Users/kimme/Downloads/export.geojson';

console.log('Starting boundary import...');
console.log('Looking for file:', geojsonPath);

// Check if file exists
if (!fs.existsSync(geojsonPath)) {
  console.error('ERROR: File not found at:', geojsonPath);
  console.log('Please check your Downloads folder and update the path');
  process.exit(1);
}

// Read the GeoJSON file
let data;
try {
  const fileContent = fs.readFileSync(geojsonPath, 'utf8');
  console.log('File read successfully, size:', fileContent.length, 'bytes');
  data = JSON.parse(fileContent);
  console.log('JSON parsed successfully');
} catch (err) {
  console.error('ERROR reading/parsing file:', err.message);
  process.exit(1);
}

console.log('Found', data.features.length, 'boundary features');
console.log('First feature type:', data.features[0]?.geometry?.type);

async function importBoundary() {
  try {
    console.log('Connecting to database...');
    
    // Create table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS park_boundaries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        boundary_type VARCHAR(100),
        geom GEOMETRY(Geometry, 4326)
      );
      
      CREATE INDEX IF NOT EXISTS idx_park_boundaries_geom 
      ON park_boundaries USING GIST(geom);
    `);
    
    console.log('Park boundaries table ready');
    
    // Clear existing boundaries
    await pool.query('DELETE FROM park_boundaries');
    console.log('Cleared existing boundaries');
    
    for (const feature of data.features) {
      const props = feature.properties;
      const geom = feature.geometry;
      
      console.log('Processing feature:', props.name || 'Unnamed');
      console.log('Geometry type:', geom.type);
      
      // Convert GeoJSON geometry to WKT
      const wkt = geomToWKT(geom);
      
      if (!wkt) {
        console.log('WARNING: Could not convert geometry to WKT');
        continue;
      }
      
      console.log('WKT length:', wkt.length);
      
      await pool.query(`
        INSERT INTO park_boundaries (name, boundary_type, geom)
        VALUES ($1, $2, ST_GeomFromText($3, 4326))
      `, [
        props.name || 'Gettysburg National Military Park',
        props.boundary || 'national_park',
        wkt
      ]);
      
      console.log('✓ Imported:', props.name || 'Park Boundary');
    }
    
    console.log('\n✓ Boundary import complete!');
    process.exit(0);
    
  } catch (err) {
    console.error('ERROR during import:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  }
}

// Convert GeoJSON geometry to WKT
function geomToWKT(geom) {
  if (geom.type === 'Polygon') {
    const rings = geom.coordinates.map(ring => {
      const coords = ring.map(c => `${c[0]} ${c[1]}`).join(', ');
      return `(${coords})`;
    }).join(', ');
    return `POLYGON(${rings})`;
  } else if (geom.type === 'MultiPolygon') {
    const polygons = geom.coordinates.map(polygon => {
      const rings = polygon.map(ring => {
        const coords = ring.map(c => `${c[0]} ${c[1]}`).join(', ');
        return `(${coords})`;
      }).join(', ');
      return `(${rings})`;
    }).join(', ');
    return `MULTIPOLYGON(${polygons})`;
  }
  return null;
}

importBoundary();