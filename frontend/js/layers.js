
// Store full monument descriptions and markers
window.monumentDescriptions = {};
window.monumentMarkers = {}; // Store markers by monument ID for easy access

// Load all data layers
async function loadAllLayers() {
  showLoading();
  try {
    await Promise.all([
      loadMonuments(),
      loadTrails(),
      loadFacilities(),
      loadBattleSites(),
      loadParkBoundaries()  // ADD THIS LINE

    ]);
    console.log('All layers loaded successfully!');
  } catch (error) {
    console.error('Error loading layers:', error);
    alert('Error loading map data. Please refresh the page.');
  } finally {
    hideLoading();
  }
}

// Load Monuments Layer
async function loadMonuments() {
  try {
    const response = await fetch(`${API_URL}/monuments`);
    const data = await response.json();
    
    console.log(`Loading ${data.features.length} monuments...`);
    
    // Custom icon for monuments (red)
    const monumentIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    // Create monuments layer without clustering
    window.monumentsLayer = L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng, { icon: monumentIcon });
      },
      onEachFeature: function(feature, layer) {
        const props = feature.properties;

        // Store full description in memory
        const description = props.description || 'No description available';
        window.monumentDescriptions[props.id] = description;

        // Store marker reference by monument ID
        window.monumentMarkers[props.id] = layer;
        
        const isTruncated = description.length > 300;
        const truncatedDesc = isTruncated ? description.substring(0, 300) + '...' : description;
        
        let popupContent = `
          <div class="monument-popup">
            <h6>${props.name}</h6>
            <div class="popup-description ${isTruncated ? 'truncated' : ''}" id="desc-${props.id}">
              <p class="small mb-2">${truncatedDesc}</p>
            </div>
        `;
        
        if (isTruncated) {
          popupContent += `
            <span class="read-more-btn" onclick="toggleDescription(${props.id})">
              Read More
            </span>
          `;
        }
        popupContent += `
          <button class="btn btn-sm btn-primary w-100 mt-2 mb-2" 
                  onclick="openSubmissionModal(${props.id}, '${props.name.replace(/'/g, "\\'")}', ${feature.geometry.coordinates[1]}, ${feature.geometry.coordinates[0]})">
            📝 Share Your Story
          </button>
        `;
        if (props.dedication_date) {
          popupContent += `<p class="small mb-1">
            <span class="popup-label">Dedicated:</span> ${formatDate(props.dedication_date)}
          </p>`;
        }
        
        if (props.accessibility_rating) {
          popupContent += `<p class="small mb-2">
            <span class="popup-label">Accessibility:</span> 
            <span class="accessibility-stars">${createStars(props.accessibility_rating)}</span>
          </p>`;
        }
        
        if (props.photo_url) {
          popupContent += `<img src="${props.photo_url}" alt="${props.name}" class="img-fluid">`;
        }
        
        popupContent += `</div>`;
        
        layer.bindPopup(popupContent, { maxWidth: 300, maxHeight: 500 });
      }
    }).addTo(map);
    
    console.log('Monuments layer loaded');
  } catch (error) {
    console.error('Error loading monuments:', error);
  }
}

// Load Trails Layer
async function loadTrails() {
  try {
    const response = await fetch(`${API_URL}/trails`);
    const data = await response.json();
    
    console.log(`Loading ${data.features.length} trails...`);
    
    window.trailsLayer = L.geoJSON(data, {
      style: function(feature) {
        const isAccessible = feature.properties.is_accessible;
        return {
          color: isAccessible ? '#0066cc' : '#666666',
          weight: 4,
          opacity: 0.8
        };
      },
      onEachFeature: function(feature, layer) {
        const props = feature.properties;
        
        let popupContent = `
          <div class="trail-popup">
            <h6>${props.name || 'Unnamed Trail'}</h6>
        `;
        
        // Only show length if it exists and is a number
        if (props.length_miles && typeof props.length_miles === 'number') {
          popupContent += `<p class="small mb-1">
            <span class="popup-label">Length:</span> ${props.length_miles.toFixed(2)} miles
          </p>`;
        }
        
        popupContent += `
          <p class="small mb-1">
            <span class="popup-label">Surface:</span> ${props.surface_type || 'Unknown'}
          </p>
          <p class="small mb-1">
            <span class="popup-label">Difficulty:</span> ${props.difficulty || 'Unknown'}
          </p>
          <p class="small mb-0">
            <span class="popup-label">Accessible:</span> 
            ${props.is_accessible ? '✓ Yes' : '✗ No'}
          </p>
        </div>
        `;
        
        layer.bindPopup(popupContent, { maxWidth: 250 });
      }
    }).addTo(map);
    
    console.log('Trails layer loaded');
  } catch (error) {
    console.error('Error loading trails:', error);
  }
}

// Load Facilities Layer
async function loadFacilities() {
  try {
    const response = await fetch(`${API_URL}/facilities`);
    const data = await response.json();
    
    console.log(`Loading ${data.features.length} facilities...`);
    
    // Custom icons for different facility types
    const facilityIcons = {
      visitor_center: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      }),
      parking: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      }),
      restroom: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    };
    
    window.facilitiesLayer = L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        const type = feature.properties.type;
        const icon = facilityIcons[type] || facilityIcons.parking;
        return L.marker(latlng, { icon: icon });
      },
      onEachFeature: function(feature, layer) {
        const props = feature.properties;
        
        const popupContent = `
          <div class="facility-popup">
            <h6>${props.name}</h6>
            <p class="small mb-1">
              <span class="popup-label">Type:</span> ${props.type.replace('_', ' ').toUpperCase()}
            </p>
            ${props.hours_open ? `<p class="small mb-1">
              <span class="popup-label">Hours:</span> ${props.hours_open}
            </p>` : ''}
            <p class="small mb-0">
              <span class="popup-label">Accessible:</span> 
              ${props.is_accessible ? '✓ Yes' : '✗ No'}
            </p>
          </div>
        `;
        
        layer.bindPopup(popupContent, { maxWidth: 250 });
      }
    }).addTo(map);
    
    console.log('Facilities layer loaded');
  } catch (error) {
    console.error('Error loading facilities:', error);
  }
}

// Load Battle Sites Layer
async function loadBattleSites() {
  try {
    const response = await fetch(`${API_URL}/battle-sites`);
    const data = await response.json();
    
    console.log(`Loading ${data.features.length} battle sites...`);
    
    window.battleSitesLayer = L.geoJSON(data, {
      style: function(feature) {
        return {
          color: '#8B0000',
          weight: 2,
          opacity: 0.6,
          fillColor: '#FF6B6B',
          fillOpacity: 0.2
        };
      },
      onEachFeature: function(feature, layer) {
        const props = feature.properties;
        
        const popupContent = `
          <div class="battle-site-popup">
            <h6>${props.name}</h6>
            <p class="small mb-1">
              <span class="popup-label">Date:</span> ${formatDate(props.battle_date)}
            </p>
            <p class="small mb-2">${props.description}</p>
            ${props.casualties ? `<p class="small mb-0">
              <span class="popup-label">Casualties:</span> ~${props.casualties.toLocaleString()}
            </p>` : ''}
          </div>
        `;
        
        layer.bindPopup(popupContent, { maxWidth: 300 });
      }
    }).addTo(map);
    
    console.log('Battle sites layer loaded');
  } catch (error) {
    console.error('Error loading battle sites:', error);
  }
}
// Load Park Boundaries Layer
async function loadParkBoundaries() {
  try {
    const response = await fetch(`${API_URL}/park-boundaries`);
    const data = await response.json();
    
    console.log(`Loading ${data.features.length} park boundaries...`);
    
    window.parkBoundariesLayer = L.geoJSON(data, {
      style: function(feature) {
        return {
          color: '#2d5016',
          weight: 3,
          opacity: 0.8,
          fillColor: '#2d5016',
          fillOpacity: 0.05,
          dashArray: '10, 5',
          interactive: false  // Make non-clickable
        };
      }
    });
    
    // Add to map - it will be at the back by default since it's added first
    window.parkBoundariesLayer.addTo(map);
    
    // Explicitly send to back
    window.parkBoundariesLayer.bringToBack();
    
    console.log('Park boundaries layer loaded (non-interactive, behind other layers)');
  } catch (error) {
    console.error('Error loading park boundaries:', error);
  }
}
console.log('Layers.js loaded successfully');