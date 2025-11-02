const https = require('https');
const pool = require('./database/db');

const API_KEY = 'kcOiker0KkZHGhAMdMhSezeWW20jVjbQUnh8MYTQ'; // Replace with your actual key
const BASE_URL = 'https://developer.nps.gov/api/v1';

// Helper function to fetch URL
function fetchURL(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(data); });
    }).on('error', reject);
  });
}

// Fetch all facilities from different endpoints
async function fetchAllFacilities() {
  let allFacilities = [];
  
  // 1. Fetch visitor centers
  console.log('Fetching visitor centers...');
  const vcUrl = `${BASE_URL}/visitorcenters?parkCode=gett&api_key=${API_KEY}`;
  const vcData = JSON.parse(await fetchURL(vcUrl));
  vcData.data.forEach(vc => {
    allFacilities.push({
      name: vc.name,
      type: 'visitor_center',
      description: vc.description,
      latitude: vc.latitude,
      longitude: vc.longitude,
      hours: vc.operatingHours?.[0]?.standardHours?.sunday || null
    });
  });
  console.log(`Got ${vcData.data.length} visitor centers`);
  
  // 2. Fetch parking lots
  console.log('Fetching parking lots...');
  const plUrl = `${BASE_URL}/parkinglots?parkCode=gett&api_key=${API_KEY}`;
  const plData = JSON.parse(await fetchURL(plUrl));
  plData.data.forEach(pl => {
    allFacilities.push({
      name: pl.name || pl.altName,
      type: 'parking',
      description: pl.description,
      latitude: pl.latitude,
      longitude: pl.longitude,
      hours: 'Open 24 hours'
    });
  });
  console.log(`Got ${plData.data.length} parking lots`);
  
  // 3. Fetch campgrounds (if any)
  console.log('Fetching campgrounds...');
  try {
    const cgUrl = `${BASE_URL}/campgrounds?parkCode=gett&api_key=${API_KEY}`;
    const cgData = JSON.parse(await fetchURL(cgUrl));
    cgData.data.forEach(cg => {
      allFacilities.push({
        name: cg.name,
        type: 'campground',
        description: cg.description,
        latitude: parseFloat(cg.latitude),
        longitude: parseFloat(cg.longitude),
        hours: cg.operatingHours?.[0]?.description || null
      });
    });
    console.log(`Got ${cgData.data.length} campgrounds`);
  } catch (err) {
    console.log('No campgrounds found or error fetching');
  }
  
  return allFacilities;
}

// Import facilities into database
async function importFacilities() {
  try {
    console.log('Fetching facilities from NPS API...\n');
    const facilities = await fetchAllFacilities();
    
    console.log(`\nTotal facilities fetched: ${facilities.length}`);
    console.log('Starting import...\n');
    
    // Clear existing facilities
    await pool.query('DELETE FROM facilities');
    
    let imported = 0;
    let skipped = 0;
    
    for (const facility of facilities) {
      // Skip if no coordinates
      if (!facility.latitude || !facility.longitude) {
        skipped++;
        continue;
      }
      
      // Determine accessibility (assume true for visitor centers and most parking)
      const isAccessible = facility.type === 'visitor_center' || 
                          facility.type === 'parking';
      
      await pool.query(`
        INSERT INTO facilities (name, type, is_accessible, hours_open, geom)
        VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326))
      `, [
        facility.name,
        facility.type,
        isAccessible,
        facility.hours || 'Hours vary',
        parseFloat(facility.longitude),
        parseFloat(facility.latitude)
      ]);
      
      imported++;
      console.log(`Imported: ${facility.name} (${facility.type})`);
    }
    
    console.log(`\nImport complete! Imported: ${imported}, Skipped: ${skipped}`);
    process.exit(0);
    
  } catch (err) {
    console.error('Error importing facilities:', err);
    process.exit(1);
  }
}

importFacilities();