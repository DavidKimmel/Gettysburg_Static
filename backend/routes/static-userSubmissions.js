const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to static JSON file (initial/demo submissions)
const dataPath = path.join(__dirname, '..', 'data', 'static', 'user-submissions.json');

// GET all user submissions (returns static demo submissions only)
// Note: New submissions are stored in browser localStorage
router.get('/', (req, res) => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    const geojson = JSON.parse(data);
    res.json(geojson);
  } catch (err) {
    console.error('Error reading user submissions data:', err);
    res.status(500).json({ error: 'Failed to load user submissions data' });
  }
});

// POST endpoint no longer saves to database
// Returns success but data is only stored client-side
router.post('/', (req, res) => {
  // In static mode, submissions are handled client-side with localStorage
  // This endpoint just validates and acknowledges the submission
  const { monument_id, story_text } = req.body;

  // Basic validation
  if (!monument_id) {
    return res.status(400).json({ error: 'monument_id is required' });
  }

  if (!story_text || story_text.trim().length === 0) {
    return res.status(400).json({ error: 'story_text is required' });
  }

  if (story_text.length > 500) {
    return res.status(400).json({ error: 'story_text must be 500 characters or less' });
  }

  // Return success (actual storage handled client-side)
  res.status(201).json({
    success: true,
    message: 'Submission received (stored in browser)',
    data: {
      id: Date.now(), // Generate temporary ID
      monument_id,
      story_text: story_text.trim(),
      submitted_at: new Date().toISOString()
    },
    note: 'This is a demo version. Submissions are stored locally in your browser only.'
  });
});

module.exports = router;
