# Gettysburg National Military Park Guide

A full-stack web application for exploring the Gettysburg National Military Park, featuring interactive maps, historical monuments, trails, facilities, and battle sites.

**🎉 Now available in Static Mode** - Deployable for **$0/month forever** on Render.com!

[View Code](https://github.com/DavidKimmel/Gettysburg_Static) | [Deployment Guide](DEPLOYMENT_STATIC.md) | [Live Demo](#) (Deploy to get URL!)

## Features

- Interactive Leaflet map with 600+ spatial features
- Layer controls for monuments, trails, facilities, battle sites, and park boundary
- Real-time monument search with debouncing
- User story submissions with photo uploads
- Responsive mobile-first design
- RESTful API serving GeoJSON
- **Static Mode**: No database required - serves data from JSON files

## Technology Stack

### Frontend
- HTML5, CSS3, JavaScript
- Leaflet.js for mapping
- Bootstrap 5 for UI components
- Marker clustering for performance

### Backend
- Node.js with Express.js
- RESTful API serving GeoJSON
- **Static Mode**: Data served from JSON files (no database)
- **Database Mode**: PostgreSQL 17.5 with PostGIS 3.5 (optional)
- CORS enabled for API access

### Database Design (Original)
This app was designed with a full PostgreSQL/PostGIS database:
- Tables: monuments, trails, facilities, battle_sites, user_submissions, trail_monuments
- Spatial indexes for optimized queries
- PostGIS functions for spatial operations
- **Now available as static JSON** for free deployment

### Deployment
- **Production**: Static JSON mode on Render.com (FREE forever)
- **Alternative**: Database mode with PostgreSQL ($7/month after 90 days)
- See [DEPLOYMENT_STATIC.md](DEPLOYMENT_STATIC.md) for deployment guide

## Prerequisites

Before running this application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- [PostGIS](https://postgis.net/) extension for PostgreSQL

## Installation

### 1. Clone or Download the Repository

```bash
cd gettysburg-park-app
```

### 2. Install Dependencies

```bash
npm install
```

This will install the following dependencies:
- express
- cors
- dotenv
- pg (PostgreSQL client)
- nodemon (dev dependency)

### 3. Database Setup

#### Create the Database

Open your PostgreSQL client (psql or pgAdmin) and run:

```sql
CREATE DATABASE gettysburg_park;
```

#### Enable PostGIS Extension

Connect to the database and enable PostGIS:

```sql
\c gettysburg_park
CREATE EXTENSION IF NOT EXISTS postgis;
```

#### Create Tables

Run the schema file to create all tables:

```bash
psql -U postgres -d gettysburg_park -f backend/database/schema.sql
```

Or manually execute the SQL commands from [backend/database/schema.sql](backend/database/schema.sql).

#### Import Data

Import the spatial data using the provided import scripts:

```bash
node backend/import_places.js
node backend/import_facilities.js
node backend/import-trails.js
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory (or modify the existing one):

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=gettysburg_park
DB_PASSWORD=your_password_here
DB_PORT=5432

# Server Configuration
PORT=3000
```

**Important:** Update `DB_PASSWORD` with your actual PostgreSQL password.

## Launching the Application

### Quick Start (Static Mode - No Database Required!)

```bash
npm install
npm start
```

Visit: http://localhost:3000

This runs the **static version** that serves data from JSON files - perfect for development and deployment!

### Database Mode (Optional - Requires PostgreSQL)

If you want to use the database version with PostgreSQL:

```bash
npm run start:db
# or for auto-restart:
npm run dev:db
```

### Accessing the Application

Once the server is running, you should see:

```
Server running on http://localhost:3000
Serving frontend files from: /path/to/frontend
API Routes registered:
  - /api/monuments
  - /api/facilities
  - /api/trails
  - /api/battle-sites
  - /api/submissions
  - /api/park-boundaries
```

Open your browser and navigate to:

```
http://localhost:3000
```

## API Endpoints

The application provides the following REST API endpoints:

- `GET /api/monuments` - Retrieve all monuments
- `GET /api/facilities` - Retrieve all facilities
- `GET /api/trails` - Retrieve all trails
- `GET /api/battle-sites` - Retrieve all battle sites
- `GET /api/park-boundaries` - Retrieve park boundary
- `GET /api/submissions` - Retrieve user submissions
- `POST /api/submissions` - Submit a new user story
- `GET /api/test` - Test API connectivity

## Project Structure

```
gettysburg-park-app/
├── backend/
│   ├── database/
│   │   ├── db.js              # Database connection
│   │   └── schema.sql         # Database schema
│   ├── routes/
│   │   ├── monuments.js       # Monument endpoints
│   │   ├── facilities.js      # Facility endpoints
│   │   ├── trails.js          # Trail endpoints
│   │   ├── battleSites.js     # Battle site endpoints
│   │   ├── parkBoundaries.js  # Park boundary endpoints
│   │   └── userSubmissions.js # User submission endpoints
│   ├── server.js              # Express server
│   └── import_*.js            # Data import scripts
├── frontend/
│   ├── css/
│   │   └── styles.css         # Custom styles
│   ├── js/
│   │   ├── map.js             # Map initialization
│   │   ├── layers.js          # Layer management
│   │   ├── controls.js        # UI controls
│   │   ├── search.js          # Search functionality
│   │   ├── nearest.js         # Nearest feature queries
│   │   └── submission.js      # User submissions
│   ├── images/                # Image assets
│   └── index.html             # Main HTML page
├── .env                       # Environment variables
├── package.json               # NPM dependencies
└── README.md                  # This file
```

## Database Schema

### Tables
- **battle_sites**: Historical battle locations (polygons)
- **monuments**: Monument points with accessibility ratings
- **trails**: Trail linestrings with difficulty and surface type
- **facilities**: Park facilities (parking, restrooms, visitor centers)
- **user_submissions**: User-contributed stories and photos
- **trail_monuments**: Junction table linking trails and monuments

### Quick Stats
- 91 Monuments & Memorials
- 480 Trail Segments
- 24 Facilities
- 11 Battle Sites
- Total: 606+ Features

## Troubleshooting

### Database Connection Issues

If you see database connection errors:

1. Verify PostgreSQL is running:
   ```bash
   pg_ctl status
   ```

2. Check your `.env` file credentials

3. Ensure the database exists:
   ```bash
   psql -U postgres -l
   ```

### Port Already in Use

If port 3000 is already in use, change the PORT in `.env`:

```env
PORT=3001
```

### Missing Dependencies

If you get module errors, reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Development

To contribute or develop features:

1. Use `nodemon` for auto-restart during development
2. Check the console for detailed logging
3. API endpoints return JSON data
4. Frontend uses vanilla JavaScript (no build step required)

## License

This project is for educational purposes.