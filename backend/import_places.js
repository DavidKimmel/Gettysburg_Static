const https = require('https');
const pool = require('./database/db');

const API_KEY = 'kcOiker0KkZHGhAMdMhSezeWW20jVjbQUnh8MYTQ'; // key
const BASE_URL = 'https://developer.nps.gov/api/v1/places';

// Fetch all places (may need multiple requests due to pagination)
async function fetchAllPlaces() {
  let allPlaces = [];
  let start = 0;
  const limit = 50;
  
  while (true) {
    const url = `${BASE_URL}?parkCode=gett&limit=${limit}&start=${start}&api_key=${API_KEY}`;
    
    console.log(`Fetching places ${start} to ${start + limit}...`);
    
    const data = await fetchURL(url);
    const places = JSON.parse(data);
    
    allPlaces = allPlaces.concat(places.data);
    
    console.log(`Got ${places.data.length} places. Total so far: ${allPlaces.length}`);
    
    // Check if we've gotten all places
    if (allPlaces.length >= parseInt(places.total)) {
      break;
    }
    
    start += limit;
  }
  
  return allPlaces;
}

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

// Import places into monuments table
async function importPlaces() {
  try {
    console.log('Fetching places from NPS API...\n');
    const places = await fetchAllPlaces();
    
    console.log(`\nTotal places fetched: ${places.length}`);
    console.log('Starting import...\n');
    
    // Clear existing monuments
    await pool.query('DELETE FROM user_submissions');
    await pool.query('DELETE FROM trail_monuments');
    await pool.query('DELETE FROM monuments');
    
    let imported = 0;
    let skipped = 0;
    
    for (const place of places) {
      // Skip if no coordinates
      if (!place.latitude || !place.longitude) {
        skipped++;
        continue;
      }
      
      // Get image URL if available
      const imageUrl = place.images && place.images.length > 0 
        ? place.images[0].url 
        : null;
      
      // Determine accessibility rating (default to 3 - moderate)
      // We could enhance this by checking descriptions for accessibility keywords
      const accessibilityRating = 3;
      
      await pool.query(`
        INSERT INTO monuments (name, description, accessibility_rating, photo_url, geom)
        VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326))
      `, [
        place.title,
        place.bodyText || place.listingDescription || 'No description available',
        accessibilityRating,
        imageUrl,
        parseFloat(place.longitude),
        parseFloat(place.latitude)
      ]);
      
      imported++;
      console.log(`Imported: ${place.title}`);
    }
    
    console.log(`\nImport complete! Imported: ${imported}, Skipped: ${skipped}`);
    process.exit(0);
    
  } catch (err) {
    console.error('Error importing places:', err);
    process.exit(1);
  }
}

importPlaces();