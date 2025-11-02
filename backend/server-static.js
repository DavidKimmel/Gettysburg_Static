const express = require('express');
const cors = require('cors');
const path = require('path');

// Import STATIC routes (no database required!)
const monumentsRouter = require('./routes/static-monuments');
const facilitiesRouter = require('./routes/static-facilities');
const trailsRouter = require('./routes/static-trails');
const battleSitesRouter = require('./routes/static-battleSites');
const userSubmissionsRouter = require('./routes/static-userSubmissions');
const parkBoundariesRouter = require('./routes/static-parkBoundaries');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration - Allow your portfolio domain
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://your-portfolio-domain.github.io', // Replace with your actual GitHub Pages domain
  'https://gettysburg-park-guide.onrender.com' // Replace with your Render app URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// API Routes - All served from static JSON files
app.use('/api/monuments', monumentsRouter);
app.use('/api/facilities', facilitiesRouter);
app.use('/api/trails', trailsRouter);
app.use('/api/battle-sites', battleSitesRouter);
app.use('/api/submissions', userSubmissionsRouter);
app.use('/api/park-boundaries', parkBoundariesRouter);

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working! (Static JSON mode - no database)',
    timestamp: new Date(),
    mode: 'static',
    note: 'All data served from JSON files. User submissions stored in browser localStorage.'
  });
});

// Root route - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Mode: STATIC (No database required)`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📂 Serving frontend files from: ${path.join(__dirname, '..', 'frontend')}`);
  console.log('📊 API Routes (static JSON):');
  console.log('  - GET /api/monuments');
  console.log('  - GET /api/facilities');
  console.log('  - GET /api/trails');
  console.log('  - GET /api/battle-sites');
  console.log('  - GET /api/submissions');
  console.log('  - GET /api/park-boundaries');
  console.log('  - POST /api/submissions (localStorage)');
  console.log('\n💡 User submissions are stored in browser localStorage only');
});
