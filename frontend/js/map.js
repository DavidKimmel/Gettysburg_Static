// API Configuration - automatically detects environment
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api'; // In production, use relative URL (same domain)

// Initialize map centered on Gettysburg (make it global for access from other scripts)
window.map = L.map('map').setView([39.8145, -77.2311], 13);
const map = window.map; // Keep local reference for convenience

// Add OpenStreetMap base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);

// Add scale control
L.control.scale({ position: 'bottomleft' }).addTo(map);

// Global layer variables
window.monumentsLayer = null;
window.trailsLayer = null;
window.facilitiesLayer = null;
window.battleSitesLayer = null;


// Toggle description expansion
window.toggleDescription = function(id) {
  const descElement = document.getElementById(`desc-${id}`);
  const fullText = window.monumentDescriptions[id];
  const btn = event.target;
  
  if (!fullText) {
    console.error('Description not found for id:', id);
    return;
  }
  
  if (descElement.classList.contains('truncated')) {
    // Expand
    descElement.innerHTML = `<p class="small mb-2">${fullText}</p>`;
    descElement.classList.remove('truncated');
    descElement.classList.add('expanded');
    btn.textContent = 'Read Less';
  } else {
    // Collapse
    const truncated = fullText.substring(0, 300) + '...';
    descElement.innerHTML = `<p class="small mb-2">${truncated}</p>`;
    descElement.classList.add('truncated');
    descElement.classList.remove('expanded');
    btn.textContent = 'Read More';
  }
};

// Show loading indicator
function showLoading() {
  document.getElementById('loading').classList.remove('d-none');
}

// Hide loading indicator
function hideLoading() {
  document.getElementById('loading').classList.add('d-none');
}

// Load all layers on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Map initialized, loading data layers...');
  loadAllLayers();
  setupLayerControls();
});

// Setup layer toggle controls
function setupLayerControls() {
  document.getElementById('layerMonuments').addEventListener('change', function(e) {
    if (window.monumentsLayer) {
      if (e.target.checked) {
        map.addLayer(window.monumentsLayer);
      } else {
        map.removeLayer(window.monumentsLayer);
      }
    }
  });

  document.getElementById('layerTrails').addEventListener('change', function(e) {
    if (window.trailsLayer) {
      if (e.target.checked) {
        map.addLayer(window.trailsLayer);
      } else {
        map.removeLayer(window.trailsLayer);
      }
    }
  });

  document.getElementById('layerFacilities').addEventListener('change', function(e) {
    if (window.facilitiesLayer) {
      if (e.target.checked) {
        map.addLayer(window.facilitiesLayer);
      } else {
        map.removeLayer(window.facilitiesLayer);
      }
    }
  });

  document.getElementById('layerBattleSites').addEventListener('change', function(e) {
    if (window.battleSitesLayer) {
      if (e.target.checked) {
        map.addLayer(window.battleSitesLayer);
      } else {
        map.removeLayer(window.battleSitesLayer);
      }
    }
  });
  document.getElementById('layerParkBoundary').addEventListener('change', function(e) {
    if (window.parkBoundariesLayer) {
      if (e.target.checked) {
        map.addLayer(window.parkBoundariesLayer);
      } else {
        map.removeLayer(window.parkBoundariesLayer);
      }
    }
  });
}

// Helper function to format dates
function formatDate(dateString) {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Helper function to create accessibility stars
function createStars(rating) {
  if (!rating) return 'Not rated';
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

console.log('Map.js loaded successfully');