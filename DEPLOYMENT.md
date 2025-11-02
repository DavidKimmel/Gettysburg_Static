# Deployment Guide - Render.com

This guide walks you through deploying the Gettysburg Park Guide app to Render.com as a portfolio piece.

## Prerequisites

- GitHub account
- Render.com account (free tier available)
- Git installed locally

## Step 1: Prepare Your Repository

1. **Initialize Git repository** (if not already done):
   ```bash
   cd gettysburg-park-app
   git init
   git add .
   git commit -m "Initial commit - Gettysburg Park Guide"
   ```

2. **Create a new GitHub repository**:
   - Go to https://github.com/new
   - Name it: `gettysburg-park-guide`
   - Make it public (for portfolio visibility)
   - Don't initialize with README (we already have one)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/gettysburg-park-guide.git
   git branch -M main
   git push -u origin main
   ```

4. **Update CORS settings** in `backend/server.js`:
   - Replace `'https://your-portfolio-domain.github.io'` with your actual portfolio URL
   - Replace `'https://gettysburg-park-guide.onrender.com'` with your chosen Render app name

## Step 2: Deploy to Render

### Option A: Using Blueprint (Recommended - Easiest)

1. **Sign in to Render**: https://dashboard.render.com/

2. **New Blueprint Instance**:
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository: `YOUR-USERNAME/gettysburg-park-guide`
   - Render will automatically detect the `render.yaml` file

3. **Name your services**:
   - Web Service: `gettysburg-park-guide` (or your preferred name)
   - Database: `gettysburg-db`

4. **Deploy**: Click "Apply" and wait for deployment (5-10 minutes)

### Option B: Manual Setup (More Control)

#### Create PostgreSQL Database First

1. In Render Dashboard, click "New +" → "PostgreSQL"
2. Configure:
   - **Name**: `gettysburg-db`
   - **Database**: `gettysburg_park`
   - **Region**: Oregon (or closest to you)
   - **Plan**: Free
   - **PostgreSQL Version**: 15

3. Click "Create Database"
4. **Save the connection details** (you'll need them)

#### Create Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `gettysburg-park-guide`
   - **Region**: Same as database (Oregon)
   - **Branch**: main
   - **Root Directory**: Leave blank
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node backend/server.js`
   - **Plan**: Free

4. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable"

   Add these variables (get values from your database's "Connect" page):
   ```
   NODE_ENV=production
   PORT=10000
   DB_USER=<from_database_connection_info>
   DB_HOST=<from_database_connection_info>
   DB_NAME=gettysburg_park
   DB_PASSWORD=<from_database_connection_info>
   DB_PORT=<from_database_connection_info>
   ```

5. Click "Create Web Service"

## Step 3: Initialize the Database

After your web service is deployed:

1. **Open Render Shell**:
   - Go to your web service in Render Dashboard
   - Click "Shell" tab
   - Wait for shell to load

2. **Run initialization script**:
   ```bash
   node backend/database/init-production-db.js
   ```

3. **Import data** (run each command):
   ```bash
   node backend/import_places.js
   node backend/import_facilities.js
   node backend/import-trails.js
   node backend/import_boundary.js
   ```

   *Note: These scripts may take several minutes to complete. Watch for success messages.*

## Step 4: Verify Deployment

1. **Check API endpoint**:
   Visit: `https://your-app-name.onrender.com/api/test`

   Should see:
   ```json
   {
     "message": "API is working!",
     "timestamp": "2025-..."
   }
   ```

2. **Check monuments data**:
   Visit: `https://your-app-name.onrender.com/api/monuments`

   Should return GeoJSON with 91 monuments

3. **Open the full app**:
   Visit: `https://your-app-name.onrender.com`

   Map should load with all layers visible

## Step 5: Embed in Your Portfolio

### Option 1: Iframe Embed (Easiest)

Add this to your portfolio HTML:

```html
<div class="project-showcase">
  <h2>Gettysburg National Military Park Guide</h2>
  <p>Interactive web mapping application built with Node.js, Express, PostgreSQL/PostGIS, and Leaflet.js</p>

  <iframe
    src="https://your-app-name.onrender.com"
    width="100%"
    height="600px"
    frameborder="0"
    title="Gettysburg Park Guide">
  </iframe>

  <p>
    <a href="https://your-app-name.onrender.com" target="_blank">Open in new tab</a> |
    <a href="https://github.com/YOUR-USERNAME/gettysburg-park-guide" target="_blank">View Code</a>
  </p>
</div>
```

### Option 2: Link Card (Professional)

```html
<div class="portfolio-card">
  <img src="path/to/screenshot.png" alt="Gettysburg Park Guide">
  <h3>Gettysburg National Military Park Guide</h3>
  <p>Full-stack GIS web application featuring:</p>
  <ul>
    <li>Interactive mapping with 600+ spatial features</li>
    <li>PostgreSQL/PostGIS backend</li>
    <li>RESTful API with GeoJSON</li>
    <li>User-generated content with file uploads</li>
  </ul>
  <p>
    <strong>Tech Stack:</strong> Node.js, Express, PostgreSQL, PostGIS, Leaflet.js, Bootstrap
  </p>
  <div class="project-links">
    <a href="https://your-app-name.onrender.com" target="_blank">Live Demo</a>
    <a href="https://github.com/YOUR-USERNAME/gettysburg-park-guide" target="_blank">Source Code</a>
  </div>
</div>
```

### Option 3: GitHub README Portfolio

Update your portfolio repository's README.md:

```markdown
## Featured Projects

### 🏛️ Gettysburg National Military Park Guide
**[Live Demo](https://your-app-name.onrender.com)** | **[Source Code](https://github.com/YOUR-USERNAME/gettysburg-park-guide)**

Interactive web mapping application for exploring Gettysburg National Military Park.

**Features:**
- Interactive Leaflet.js map with 600+ geospatial features
- Monument search and filtering
- User story submissions with photo uploads
- Accessibility ratings for monuments
- Battle site overlays with historical data

**Tech Stack:**
- Backend: Node.js, Express.js
- Database: PostgreSQL 15 with PostGIS 3.5
- Frontend: Vanilla JavaScript, Leaflet.js, Bootstrap 5
- Deployment: Render.com

![App Screenshot](path/to/screenshot.png)
```

## Important Notes

### Free Tier Limitations

**Render Free Tier:**
- Web Service: Spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds (cold start)
- 750 hours/month (plenty for a portfolio)

**PostgreSQL Free Tier:**
- 1GB storage
- Expires after 90 days (then $7/month)
- Plan accordingly or migrate to paid tier

### Performance Optimization

To reduce cold starts, you can:
1. Use a service like UptimeRobot to ping your app every 14 minutes
2. Add this to your portfolio README as a note about loading time
3. Upgrade to paid tier ($7/month) for always-on service

### Updating Your Deployment

To push updates:
```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```

Render will automatically redeploy when you push to GitHub.

## Troubleshooting

### Database Connection Errors

1. Check environment variables in Render Dashboard
2. Verify database is running (Render Dashboard → Database)
3. Check logs: Render Dashboard → Web Service → Logs

### Data Not Appearing

1. Verify import scripts ran successfully
2. Check database has data:
   - Render Dashboard → Database → Connect
   - Use provided psql command
   - Run: `SELECT COUNT(*) FROM monuments;`

### CORS Errors

1. Update `allowedOrigins` in `backend/server.js`
2. Commit and push changes
3. Wait for redeploy

### Map Not Loading

1. Check browser console for errors
2. Verify API_URL is correct (should use relative path in production)
3. Test API endpoints directly: `/api/monuments`

## Cost Estimates

**Free Tier:**
- First 90 days: $0
- After 90 days: $7/month (database only)

**Paid Tier (if needed):**
- Web Service: $7/month (always-on, no cold starts)
- Database: $7/month (persistent after 90 days)
- Total: $14/month

## Alternative Database Hosting (Free Forever)

If you want to avoid the 90-day limit:

1. **Supabase** (2 free projects, 500MB each)
2. **Neon** (3 free projects, 0.5GB storage each)
3. **ElephantSQL** (20MB free - too small for this app)

Update connection string in Render environment variables if switching.

## Support

For issues:
1. Check Render logs first
2. Verify all environment variables are set
3. Test database connection from Render Shell
4. Review this guide's troubleshooting section

---

**Good luck with your deployment!** 🚀

Remember to update your portfolio links once deployed and share your app URL with potential employers!
