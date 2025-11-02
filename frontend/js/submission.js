// User Submission Form with Validation

document.addEventListener('DOMContentLoaded', function() {
  createSubmissionModal();
  setupSubmissionForm();
});

// Create the submission modal
function createSubmissionModal() {
  const modalHTML = `
    <div class="modal fade" id="submissionModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Share Your Story</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="submissionForm">
              <input type="hidden" id="selectedMonumentId">
              <input type="hidden" id="selectedMonumentLat">
              <input type="hidden" id="selectedMonumentLng">
              
              <div class="mb-3">
                <label for="monumentName" class="form-label">Monument</label>
                <input type="text" class="form-control" id="monumentName" disabled>
              </div>
              
              <div class="mb-3">
                <label for="userName" class="form-label">Your Name (Optional)</label>
                <input type="text" class="form-control" id="userName" maxlength="100">
                <small class="form-text text-muted">Maximum 100 characters</small>
              </div>
              
              <div class="mb-3">
                <label for="storyText" class="form-label">
                  Your Story or Tip <span class="text-danger">*</span>
                </label>
                <textarea class="form-control" id="storyText" rows="4" 
                          maxlength="500" required></textarea>
                <div class="d-flex justify-content-between">
                  <small class="form-text text-muted">Share your experience, tips, or historical insights</small>
                  <small class="form-text text-muted">
                    <span id="charCount">0</span>/500
                  </small>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Photo (Optional)</label>

                <!-- Tab buttons for upload vs URL -->
                <ul class="nav nav-tabs mb-2" role="tablist">
                  <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="upload-tab" data-bs-toggle="tab"
                            data-bs-target="#upload-panel" type="button" role="tab">
                      📤 Upload from Device
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button class="nav-link" id="url-tab" data-bs-toggle="tab"
                            data-bs-target="#url-panel" type="button" role="tab">
                      🔗 Enter URL
                    </button>
                  </li>
                </ul>

                <!-- Tab content -->
                <div class="tab-content">
                  <!-- Upload Panel -->
                  <div class="tab-pane fade show active" id="upload-panel" role="tabpanel">
                    <input type="file" class="form-control" id="photoFile"
                           accept="image/jpeg,image/jpg,image/png,image/gif,image/webp">
                    <small class="form-text text-muted">
                      Upload a photo from your device (Max 5MB, JPEG/PNG/GIF/WebP)
                    </small>
                    <div id="photoPreview" class="mt-2"></div>
                  </div>

                  <!-- URL Panel -->
                  <div class="tab-pane fade" id="url-panel" role="tabpanel">
                    <input type="url" class="form-control" id="photoUrl" placeholder="https://...">
                    <small class="form-text text-muted">
                      Or enter a URL to a photo from this location
                    </small>
                  </div>
                </div>
              </div>
              
              <div id="formError" class="alert alert-danger d-none"></div>
              <div id="formSuccess" class="alert alert-success d-none"></div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="submitStoryBtn">
              Submit Story
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Setup form event listeners
function setupSubmissionForm() {
  const storyText = document.getElementById('storyText');
  const charCount = document.getElementById('charCount');
  const submitBtn = document.getElementById('submitStoryBtn');
  const photoFile = document.getElementById('photoFile');

  // Character counter
  storyText.addEventListener('input', function() {
    charCount.textContent = this.value.length;

    // Change color if approaching limit
    if (this.value.length > 450) {
      charCount.classList.add('text-danger');
    } else {
      charCount.classList.remove('text-danger');
    }
  });

  // Photo file preview
  photoFile.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('photoPreview');

    if (file) {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        preview.innerHTML = '<div class="alert alert-warning small mb-0">File is too large. Maximum size is 5MB.</div>';
        photoFile.value = '';
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        preview.innerHTML = '<div class="alert alert-warning small mb-0">Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP).</div>';
        photoFile.value = '';
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.innerHTML = `
          <div class="position-relative d-inline-block">
            <img src="${e.target.result}" class="img-thumbnail" style="max-width: 200px; max-height: 200px;">
            <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                    onclick="clearPhotoPreview()" title="Remove photo">
              ✕
            </button>
          </div>
          <p class="small text-muted mt-1 mb-0">${file.name} (${(file.size / 1024).toFixed(1)} KB)</p>
        `;
      };
      reader.readAsDataURL(file);
    } else {
      preview.innerHTML = '';
    }
  });

  // Submit button handler
  submitBtn.addEventListener('click', submitStory);
}

// Clear photo preview and file input
window.clearPhotoPreview = function() {
  document.getElementById('photoFile').value = '';
  document.getElementById('photoPreview').innerHTML = '';
};

// Open submission modal for a monument
window.openSubmissionModal = function(monumentId, monumentName, lat, lng) {
  document.getElementById('selectedMonumentId').value = monumentId;
  document.getElementById('monumentName').value = monumentName;
  document.getElementById('selectedMonumentLat').value = lat;
  document.getElementById('selectedMonumentLng').value = lng;

  // Reset form
  document.getElementById('submissionForm').reset();
  document.getElementById('charCount').textContent = '0';
  document.getElementById('formError').classList.add('d-none');
  document.getElementById('formSuccess').classList.add('d-none');
  document.getElementById('photoPreview').innerHTML = '';

  // Reset file input
  document.getElementById('photoFile').value = '';

  // Open modal
  const modal = new bootstrap.Modal(document.getElementById('submissionModal'));
  modal.show();
};

// Validate and submit story
async function submitStory() {
  const formError = document.getElementById('formError');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitStoryBtn');

  // Clear previous messages
  formError.classList.add('d-none');
  formSuccess.classList.add('d-none');

  // Get form values
  const monumentId = document.getElementById('selectedMonumentId').value;
  const userName = document.getElementById('userName').value.trim();
  const storyText = document.getElementById('storyText').value.trim();
  const photoUrl = document.getElementById('photoUrl').value.trim();
  const photoFile = document.getElementById('photoFile').files[0];
  const lat = parseFloat(document.getElementById('selectedMonumentLat').value);
  const lng = parseFloat(document.getElementById('selectedMonumentLng').value);

  // Validation
  const errors = [];

  if (!storyText) {
    errors.push('Story text is required');
  }

  if (storyText.length < 10) {
    errors.push('Story must be at least 10 characters');
  }

  if (storyText.length > 500) {
    errors.push('Story must be 500 characters or less');
  }

  if (userName && userName.length > 100) {
    errors.push('Name must be 100 characters or less');
  }

  // Validate photo file if provided
  if (photoFile) {
    if (photoFile.size > 5 * 1024 * 1024) {
      errors.push('Photo file is too large (max 5MB)');
    }
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(photoFile.type)) {
      errors.push('Invalid photo file type (use JPEG, PNG, GIF, or WebP)');
    }
  }

  // Validate photo URL if provided (and no file uploaded)
  if (!photoFile && photoUrl) {
    try {
      new URL(photoUrl);
      if (!photoUrl.startsWith('http://') && !photoUrl.startsWith('https://')) {
        errors.push('Photo URL must start with http:// or https://');
      }
    } catch (e) {
      errors.push('Photo URL is not valid');
    }
  }

  // Show errors if any
  if (errors.length > 0) {
    formError.innerHTML = '<strong>Please fix the following:</strong><ul class="mb-0 mt-1">' +
                          errors.map(e => `<li>${e}</li>`).join('') +
                          '</ul>';
    formError.classList.remove('d-none');
    return;
  }

  // Disable submit button during submission
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Submitting...';

  try {
    // Prepare form data for file upload
    const formData = new FormData();
    formData.append('monument_id', monumentId);
    formData.append('user_name', userName || '');
    formData.append('story_text', storyText);
    formData.append('lat', lat);
    formData.append('lng', lng);

    // Add photo - either file or URL
    if (photoFile) {
      formData.append('photo', photoFile);
    } else if (photoUrl) {
      formData.append('photo_url', photoUrl);
    }

    // Submit to API using FormData (no Content-Type header - browser sets it with boundary)
    const response = await fetch(`${API_URL}/submissions`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Submission failed');
    }
    
    const result = await response.json();

    // Save to localStorage (static version only)
    saveSubmissionToLocalStorage({
      id: result.data.id,
      monument_id: monumentId,
      user_name: userName || 'Anonymous',
      story_text: storyText,
      photo_url: photoUrl || null,
      lat: lat,
      lng: lng,
      submitted_at: new Date().toISOString()
    });

    // Show success message
    const noteText = result.note ? `<br><small class="text-muted">${result.note}</small>` : '';
    formSuccess.innerHTML = `<strong>Success!</strong> Your story has been submitted. Thank you for sharing!${noteText}`;
    formSuccess.classList.remove('d-none');

    // Reset form
    document.getElementById('submissionForm').reset();
    document.getElementById('charCount').textContent = '0';
    document.getElementById('photoPreview').innerHTML = '';
    document.getElementById('photoFile').value = '';

    // Close modal after 2 seconds
    setTimeout(() => {
      bootstrap.Modal.getInstance(document.getElementById('submissionModal')).hide();
    }, 2000);

    console.log('Submission successful:', result);
    
  } catch (error) {
    console.error('Submission error:', error);
    formError.innerHTML = '<strong>Error:</strong> ' + error.message;
    formError.classList.remove('d-none');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Submit Story';
  }
}

// LocalStorage helpers for static version
function saveSubmissionToLocalStorage(submission) {
  try {
    // Get existing submissions
    const submissions = JSON.parse(localStorage.getItem('userSubmissions') || '[]');

    // Add new submission
    submissions.push(submission);

    // Save back to localStorage
    localStorage.setItem('userSubmissions', JSON.stringify(submissions));

    console.log('Submission saved to localStorage:', submission);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

function getSubmissionsFromLocalStorage() {
  try {
    return JSON.parse(localStorage.getItem('userSubmissions') || '[]');
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

// Make these available globally for story browser
window.getSubmissionsFromLocalStorage = getSubmissionsFromLocalStorage;

console.log('Submission.js loaded successfully');