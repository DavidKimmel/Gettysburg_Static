# 5-Minute Demo Script - Gettysburg National Military Park Guide

**Total Time: 5 minutes**
**Live URL**: https://gettysburg-static.onrender.com

---

## 🎬 INTRODUCTION (30 seconds)

**[Camera on you or screen recording starts]**

> "Hi, I'm [Your Name], and today I'm going to demonstrate my Gettysburg National Military Park Guide - a full-stack geospatial web application I built using Node.js, Express, PostgreSQL with PostGIS, and Leaflet.js.

> This application helps visitors explore over 600 spatial features across the Gettysburg battlefield, including monuments, trails, facilities, and historical battle sites. Let's dive in."

**[Navigate to: https://gettysburg-static.onrender.com]**

---

## 📱 INTERFACE OVERVIEW (30 seconds)

**[Pan across the screen slowly]**

> "As you can see, the application features a clean, responsive interface with a sidebar on the left containing our controls, and an interactive Leaflet map on the right showing the Gettysburg battlefield.

> The map is currently displaying all our layers - you can see the park boundary outlined in green, with various colored markers representing different feature types. Let's explore what each of these represents."

---

## 🗺️ LAYER CONTROLS (45 seconds)

**[Hover over the sidebar]**

> "In the sidebar, we have layer controls that allow users to toggle different data layers on and off. Let me demonstrate."

**[Uncheck "Monuments"]**

> "When I turn off monuments, all 91 monument markers disappear from the map."

**[Check "Monuments" back on]**

> "And they come right back. We have 480 trail segments..."

**[Toggle "Trails" off/on quickly]**

> "24 facilities including parking and visitor centers..."

**[Toggle "Facilities" off/on quickly]**

> "And 11 historical battle sites shown as semi-transparent red polygons."

**[Toggle "Battle Sites" off/on]**

> "This gives users complete control over what information they want to see at any given time."

---

## 🔍 SEARCH FUNCTIONALITY (45 seconds)

**[Click in the search box]**

> "The application includes real-time search functionality for monuments. Let me search for 'North Carolina'."

**[Type "North Carolina" in search box]**

> "As I type, the application uses debounced search to find matching monuments. You can see it found several North Carolina state monuments."

**[Click on one of the search results]**

> "When I click a result, the map automatically zooms to that monument and opens its popup with detailed information."

**[Point to the popup]**

> "Here we can see the monument name, a description of its historical significance, dedication date, and accessibility rating shown with stars."

**[Clear the search]**

> "Let me clear that and show you more features."

---

## 📍 INTERACTIVE MARKERS (60 seconds)

**[Click on a monument marker]**

> "Each monument marker is interactive. When clicked, it displays a popup with detailed information."

**[Scroll through the popup if description is long]**

> "For longer descriptions, we have a 'Read More' button that expands the full text."

**[Click "Read More" if available]**

> "This keeps the interface clean while still providing access to comprehensive historical information."

**[Close popup, click on a trail]**

> "Trails work similarly - when you click on a trail line, you see information about the trail's length in miles, surface type, difficulty level, and accessibility."

**[Close, click on a facility]**

> "Facilities show their type - like parking or visitor centers - operating hours if available, and accessibility information."

**[Close, click on a battle site polygon]**

> "And battle sites display the name, date, historical description, and casualty estimates for that engagement."

---

## 👥 USER SUBMISSIONS (60 seconds)

**[Scroll down sidebar to "Community Stories"]**

> "One unique feature of this application is the ability for visitors to share their own stories and experiences. Let me show you how this works."

**[Click "Browse Stories" button]**

**[Modal should open with existing stories]**

> "Visitors can browse stories submitted by other users, sharing tips, personal experiences, or historical insights."

**[Close the modal]**

**[Click on any monument to open popup]**

> "To submit a story, users click on any monument, and you'll see a 'Share Your Story' button in the popup."

**[Click "Share Your Story" button]**

**[Form modal opens]**

> "This opens a submission form where users can enter their name - which is optional - and write their story or tip about this location. There's a character counter showing the 500 character limit."

**[Type in some demo text like "Great views from this monument. Bring your camera!"]**

> "Users can also optionally add a photo either by uploading from their device or entering a photo URL."

**[Don't actually submit, just show the interface]**

> "In this demo version, submissions are stored in the browser's local storage, but in a production version with a database, these would be saved server-side and shared with all visitors."

**[Close the modal]**

---

## 🎨 TECHNICAL FEATURES (45 seconds)

**[Zoom in and out on the map, pan around]**

> "From a technical perspective, this application demonstrates several key full-stack development concepts.

> The backend is built with Node.js and Express, serving a RESTful API with endpoints for each data layer. All spatial data is returned in GeoJSON format, which is the standard for web-based mapping applications."

**[Open browser dev tools (F12), go to Network tab, refresh]**

> "If we look at the network requests, you can see the API calls fetching data from endpoints like /api/monuments, /api/trails, and so on."

**[Close dev tools]**

> "The database was originally designed using PostgreSQL with the PostGIS extension for spatial operations. I created normalized schemas with spatial indexes for efficient querying of geometric data. For this portfolio deployment, I converted the data to static JSON files, but all the database design is documented in the repository."

---

## 📊 DATA & STATISTICS (30 seconds)

**[Scroll to bottom of sidebar showing stats]**

> "The application manages over 600 spatial features in total:
> - 91 monuments and memorials
> - 480 trail segments with detailed accessibility information
> - 24 facilities including parking and visitor services
> - 11 historical battle sites
> - All within the park boundary which you see outlined on the map."

---

## 🎯 CLOSING (30 seconds)

**[Zoom out to show full park view]**

> "This project demonstrates my skills in:
> - Full-stack JavaScript development with Node.js and Express
> - Spatial database design using PostgreSQL and PostGIS
> - RESTful API design serving GeoJSON
> - Interactive web mapping with Leaflet.js
> - Responsive frontend design with Bootstrap
> - And cloud deployment using Render.com

> The complete source code is available on my GitHub, and this application is deployed and accessible at the URL shown here. Thank you for watching!"

**[End recording]**

---

## 🎥 FILMING TIPS

### Before Recording:
1. ✅ Test the app - make sure it loads properly
2. ✅ Clear browser cache for clean load
3. ✅ Close unnecessary browser tabs
4. ✅ Have the script on a second monitor or printed
5. ✅ Test your microphone
6. ✅ Zoom to ~110% for better visibility in video

### During Recording:
- **Speak clearly and at a moderate pace**
- **Pause briefly between sections** (easier to edit)
- **Use your cursor to point** at elements you're discussing
- **Move slowly** - quick movements are hard to follow
- **If you make a mistake**, pause, then start that section again (easy to edit out)

### Screen Recording Settings:
- **Resolution**: 1920x1080 (Full HD)
- **Frame rate**: 30fps minimum
- **Audio**: Enable microphone
- **Cursor**: Show cursor in recording

### Recommended Tools:
- **Windows**: OBS Studio (free) or Camtasia
- **Mac**: QuickTime Screen Recording or ScreenFlow
- **Online**: Loom (easiest, free tier available)

---

## 📝 ALTERNATIVE: 3-MINUTE VERSION

If you need a shorter demo, cut these sections:
- ❌ User Submissions (save 60 seconds)
- ❌ Technical Features with dev tools (save 30 seconds)
- ✅ Keep everything else = ~3 minutes

---

## 🎬 SCENE-BY-SCENE CHECKLIST

Use this during recording to track progress:

- [ ] Introduction (30s)
- [ ] Interface Overview (30s)
- [ ] Layer Controls Demo (45s)
- [ ] Search Functionality (45s)
- [ ] Interactive Markers (60s)
- [ ] User Submissions (60s)
- [ ] Technical Features (45s)
- [ ] Data & Statistics (30s)
- [ ] Closing (30s)

**Total: 5 minutes**

---

## 🚀 AFTER RECORDING

1. **Edit the video** (optional):
   - Trim dead space at beginning/end
   - Cut out any mistakes
   - Add title card: "Gettysburg National Military Park Guide"
   - Add closing card with GitHub link

2. **Export settings**:
   - Format: MP4 (H.264)
   - Resolution: 1080p
   - Bitrate: 5-8 Mbps

3. **Upload to**:
   - YouTube (public or unlisted)
   - LinkedIn (native upload)
   - Your portfolio website
   - Vimeo

4. **Video description** (for YouTube/Vimeo):
   ```
   Demonstration of my Gettysburg National Military Park Guide web application.

   A full-stack GIS application featuring:
   • Interactive Leaflet.js maps with 600+ spatial features
   • PostgreSQL/PostGIS database design
   • RESTful API serving GeoJSON
   • Real-time search and filtering
   • User-generated content system

   Tech Stack: Node.js, Express, PostgreSQL/PostGIS, Leaflet.js, Bootstrap

   🔗 Live Demo: https://gettysburg-static.onrender.com
   💻 Source Code: https://github.com/DavidKimmel/Gettysburg_Static

   #WebDevelopment #GIS #FullStack #JavaScript #NodeJS #PostgreSQL
   ```

---

## 💡 PRO TIPS

**Sound Professional:**
- Use phrases like "As you can see..." or "Let me show you..."
- Avoid "um" and "uh" - pause silently instead
- Smile while talking - it comes through in your voice!

**Look Professional:**
- Don't show desktop clutter - clean background
- Hide bookmarks bar (Ctrl+Shift+B)
- Use incognito/private window for clean browser

**Be Confident:**
- You built this! Own it!
- If you make a small mistake, keep going - most won't notice
- You can always re-record if needed

---

**Good luck with your demo video!** 🎬

This script is designed to showcase both the user-facing features and the technical implementation, making it perfect for portfolio demonstrations and job applications.
