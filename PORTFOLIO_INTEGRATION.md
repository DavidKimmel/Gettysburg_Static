# Portfolio Integration Guide

This guide provides multiple ways to showcase your Gettysburg Park Guide app in your portfolio.

## Table of Contents
1. [Quick Links](#quick-links)
2. [Embedding in Portfolio Website](#embedding-in-portfolio-website)
3. [GitHub Portfolio README](#github-portfolio-readme)
4. [Project Screenshots](#project-screenshots)
5. [Resume & Cover Letter Points](#resume--cover-letter-points)

---

## Quick Links

After deploying to Render, you'll have these URLs:
- **Live App**: `https://your-app-name.onrender.com`
- **Source Code**: `https://github.com/YOUR-USERNAME/gettysburg-park-guide`
- **API Docs**: `https://your-app-name.onrender.com/api/test`

---

## Embedding in Portfolio Website

### Option 1: Full Iframe Embed

Best for: Showcasing the interactive app directly in your portfolio

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Portfolio - Projects</title>
    <style>
        .project-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .project-header {
            margin-bottom: 20px;
        }
        .project-iframe {
            width: 100%;
            height: 700px;
            border: 2px solid #2d5016;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .project-links {
            margin-top: 20px;
            display: flex;
            gap: 15px;
        }
        .btn {
            padding: 10px 20px;
            background-color: #2d5016;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        .btn:hover {
            background-color: #1f3810;
        }
        .tech-stack {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 15px;
        }
        .tech-badge {
            padding: 5px 12px;
            background-color: #f0f0f0;
            border-radius: 4px;
            font-size: 14px;
        }
        .loading-note {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="project-container">
        <div class="project-header">
            <h1>🏛️ Gettysburg National Military Park Guide</h1>
            <p>
                A full-stack web mapping application for exploring Gettysburg National Military Park.
                Features interactive maps, spatial queries, and user-generated content.
            </p>

            <div class="loading-note">
                ⏱️ <strong>Note:</strong> This app runs on Render's free tier.
                First load may take 30-60 seconds as the server spins up.
                Subsequent loads are instant.
            </div>

            <div class="tech-stack">
                <span class="tech-badge">Node.js</span>
                <span class="tech-badge">Express.js</span>
                <span class="tech-badge">PostgreSQL</span>
                <span class="tech-badge">PostGIS 3.5</span>
                <span class="tech-badge">Leaflet.js</span>
                <span class="tech-badge">Bootstrap 5</span>
                <span class="tech-badge">GeoJSON</span>
            </div>
        </div>

        <iframe
            class="project-iframe"
            src="https://your-app-name.onrender.com"
            title="Gettysburg Park Guide"
            loading="lazy">
        </iframe>

        <div class="project-links">
            <a href="https://your-app-name.onrender.com" target="_blank" class="btn">
                🚀 Open Full App
            </a>
            <a href="https://github.com/YOUR-USERNAME/gettysburg-park-guide" target="_blank" class="btn">
                💻 View Source Code
            </a>
            <a href="https://github.com/YOUR-USERNAME/gettysburg-park-guide#readme" target="_blank" class="btn">
                📚 Read Documentation
            </a>
        </div>
    </div>
</body>
</html>
```

### Option 2: Card-Based Layout

Best for: Portfolio with multiple projects in a grid/card layout

```html
<div class="portfolio-grid">
    <!-- Your other projects here -->

    <div class="project-card">
        <div class="card-image">
            <img src="assets/gettysburg-screenshot.png" alt="Gettysburg Park Guide Screenshot">
            <div class="card-overlay">
                <a href="https://your-app-name.onrender.com" target="_blank" class="overlay-btn">View Live</a>
            </div>
        </div>
        <div class="card-content">
            <h3>Gettysburg National Military Park Guide</h3>
            <p class="card-description">
                Interactive web mapping application with 600+ geospatial features,
                real-time spatial queries, and user story submissions.
            </p>
            <div class="card-features">
                <ul>
                    <li>✓ PostgreSQL/PostGIS spatial database</li>
                    <li>✓ RESTful API serving GeoJSON</li>
                    <li>✓ Interactive Leaflet.js maps</li>
                    <li>✓ File upload system with multer</li>
                    <li>✓ Responsive mobile design</li>
                </ul>
            </div>
            <div class="card-tech">
                <span class="tech-tag">Node.js</span>
                <span class="tech-tag">PostGIS</span>
                <span class="tech-tag">Leaflet</span>
            </div>
            <div class="card-links">
                <a href="https://your-app-name.onrender.com" target="_blank">Live Demo</a>
                <a href="https://github.com/YOUR-USERNAME/gettysburg-park-guide" target="_blank">Code</a>
            </div>
        </div>
    </div>
</div>

<style>
    .project-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.3s, box-shadow 0.3s;
    }
    .project-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }
    .card-image {
        position: relative;
        height: 250px;
        overflow: hidden;
    }
    .card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .card-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(45, 80, 22, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
    }
    .card-image:hover .card-overlay {
        opacity: 1;
    }
    .overlay-btn {
        padding: 12px 24px;
        background: white;
        color: #2d5016;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
    }
    .card-content {
        padding: 20px;
    }
    .card-features ul {
        list-style: none;
        padding: 0;
        margin: 15px 0;
    }
    .card-features li {
        padding: 5px 0;
        font-size: 14px;
    }
    .tech-tag {
        display: inline-block;
        padding: 4px 10px;
        margin: 2px;
        background: #e9ecef;
        border-radius: 3px;
        font-size: 12px;
    }
    .card-links {
        display: flex;
        gap: 15px;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #eee;
    }
    .card-links a {
        color: #2d5016;
        font-weight: 500;
        text-decoration: none;
    }
</style>
```

### Option 3: React Component (for React portfolios)

```jsx
import React from 'react';

function GettysburgProject() {
  return (
    <div className="project-showcase">
      <h2>Gettysburg National Military Park Guide</h2>

      <div className="project-description">
        <p>
          Full-stack GIS web application demonstrating spatial database design,
          RESTful API development, and interactive web mapping.
        </p>
      </div>

      <div className="project-highlights">
        <div className="highlight-item">
          <h4>📊 Database Architecture</h4>
          <p>PostgreSQL with PostGIS extension handling 600+ spatial features</p>
        </div>
        <div className="highlight-item">
          <h4>🗺️ Geospatial Features</h4>
          <p>Real-time spatial queries, GeoJSON serving, and interactive layers</p>
        </div>
        <div className="highlight-item">
          <h4>👥 User Content</h4>
          <p>Story submission system with image uploads and moderation</p>
        </div>
      </div>

      <iframe
        src="https://your-app-name.onrender.com"
        width="100%"
        height="600px"
        frameBorder="0"
        title="Gettysburg Park Guide"
        className="project-iframe"
      />

      <div className="project-footer">
        <a
          href="https://your-app-name.onrender.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Launch App
        </a>
        <a
          href="https://github.com/YOUR-USERNAME/gettysburg-park-guide"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          View Code
        </a>
      </div>
    </div>
  );
}

export default GettysburgProject;
```

---

## GitHub Portfolio README

Add this section to your main portfolio repository's README.md:

```markdown
# 👨‍💻 Portfolio

## Featured Projects

### 🏛️ Gettysburg National Military Park Guide

[![Live Demo](https://img.shields.io/badge/Demo-Live-green)](https://your-app-name.onrender.com)
[![GitHub](https://img.shields.io/badge/Code-GitHub-blue)](https://github.com/YOUR-USERNAME/gettysburg-park-guide)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Interactive web mapping application for exploring Gettysburg National Military Park**

![Gettysburg App Screenshot](https://your-image-host.com/screenshot.png)

#### 🎯 Key Features
- 🗺️ Interactive Leaflet.js map with 600+ geospatial features
- 🔍 Real-time monument search with debouncing
- 📍 Spatial queries for nearest facilities
- 📝 User story submissions with photo uploads
- ♿ Accessibility ratings for monuments
- ⚔️ Historical battle site overlays

#### 🛠️ Technical Stack
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL 15 with PostGIS 3.5
- **Frontend**: Vanilla JavaScript, Leaflet.js, Bootstrap 5
- **APIs**: RESTful endpoints serving GeoJSON
- **Deployment**: Render.com (containerized)

#### 💡 Technical Highlights
- Designed normalized database schema with spatial indexes
- Implemented efficient spatial queries using PostGIS functions
- Built RESTful API with proper error handling and validation
- Created responsive UI with mobile-first approach
- Handled file uploads with Multer and validation
- Deployed to cloud with PostgreSQL/PostGIS database

#### 📊 Database Stats
- 91 Monuments & Memorials
- 480 Trail Segments
- 24 Facilities
- 11 Battle Sites
- Total: 606+ Spatial Features

#### 🔗 Links
- **[Live Application](https://your-app-name.onrender.com)** - View the deployed app
- **[Source Code](https://github.com/YOUR-USERNAME/gettysburg-park-guide)** - Explore the codebase
- **[API Documentation](https://your-app-name.onrender.com/api/test)** - Test the API

---

## Other Projects
<!-- Your other projects here -->
```

---

## Project Screenshots

### Taking Effective Screenshots

Use these for your portfolio:

1. **Full App View**
   - Show the complete interface with sidebar and map
   - Make sure several layers are visible
   - Zoom level: 13-14 (shows good detail)

2. **Feature Popup**
   - Click a monument to show the popup
   - Capture the detailed information display
   - Highlights the data richness

3. **Search Functionality**
   - Type in search box showing results
   - Demonstrates interactive features

4. **Mobile View**
   - Open browser dev tools
   - Toggle device emulation (iPhone/Android)
   - Show responsive design

### Screenshot Tools
- **Windows**: Snipping Tool or Windows + Shift + S
- **Mac**: Command + Shift + 4
- **Browser**: Firefox/Chrome Screenshot tool (F12 → Screenshot)

### Recommended Dimensions
- Full width: 1920x1080 (desktop view)
- Mobile: 375x667 (iPhone SE) or 360x640 (Android)
- Thumbnail: 800x450 (for cards)

---

## Resume & Cover Letter Points

### Resume - Projects Section

```
GETTYSBURG NATIONAL MILITARY PARK GUIDE | Node.js, PostgreSQL/PostGIS, Leaflet.js
https://your-app-name.onrender.com | GitHub: /YOUR-USERNAME/gettysburg-park-guide

• Developed full-stack GIS web application serving 600+ spatial features via RESTful API
• Designed PostgreSQL database schema with PostGIS extension for efficient spatial queries
• Implemented interactive Leaflet.js mapping interface with real-time search and filtering
• Built user content submission system with file uploads, validation, and storage
• Deployed to Render.com with automated CI/CD pipeline from GitHub repository
```

### Cover Letter Talking Points

When discussing this project:

> "I developed a full-stack geospatial web application for Gettysburg National Military
> Park that showcases my expertise in database design, API development, and interactive
> mapping. The project uses PostgreSQL with PostGIS to efficiently query and serve over
> 600 spatial features through a RESTful API, and features an interactive Leaflet.js
> interface. I handled the entire development lifecycle from database schema design to
> cloud deployment on Render.com."

### Skills Demonstrated

Highlight these skills in applications:

**Backend Development:**
- Node.js & Express.js server architecture
- RESTful API design and implementation
- Database schema design and optimization
- Spatial data management with PostGIS

**Frontend Development:**
- Interactive web mapping with Leaflet.js
- Responsive design with Bootstrap
- Vanilla JavaScript (no framework dependencies)
- Form validation and UX design

**Database:**
- PostgreSQL database administration
- PostGIS spatial extensions
- Spatial indexes and query optimization
- Data import and migration

**DevOps:**
- Cloud deployment (Render.com)
- Environment configuration management
- Git version control
- CI/CD concepts

---

## Additional Resources

### Blog Post Ideas

Write a technical blog post about your project:

1. **"Building a Full-Stack GIS Application with PostGIS"**
   - Database design decisions
   - Spatial query optimization
   - Challenges and solutions

2. **"Deploying a Node.js + PostgreSQL App to Render.com"**
   - Step-by-step deployment guide
   - Environment configuration
   - Cost optimization tips

3. **"Interactive Web Mapping with Leaflet.js"**
   - Layer management
   - Custom markers and popups
   - Performance considerations

### Demo Video Script

Create a 2-minute demo video:

1. **Intro (15 sec)**
   - "This is my Gettysburg Park Guide application..."
   - Show homepage loading

2. **Features (60 sec)**
   - Toggle layers on/off
   - Search for a monument
   - Click popup to show details
   - Submit a user story

3. **Technical (30 sec)**
   - Quick look at code in GitHub
   - Mention tech stack
   - Show API endpoint

4. **Outro (15 sec)**
   - Links to live app and code
   - Thank you message

---

## Updating Portfolio

After deployment, remember to:

- [ ] Update all `your-app-name` with actual Render URL
- [ ] Update all `YOUR-USERNAME` with your GitHub username
- [ ] Take and upload screenshots
- [ ] Add project to LinkedIn profile
- [ ] Share on Twitter/social media with #webdev #GIS hashtags
- [ ] Update resume with project link
- [ ] Add to portfolio website

---

**Good luck showcasing your project!** 🚀

This application demonstrates real-world full-stack development skills that employers value.
