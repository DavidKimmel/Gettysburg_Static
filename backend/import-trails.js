const fs = require('fs');
const pool = require('./database/db');

// Read the GeoJSON file
const geojsonPath = 'C:/Users/kimme/Downloads/NPS_-_Trails_-_Geographic_Coordinate_System.geojson';
const data = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));

// Filter for Gettysburg trails
const gettysburgTrails = data.features.filter(feature => {
  const props = feature.properties;
  return props.UNITCODE === 'GETT';
});

console.log(`Found ${gettysburgTrails.length} Gettysburg trails`);

// Import into database
async function importTrails() {
  try {
    // Clear existing trails
    await pool.query('DELETE FROM trail_monuments');
    await pool.query('DELETE FROM trails');
    
    let imported = 0;
    let skipped = 0;
    
    for (const feature of gettysburgTrails) {
      const props = feature.properties;
      const geom = feature.geometry;
      
      // Skip if no geometry
      if (!geom) {
        skipped++;
        continue;
      }
      
      // Convert GeoJSON geometry to WKT for PostGIS
      const wkt = geomToWKT(geom);
      
      if (!wkt) {
        skipped++;
        continue;
      }
      
      // Determine if accessible based on surface type
      const isAccessible = props.TRLSURFACE && 
                          (props.TRLSURFACE.toLowerCase().includes('paved') || 
                           props.TRLSURFACE.toLowerCase().includes('asphalt'));
      
      await pool.query(`
        INSERT INTO trails (name, length_miles, surface_type, is_accessible, difficulty, geom)
        VALUES ($1, $2, $3, $4, $5, ST_GeomFromText($6, 4326))
      `, [
        props.TRLNAME || 'Unnamed Trail',
        props.Shape_Length ? props.Shape_Length / 5280 : null, // Convert feet to miles
        props.TRLSURFACE || 'unknown',
        isAccessible,
        props.TRLCLASS || 'unknown',
        wkt
      ]);
      
      imported++;
      console.log(`Imported: ${props.TRLNAME || 'Unnamed'}`);
    }
    
    console.log(`\nImport complete! Imported: ${imported}, Skipped: ${skipped}`);
    process.exit(0);
  } catch (err) {
    console.error('Error importing trails:', err);
    process.exit(1);
  }
}

// Convert GeoJSON geometry to WKT
function geomToWKT(geom) {
  if (geom.type === 'LineString') {
    const coords = geom.coordinates.map(c => `${c[0]} ${c[1]}`).join(', ');
    return `LINESTRING(${coords})`;
  } else if (geom.type === 'MultiLineString') {
    // Convert MultiLineString to LineString by taking first line
    // Or convert to proper MultiLineString WKT
    const lines = geom.coordinates.map(line => {
      const coords = line.map(c => `${c[0]} ${c[1]}`).join(', ');
      return `(${coords})`;
    }).join(', ');
    return `MULTILINESTRING(${lines})`;
  }
  return null;
}

importTrails();