// Map Control Functions

document.addEventListener('DOMContentLoaded', function() {
  setupResetControls();
});

function addResetControlToMap() {
    // Create custom Leaflet control
    L.Control.ResetView = L.Control.extend({
      onAdd: function(map) {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const button = L.DomUtil.create('a', 'leaflet-control-reset', container);
        
        button.innerHTML = '🏠';
        button.href = '#';
        button.title = 'Reset Map View';
        button.style.fontSize = '20px';
        button.style.width = '30px';
        button.style.height = '30px';
        button.style.lineHeight = '30px';
        button.style.textAlign = 'center';
        button.style.textDecoration = 'none';
        button.style.color = '#000';
        button.style.backgroundColor = 'white';
        
        L.DomEvent.on(button, 'click', function(e) {
          L.DomEvent.preventDefault(e);
          resetMapView();
        });
        
        return container;
      }
    });
    
    L.control.resetview = function(opts) {
      return new L.Control.ResetView(opts);
    };
    
    L.control.resetview({ position: 'topleft' }).addTo(map);
  }
  
  // Call this function
  document.addEventListener('DOMContentLoaded', function() {
    setupResetControls();
    setTimeout(addResetControlToMap, 1000); // Wait for map to load
  });

function setupResetControls() {
  // Reset Map View button
  const resetViewBtn = document.getElementById('resetViewBtn');
  if (resetViewBtn) {
    resetViewBtn.addEventListener('click', resetMapView);
  }
  
  // Clear Search button
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', clearSearch);
  }
  
  // Show/hide clear search button based on input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      clearSearchBtn.style.display = e.target.value ? 'block' : 'none';
    });
  }
}

// Reset map to default view
function resetMapView() {
  // Remove user location marker if exists
  if (window.userMarker) {
    map.removeLayer(window.userMarker);
    window.userMarker = null;
  }
  
  // Remove nearest facility line if exists
  if (window.nearestLine) {
    map.removeLayer(window.nearestLine);
    window.nearestLine = null;
  }
  
  // Clear nearest results
  const nearestResults = document.getElementById('nearestResults');
  if (nearestResults) {
    nearestResults.innerHTML = '';
  }
  
  // Reset location button
  const getLocationBtn = document.getElementById('getLocationBtn');
  if (getLocationBtn) {
    getLocationBtn.innerHTML = '📍 Use My Location';
    getLocationBtn.classList.remove('btn-success');
    getLocationBtn.classList.add('btn-primary');
  }
  
  const findNearestBtn = document.getElementById('findNearestBtn');
  if (findNearestBtn) {
    findNearestBtn.disabled = true;
  }
  
  // Reset to Gettysburg center view
  map.setView([39.8145, -77.2311], 13);
  
  // Close any open popups
  map.closePopup();
}

// Clear search
function clearSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  
  if (searchInput) searchInput.value = '';
  if (searchResults) searchResults.innerHTML = '';
  if (clearSearchBtn) clearSearchBtn.style.display = 'none';
  
  // Close any open popups
  map.closePopup();
}

console.log('Controls.js loaded successfully');
// Mobile sidebar toggle
document.addEventListener('DOMContentLoaded', function() {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  
  if (sidebarToggle) {
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    // Toggle sidebar
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('show');
      overlay.classList.toggle('show');
    });
    
    // Close sidebar when clicking overlay
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
    });
    
    // Close sidebar when clicking on map on mobile
    if (window.innerWidth < 768) {
      map.on('click', function() {
        if (sidebar.classList.contains('show')) {
          sidebar.classList.remove('show');
          overlay.classList.remove('show');
        }
      });
    }
  }
});

console.log('Mobile controls loaded');