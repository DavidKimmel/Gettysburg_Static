// Story Browser - View and browse user-submitted stories

document.addEventListener('DOMContentLoaded', function() {
  createStoryBrowserModal();
  setupStoryBrowserButton();
});

// Create the story browser modal
function createStoryBrowserModal() {
  const modalHTML = `
    <div class="modal fade" id="storyBrowserModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">📖 Community Stories</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <!-- Filter Options -->
            <div class="mb-3">
              <div class="row g-2">
                <div class="col-md-8">
                  <input type="text" class="form-control form-control-sm"
                         id="storySearchInput" placeholder="Search stories or monuments...">
                </div>
                <div class="col-md-4">
                  <select class="form-select form-select-sm" id="storySortSelect">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="monument">By Monument</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Story Count -->
            <div class="mb-2">
              <small class="text-muted">
                <span id="storyCount">Loading...</span>
              </small>
            </div>

            <!-- Loading Indicator -->
            <div id="storiesLoading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading stories...</span>
              </div>
              <p class="mt-2 text-muted">Loading stories...</p>
            </div>

            <!-- No Stories Message -->
            <div id="noStoriesMessage" class="text-center py-5 d-none">
              <p class="text-muted mb-0">No stories have been submitted yet.</p>
              <small class="text-muted">Be the first to share your experience!</small>
            </div>

            <!-- Stories Container -->
            <div id="storiesContainer" class="d-none">
              <!-- Stories will be dynamically inserted here -->
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Setup event listeners for the story browser button
function setupStoryBrowserButton() {
  const viewStoriesBtn = document.getElementById('viewStoriesBtn');
  if (viewStoriesBtn) {
    viewStoriesBtn.addEventListener('click', openStoryBrowser);
  }
}

// Store all stories globally
let allStories = [];

// Open the story browser modal and load stories
async function openStoryBrowser() {
  const modal = new bootstrap.Modal(document.getElementById('storyBrowserModal'));
  modal.show();

  // Load stories when modal opens
  await loadStories();

  // Setup filter event listeners
  setupStoryFilters();
}

// Load all stories from the API
async function loadStories() {
  const loadingDiv = document.getElementById('storiesLoading');
  const noStoriesDiv = document.getElementById('noStoriesMessage');
  const storiesContainer = document.getElementById('storiesContainer');
  const storyCount = document.getElementById('storyCount');

  try {
    loadingDiv.classList.remove('d-none');
    noStoriesDiv.classList.add('d-none');
    storiesContainer.classList.add('d-none');

    const response = await fetch(`${API_URL}/submissions`);
    if (!response.ok) {
      throw new Error('Failed to load stories');
    }

    const data = await response.json();
    allStories = data.features;

    console.log(`Loaded ${allStories.length} stories`);

    // Hide loading
    loadingDiv.classList.add('d-none');

    if (allStories.length === 0) {
      noStoriesDiv.classList.remove('d-none');
      storyCount.textContent = 'No stories yet';
    } else {
      storiesContainer.classList.remove('d-none');
      displayStories(allStories);
      updateStoryCount(allStories.length, allStories.length);
    }

  } catch (error) {
    console.error('Error loading stories:', error);
    loadingDiv.classList.add('d-none');
    storiesContainer.innerHTML = `
      <div class="alert alert-danger">
        <strong>Error:</strong> Failed to load stories. Please try again later.
      </div>
    `;
    storiesContainer.classList.remove('d-none');
  }
}

// Display stories in the container
function displayStories(stories) {
  const storiesContainer = document.getElementById('storiesContainer');

  if (stories.length === 0) {
    storiesContainer.innerHTML = `
      <div class="text-center py-3">
        <p class="text-muted mb-0">No stories match your search.</p>
      </div>
    `;
    return;
  }

  storiesContainer.innerHTML = stories.map(story => createStoryCard(story)).join('');
}

// Create HTML for a single story card
function createStoryCard(story) {
  const props = story.properties;
  const submittedDate = new Date(props.submitted_at);
  const formattedDate = submittedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const authorName = props.user_name || 'Anonymous';
  const monumentName = props.monument_name || 'Unknown Monument';

  // Get coordinates for "View on Map" functionality
  const coords = story.geometry.coordinates;
  const lng = coords[0];
  const lat = coords[1];

  return `
    <div class="card mb-3 story-card" data-story-id="${props.id}">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 class="card-subtitle mb-1">
              <strong>📍 ${monumentName}</strong>
            </h6>
            <small class="text-muted">
              by ${authorName} • ${formattedDate}
            </small>
          </div>
          <button class="btn btn-sm btn-outline-primary view-on-map-btn"
                  onclick="viewStoryOnMap(${lat}, ${lng}, '${monumentName.replace(/'/g, "\\'")}', ${props.monument_id})"
                  data-bs-dismiss="modal">
            🗺️ Map
          </button>
        </div>

        <p class="card-text mt-3">${escapeHtml(props.story_text)}</p>

        ${props.photo_url ? `
          <div class="mt-2">
            <a href="${escapeHtml(props.photo_url)}" target="_blank" class="btn btn-sm btn-outline-secondary">
              📷 View Photo
            </a>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// Helper function to escape HTML and prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// View a story's location on the map
window.viewStoryOnMap = function(lat, lng, monumentName, monumentId) {
  console.log('Navigating to monument:', monumentId, monumentName, 'at', lat, lng);

  // Close the story browser modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('storyBrowserModal'));
  if (modal) {
    modal.hide();
  }

  // Pan to location on map
  if (window.map) {
    window.map.setView([lat, lng], 16);

    // Try to open the monument popup using stored markers
    setTimeout(() => {
      // First check if we have the marker stored by ID
      if (window.monumentMarkers && window.monumentMarkers[monumentId]) {
        const marker = window.monumentMarkers[monumentId];
        console.log('Found monument marker, opening popup');
        marker.openPopup();
      } else if (window.monumentsLayer) {
        // Fallback: search through all layers
        console.log('Monument marker not in store, searching layers...');
        window.monumentsLayer.eachLayer(layer => {
          if (layer.feature && layer.feature.properties.id === monumentId) {
            console.log('Found monument in layer, opening popup');
            layer.openPopup();
          }
        });
      } else {
        console.warn('Monument layers not loaded yet');
      }
    }, 300);
  } else {
    console.error('Map not initialized');
  }
};

// Setup filter and search event listeners
function setupStoryFilters() {
  const searchInput = document.getElementById('storySearchInput');
  const sortSelect = document.getElementById('storySortSelect');

  // Search filter
  searchInput.addEventListener('input', function() {
    filterAndDisplayStories();
  });

  // Sort filter
  sortSelect.addEventListener('change', function() {
    filterAndDisplayStories();
  });
}

// Filter and display stories based on search and sort options
function filterAndDisplayStories() {
  const searchTerm = document.getElementById('storySearchInput').value.toLowerCase();
  const sortOption = document.getElementById('storySortSelect').value;

  // Filter stories
  let filteredStories = allStories.filter(story => {
    const props = story.properties;
    const monumentName = (props.monument_name || '').toLowerCase();
    const storyText = (props.story_text || '').toLowerCase();
    const userName = (props.user_name || '').toLowerCase();

    return monumentName.includes(searchTerm) ||
           storyText.includes(searchTerm) ||
           userName.includes(searchTerm);
  });

  // Sort stories
  if (sortOption === 'newest') {
    filteredStories.sort((a, b) =>
      new Date(b.properties.submitted_at) - new Date(a.properties.submitted_at)
    );
  } else if (sortOption === 'oldest') {
    filteredStories.sort((a, b) =>
      new Date(a.properties.submitted_at) - new Date(b.properties.submitted_at)
    );
  } else if (sortOption === 'monument') {
    filteredStories.sort((a, b) =>
      (a.properties.monument_name || '').localeCompare(b.properties.monument_name || '')
    );
  }

  // Display filtered stories
  displayStories(filteredStories);
  updateStoryCount(filteredStories.length, allStories.length);
}

// Update the story count display
function updateStoryCount(showing, total) {
  const storyCount = document.getElementById('storyCount');
  if (showing === total) {
    storyCount.textContent = `Showing all ${total} ${total === 1 ? 'story' : 'stories'}`;
  } else {
    storyCount.textContent = `Showing ${showing} of ${total} ${total === 1 ? 'story' : 'stories'}`;
  }
}

console.log('Story browser loaded successfully');
