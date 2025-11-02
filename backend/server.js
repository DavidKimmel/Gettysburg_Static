const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const monumentsRouter = require('./routes/monuments');
const facilitiesRouter = require('./routes/facilities');
const trailsRouter = require('./routes/trails');
const battleSitesRouter = require('./routes/battleSites');
const userSubmissionsRouter = require('./routes/userSubmissions');
const parkBoundariesRouter = require('./routes/parkBoundaries');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration - Allow your portfolio domain
const allowedOrigins = [
  'http://localhost:3000',
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

// API Routes
app.use('/api/monuments', monumentsRouter);
app.use('/api/facilities', facilitiesRouter);
app.use('/api/trails', trailsRouter);
app.use('/api/battle-sites', battleSitesRouter);
app.use('/api/submissions', userSubmissionsRouter);
app.use('/api/park-boundaries', parkBoundariesRouter);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date() });
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
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Serving frontend files from: ${path.join(__dirname, '..', 'frontend')}`);
  console.log('API Routes registered:');
  console.log('  - /api/monuments');
  console.log('  - /api/facilities');
  console.log('  - /api/trails');
  console.log('  - /api/battle-sites');
  console.log('  - /api/submissions');
  console.log('  - /api/park-boundaries');
});