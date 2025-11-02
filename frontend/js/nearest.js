// Find Nearest Feature Functionality

let userLocation = null;

// Get user's location
document.addEventListener('DOMContentLoaded', function() {
  setupNearestFeature();
});

function setupNearestFeature() {
  // Add "Use My Location" button to sidebar
  const nearestSection = document.createElement('div');
  nearestSection.className = 'p-3 border-bottom';
  nearestSection.innerHTML = `
    <h6>Find Nearest</h6>
    <button class="btn btn-sm btn-primary w-100 mb-2" id="getLocationBtn">
      📍 Use My Location
    </button>
    <select class="form-select form-select-sm mb-2" id="facilityType">
      <option value="parking">Parking Lot</option>
      <option value="visitor_center">Visitor Center</option>
    </select>
    <button class="btn btn-sm btn-success w-100" id="findNearestBtn" disabled>
      Find Nearest
    </button>
    <div id="nearestResults" class="mt-2"></div>
  `;
  
  // Insert after search section
  const searchSection = document.querySelector('.p-3.border-bottom:nth-child(3)');
  searchSection.parentNode.insertBefore(nearestSection, searchSection.nextSibling);
  
  // Setup event listeners
  document.getElementById('getLocationBtn').addEventListener('click', getUserLocation);
  document.getElementById('findNearestBtn').addEventListener('click', findNearest);
}

// Get user's current location
function getUserLocation() {
  const btn = document.getElementById('getLocationBtn');
  const findBtn = document.getElementById('findNearestBtn');
  const results = document.getElementById('nearestResults');
  
  btn.innerHTML = '⌛ Getting location...';
  btn.disabled = true;
  
  if (!navigator.geolocation) {
    results.innerHTML = '<div class="alert alert-danger small">Geolocation not supported</div>';
    btn.innerHTML = '📍 Use My Location';
    btn.disabled = false;
    return;
  }
  
  navigator.geolocation.getCurrentPosition(
    function(position) {
      userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      
      // Add marker to map
      if (window.userMarker) {
        map.removeLayer(window.userMarker);
      }
      
      window.userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }).addTo(map);
      
      window.userMarker.bindPopup('📍 Your Location').openPopup();
      map.setView([userLocation.lat, userLocation.lng], 15);
      
      btn.innerHTML = '✓ Location Found';
      btn.classList.replace('btn-primary', 'btn-success');
      findBtn.disabled = false;
      
      results.innerHTML = '<div class="alert alert-success small">Location acquired!</div>';
    },
    function(error) {
      results.innerHTML = '<div class="alert alert-danger small">Could not get location</div>';
      btn.innerHTML = '📍 Use My Location';
      btn.disabled = false;
      console.error('Geolocation error:', error);
    }
  );
}

// Find nearest facility
async function findNearest() {
  if (!userLocation) {
    alert('Please get your location first');
    return;
  }
  
  const facilityType = document.getElementById('facilityType').value;
  const results = document.getElementById('nearestResults');
  
  results.innerHTML = '<div class="text-center"><div class="spinner-border spinner-border-sm"></div> Searching...</div>';
  
  try {
    // Fetch all facilities
    const response = await fetch(`${API_URL}/facilities`);
    const data = await response.json();
    
    // Filter by type and calculate distances
    const facilities = data.features
      .filter(f => f.properties.type === facilityType)
      .map(f => {
        const facilityLat = f.geometry.coordinates[1];
        const facilityLng = f.geometry.coordinates[0];
        const distance = calculateDistance(
          userLocation.lat, userLocation.lng,
          facilityLat, facilityLng
        );
        
        return {
          name: f.properties.name,
          lat: facilityLat,
          lng: facilityLng,
          distance: distance,
          accessible: f.properties.is_accessible
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3); // Top 3 nearest
    
    if (facilities.length === 0) {
      results.innerHTML = '<div class="alert alert-warning small">No facilities of this type found</div>';
      return;
    }
    
    // Display results
    let html = '<div class="mt-2">';
    facilities.forEach((facility, index) => {
      const walkTime = Math.ceil(facility.distance / 80); // ~3mph walking speed
      html += `
        <div class="card mb-2" style="cursor: pointer;" onclick="zoomToFacility(${facility.lat}, ${facility.lng})">
          <div class="card-body p-2">
            <small><strong>${index + 1}. ${facility.name}</strong></small><br>
            <small class="text-muted">
              📏 ${facility.distance.toFixed(0)}m (${(facility.distance * 3.28084).toFixed(0)}ft)
              • ⏱️ ${walkTime} min walk<br>
              ${facility.accessible ? '♿ Accessible' : ''}
            </small>
          </div>
        </div>
      `;
    });
    html += '</div>';
    results.innerHTML = html;
    
    // Draw line to nearest facility
    if (window.nearestLine) {
      map.removeLayer(window.nearestLine);
    }
    
    const nearest = facilities[0];
    window.nearestLine = L.polyline([
      [userLocation.lat, userLocation.lng],
      [nearest.lat, nearest.lng]
    ], {
      color: '#0066cc',
      weight: 3,
      dashArray: '10, 10'
    }).addTo(map);
    
    // Zoom to show both points
    map.fitBounds([
      [userLocation.lat, userLocation.lng],
      [nearest.lat, nearest.lng]
    ], { padding: [50, 50] });
    
  } catch (error) {
    console.error('Error finding nearest:', error);
    results.innerHTML = '<div class="alert alert-danger small">Error searching</div>';
  }
}

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c; // Distance in meters
}

// Zoom to facility location with popup offset
window.zoomToFacility = function(lat, lng) {
  const popupHeight = 200;
  const point = map.project([lat, lng], 17);
  point.y -= popupHeight / 2;
  const newCenter = map.unproject(point, 17);
  
  map.setView(newCenter, 17);
  
  // Find and open the facility popup
  window.facilitiesLayer.eachLayer(function(layer) {
    const layerLatLng = layer.getLatLng();
    if (Math.abs(layerLatLng.lat - lat) < 0.0001 && Math.abs(layerLatLng.lng - lng) < 0.0001) {
      layer.openPopup();
    }
  });
};

console.log('Nearest.js loaded successfully');