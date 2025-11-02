const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../frontend/uploads/stories');
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename: timestamp-randomstring-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, basename + '-' + uniqueSuffix + ext);
  }
});

// File filter to only accept images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// GET all user submissions
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        us.id, us.monument_id, us.user_name, 
        us.story_text, us.photo_url, us.submitted_at,
        m.name as monument_name,
        ST_AsGeoJSON(us.geom)::json as geometry
      FROM user_submissions us
      LEFT JOIN monuments m ON us.monument_id = m.id
      ORDER BY us.submitted_at DESC
    `);
    
    const geojson = {
      type: 'FeatureCollection',
      features: result.rows.map(row => ({
        type: 'Feature',
        properties: {
          id: row.id,
          monument_id: row.monument_id,
          monument_name: row.monument_name,
          user_name: row.user_name,
          story_text: row.story_text,
          photo_url: row.photo_url,
          submitted_at: row.submitted_at
        },
        geometry: row.geometry
      }))
    };
    
    res.json(geojson);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST new user submission (with optional file upload)
router.post('/', (req, res, next) => {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

    // Check if req.body exists
    if (!req.body) {
      return res.status(400).json({ error: 'No form data received' });
    }

    const { monument_id, user_name, story_text, photo_url, lat, lng } = req.body;

    console.log('Parsed values:', { monument_id, user_name, story_text, photo_url, lat, lng });

    // Server-side validation
    if (!monument_id) {
      return res.status(400).json({ error: 'monument_id is required', receivedBody: req.body });
    }

    if (!story_text || story_text.trim().length === 0) {
      return res.status(400).json({ error: 'story_text is required' });
    }

    if (story_text.length > 500) {
      return res.status(400).json({ error: 'story_text must be 500 characters or less' });
    }

    if (user_name && user_name.length > 100) {
      return res.status(400).json({ error: 'user_name must be 100 characters or less' });
    }

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Coordinates are required' });
    }

    // Determine photo URL - prioritize uploaded file over provided URL
    let finalPhotoUrl = null;
    if (req.file) {
      // If file was uploaded, use the uploaded file path
      finalPhotoUrl = `/uploads/stories/${req.file.filename}`;
    } else if (photo_url) {
      // If no file but URL provided, use the URL
      finalPhotoUrl = photo_url;
    }

    // Insert submission
    const result = await pool.query(`
      INSERT INTO user_submissions
        (monument_id, user_name, story_text, photo_url, geom)
      VALUES
        ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326))
      RETURNING id, monument_id, user_name, story_text, photo_url, submitted_at
    `, [
      monument_id,
      user_name || null,
      story_text.trim(),
      finalPhotoUrl,
      lng,
      lat
    ]);

    console.log('Submission saved:', result.rows[0]);

    res.status(201).json({
      success: true,
      message: 'Submission created successfully',
      data: result.rows[0]
    });

  } catch (err) {
    console.error('Error creating submission:', err);

    // If there was an uploaded file and an error occurred, delete it
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
      });
    }

    res.status(500).json({ error: err.message });
  }
});

module.exports = router;