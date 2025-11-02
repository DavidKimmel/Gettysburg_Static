# Deploy Your App NOW! 🚀

Your code is on GitHub: https://github.com/DavidKimmel/Gettysburg_Static

## Quick Deploy to Render (5 Minutes)

### Step 1: Go to Render
👉 https://dashboard.render.com/

Sign in or create a free account.

### Step 2: New Blueprint
1. Click **"New +"** button (top right)
2. Select **"Blueprint"**

### Step 3: Connect GitHub
1. Click **"Connect account"** to link GitHub
2. Search for: `Gettysburg_Static`
3. Click **"Connect"** on your repository

### Step 4: Deploy!
1. Render detects `render.yaml` automatically
2. Service name will be: `gettysburg-park-guide` (or customize it)
3. Click **"Apply"**
4. Wait 3-5 minutes for deployment

### Step 5: Get Your URL
Once deployed, you'll see:
```
✅ Live at: https://gettysburg-park-guide.onrender.com
```

**Note**: If you changed the service name, the URL will be different. Copy YOUR actual URL!

---

## After Deployment

### Update CORS (Important!)

1. Copy your actual Render URL
2. Edit `backend/server-static.js` line 21:
   ```javascript
   'https://YOUR-ACTUAL-URL.onrender.com' // Replace with your real URL
   ```
3. Commit and push:
   ```bash
   git add .
   git commit -m "Update CORS with actual Render URL"
   git push
   ```
4. Render will auto-redeploy (2 minutes)

### Update README

Edit `README.md` line 7 and add your live URL:
```markdown
[Live Demo](https://your-actual-url.onrender.com)
```

Commit and push again!

---

## Test Your Deployment

Visit your live URL and test:
- ✅ Map loads with all markers
- ✅ Search works
- ✅ Layers toggle on/off
- ✅ Click monuments to see popups
- ✅ Submit a test story (saves to localStorage)

---

## Troubleshooting

### First load is slow (30-60 seconds)
**Normal!** Render free tier sleeps after 15 minutes of inactivity. Just wait for it to wake up.

### "Service Unavailable"
Wait a minute and refresh - it's waking up from sleep.

### Map doesn't load
1. Open browser console (F12)
2. Check for errors
3. Verify URL in address bar is correct

### CORS errors
Make sure you updated line 21 in `server-static.js` with your actual Render URL!

---

## Share Your App!

Once it's live, add it to:

### Your Resume
```
Gettysburg National Military Park Guide
https://your-app.onrender.com | GitHub: /DavidKimmel/Gettysburg_Static

• Full-stack GIS web application with 600+ spatial features
• PostgreSQL/PostGIS database design (converted to static JSON)
• Interactive Leaflet.js mapping with real-time search
• Node.js/Express RESTful API serving GeoJSON
• Deployed to Render.com with automated CI/CD
```

### LinkedIn
Add under "Projects" section:
- **Title**: Gettysburg National Military Park Guide
- **URL**: [Your Render URL]
- **Description**: Full-stack geospatial web application demonstrating database design, API development, and interactive mapping

### Your Portfolio Website
Use the examples from [PORTFOLIO_INTEGRATION.md](PORTFOLIO_INTEGRATION.md)

---

## Cost Tracking

Your monthly cost: **$0** 🎉

Render free tier includes:
- ✅ 750 hours/month (plenty!)
- ✅ Automatic SSL/HTTPS
- ✅ Custom domain support
- ✅ Automatic deployments from GitHub

---

## Next Deployment (Updates)

When you make changes to your code:

```bash
git add .
git commit -m "Your change description"
git push
```

Render automatically:
1. Detects the push
2. Rebuilds your app
3. Deploys the new version

Takes about 3-5 minutes.

---

## Important URLs

- **Your GitHub Repo**: https://github.com/DavidKimmel/Gettysburg_Static
- **Render Dashboard**: https://dashboard.render.com/
- **Your Live App**: [Fill this in after deployment!]

---

## Need Help?

1. Check [DEPLOYMENT_STATIC.md](DEPLOYMENT_STATIC.md) for detailed guide
2. View Render logs in dashboard for errors
3. Render docs: https://render.com/docs

---

**You're ready to deploy!**

This will take 5 minutes and cost $0. Go for it! 🚀
