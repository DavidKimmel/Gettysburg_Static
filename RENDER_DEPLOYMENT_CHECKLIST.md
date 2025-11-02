# Render.com Deployment Checklist

Quick reference guide for deploying your Gettysburg Park Guide to Render.com.

## 📋 Pre-Deployment Checklist

- [ ] GitHub account created
- [ ] Render.com account created (free tier)
- [ ] Local app tested and working
- [ ] All dependencies installed (`npm install`)
- [ ] Environment variables configured in `.env`

## 🔧 Code Modifications (Already Done!)

- [x] Added `render.yaml` blueprint file
- [x] Created `.env.example` template
- [x] Fixed CORS settings in `backend/server.js`
- [x] Made API_URL environment-aware in `frontend/js/map.js`
- [x] Updated package.json with scripts
- [x] Created database initialization script
- [x] Added .gitignore

## 📝 Before You Push to GitHub

### 1. Update CORS Origins

Edit `backend/server.js` lines 18-22:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://YOUR-GITHUB-USERNAME.github.io',  // ← Update this
  'https://YOUR-APP-NAME.onrender.com'       // ← Update this
];
```

### 2. Update render.yaml (Optional)

Edit `render.yaml` line 6 if you want a different app name:

```yaml
services:
  - type: web
    name: your-chosen-app-name  # ← Change this
```

## 🚀 Deployment Steps

### Step 1: Push to GitHub

```bash
# In your project directory
git init
git add .
git commit -m "Initial commit - Ready for Render deployment"

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR-USERNAME/gettysburg-park-guide.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Render (Blueprint Method)

1. Go to https://dashboard.render.com/
2. Click **"New +" → "Blueprint"**
3. Connect your GitHub repository
4. Render auto-detects `render.yaml`
5. Click **"Apply"**
6. Wait 5-10 minutes for deployment

### Step 3: Initialize Database

Once deployed, open your web service's Shell:

```bash
# Initialize schema
npm run init-db

# Import all data (takes 5-10 minutes)
npm run import-all
```

Or run individually:
```bash
node backend/import_places.js
node backend/import_facilities.js
node backend/import-trails.js
node backend/import_boundary.js
```

### Step 4: Verify Deployment

Test these URLs (replace with your app name):

- [ ] https://your-app-name.onrender.com/api/test
- [ ] https://your-app-name.onrender.com/api/monuments
- [ ] https://your-app-name.onrender.com (full app)

## 🔍 Troubleshooting

### Database Connection Failed

**Check:**
1. Render Dashboard → Database → Ensure it's "Available"
2. Web Service → Environment → Verify all DB_* variables exist
3. Logs → Look for connection errors

**Fix:**
```bash
# In Render Shell
echo $DB_HOST
echo $DB_NAME
# Should show your database connection info
```

### App Returns 503 Service Unavailable

**Cause:** Render free tier spins down after 15 min inactivity

**Fix:** Wait 30-60 seconds for cold start, then reload

### Import Scripts Fail

**Check:**
1. Files exist in `backend/data/` directory
2. Database schema created successfully
3. PostGIS extension enabled

**Fix:**
```bash
# Verify PostGIS
psql $DATABASE_URL -c "SELECT PostGIS_version();"

# Re-run init
npm run init-db
```

### CORS Errors in Browser Console

**Fix:**
1. Update `allowedOrigins` in `backend/server.js`
2. Commit and push to GitHub
3. Render auto-redeploys
4. Wait for build to complete

### Map Not Loading

**Check:**
- Browser console for errors
- Network tab for failed API calls
- API_URL in `frontend/js/map.js`

**Should be:**
```javascript
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';
```

## 💰 Cost Breakdown

### Free Tier (First 90 Days)
- Web Service: FREE (with sleep after 15 min)
- PostgreSQL: FREE (expires after 90 days)
- **Total: $0/month**

### After 90 Days
- Web Service: FREE or $7/month (no sleep)
- PostgreSQL: $7/month (required)
- **Minimum: $7/month**

### Recommended for Portfolio
- Keep free web service (acceptable for portfolio)
- Upgrade database after 90 days ($7/month)
- **Total: $7/month**

## 📊 Database Storage Check

Monitor your storage usage:

```bash
# In Render Database Shell (psql)
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

Free tier limit: **1 GB**

Your app uses approximately: **~50-100 MB** (safe!)

## 🔄 Updating Your App

When you make changes:

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

Render automatically:
1. Detects push
2. Rebuilds app
3. Deploys new version
4. Takes ~5 minutes

## 🔐 Security Notes

### Environment Variables
Never commit these to GitHub:
- `.env` file (already in .gitignore)
- Database passwords
- API keys (if you add any)

### HTTPS
Render provides free SSL certificates automatically!
All traffic uses HTTPS by default.

## 📱 Monitoring

### Check App Status
- Dashboard → Your Web Service → Status
- Should show: "Live"

### View Logs
- Dashboard → Your Web Service → Logs
- Real-time application logs
- Filter by error/warning

### Database Metrics
- Dashboard → Your Database → Metrics
- Connection count
- Storage usage
- Query performance

## 🎯 Next Steps After Deployment

1. **Test Everything**
   - [ ] All API endpoints work
   - [ ] Map loads properly
   - [ ] Search functionality
   - [ ] User submissions work
   - [ ] File uploads functional

2. **Update Portfolio**
   - [ ] Add live link to resume
   - [ ] Update GitHub portfolio README
   - [ ] Add to LinkedIn projects
   - [ ] Embed in portfolio website

3. **Take Screenshots**
   - [ ] Desktop view
   - [ ] Mobile view
   - [ ] Features in action
   - [ ] Code snippets

4. **Share**
   - [ ] LinkedIn post
   - [ ] Twitter with #webdev #GIS
   - [ ] Add to job applications

## 📧 Support Resources

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **PostGIS Docs**: https://postgis.net/docs/
- **This Project**: See DEPLOYMENT.md for detailed guide

## ✅ Deployment Complete!

Once all checks pass:

```
✅ App deployed to Render
✅ Database initialized and populated
✅ All features working
✅ Portfolio updated
✅ Ready to share with employers!
```

---

**Your app URL:**
`https://__________.onrender.com`

**GitHub repo:**
`https://github.com/________/gettysburg-park-guide`

**Fill these in and share!** 🎉
