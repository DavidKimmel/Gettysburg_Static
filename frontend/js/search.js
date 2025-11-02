// Search functionality for monuments
let allMonuments = [];

// Store monument data for searching
async function initializeSearch() {
  try {
    const response = await fetch(`${API_URL}/monuments`);
    const data = await response.json();
    allMonuments = data.features;
    console.log('Search initialized with', allMonuments.length, 'monuments');
  } catch (error) {
    console.error('Error initializing search:', error);
  }
}

// Setup search input listener
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  
  // Search as user types (with debounce)
  let searchTimeout;
  searchInput.addEventListener('input', function(e) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      performSearch(e.target.value);
    }, 300); // Wait 300ms after user stops typing
  });
  
  // Initialize search data
  initializeSearch();
});

// Perform search
function performSearch(query) {
  const searchResults = document.getElementById('searchResults');
  
  // Clear if query is too short
  if (!query || query.length < 2) {
    searchResults.innerHTML = '';
    return;
  }
  
  // Filter monuments by name (case-insensitive)
  const results = allMonuments.filter(monument => {
    const name = monument.properties.name.toLowerCase();
    return name.includes(query.toLowerCase());
  });
  
  // Display results
  if (results.length === 0) {
    searchResults.innerHTML = '<div class="small text-muted p-2">No monuments found</div>';
  } else {
    let html = '<div class="list-group list-group-flush">';
    results.slice(0, 5).forEach(monument => { // Show max 5 results
      html += `
        <a href="#" class="list-group-item list-group-item-action search-result-item" 
           data-id="${monument.properties.id}"
           data-lat="${monument.geometry.coordinates[1]}"
           data-lng="${monument.geometry.coordinates[0]}">
          ${monument.properties.name}
        </a>
      `;
    });
    if (results.length > 5) {
      html += `<div class="small text-muted p-2">${results.length - 5} more results...</div>`;
    }
    html += '</div>';
    searchResults.innerHTML = html;
    
    // Add click handlers to results
    document.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const lat = parseFloat(this.dataset.lat);
        const lng = parseFloat(this.dataset.lng);
        
        // Zoom to monument with offset for popup
        const popupHeight = 300; // Approximate popup height in pixels
        const point = map.project([lat, lng], 17);
        point.y -= popupHeight / 2; // Offset upward
        const newCenter = map.unproject(point, 17);
        
        map.setView(newCenter, 17);
        
        // Find and open the popup
        window.monumentsLayer.eachLayer(function(layer) {
          if (layer.getLatLng().lat === lat && layer.getLatLng().lng === lng) {
            layer.openPopup();
          }
        });
        
        // Clear search
        document.getElementById('searchInput').value = '';
        searchResults.innerHTML = '';
      });
    });
  }
}

console.log('Search.js loaded successfully');