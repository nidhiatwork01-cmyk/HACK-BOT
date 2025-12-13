# 🚀 Complete Deployment Guide - Step by Step

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step 1: Prepare Your Code](#step-1-prepare-your-code)
3. [Step 2: Push to GitHub](#step-2-push-to-github)
4. [Step 3: Deploy Backend to Render](#step-3-deploy-backend-to-render)
5. [Step 4: Deploy Frontend to Vercel](#step-4-deploy-frontend-to-vercel)
6. [Step 5: Configure Environment Variables](#step-5-configure-environment-variables)
7. [Step 6: Test Your Deployment](#step-6-test-your-deployment)
8. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before starting, make sure you have:
- ✅ GitHub account (free) - https://github.com
- ✅ Render account (free) - https://render.com
- ✅ Vercel account (free) - https://vercel.com
- ✅ Git installed on your computer
- ✅ Your project working locally

---

## 📦 Step 1: Prepare Your Code

### 1.1 Check Your Files

Make sure these files exist:

**Backend:**
- ✅ `backend/app.py` (main backend file)
- ✅ `backend/requirements.txt` (Python dependencies)
- ✅ `render.yaml` (Render configuration - already exists)

**Frontend:**
- ✅ `frontend/package.json` (Node dependencies)
- ✅ `frontend/vercel.json` (Vercel configuration - already exists)
- ✅ `frontend/vite.config.js` (Vite configuration)

### 1.2 Update Backend for Production

**Check `backend/app.py` line 22-34** - CORS should allow your frontend domain:

```python
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "http://localhost:5173",
            "https://*.vercel.app",  # ✅ This allows all Vercel deployments
            "https://*.netlify.app",
            os.environ.get('FRONTEND_URL', '*')
        ],
        ...
    }
})
```

✅ **This is already configured correctly!**

### 1.3 Create .gitignore (if not exists)

Create `.gitignore` in project root:

```gitignore
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
*.db
*.sqlite
*.sqlite3

# Node
node_modules/
dist/
build/
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
```

---

## 📤 Step 2: Push to GitHub

### 2.1 Initialize Git Repository

**Open PowerShell/Terminal in your project folder:**

```powershell
cd C:\Users\hiten\Desktop\Hackathon\HACK-BOT

# Initialize git (if not already done)
git init

# Check status
git status
```

### 2.2 Add All Files

```powershell
# Add all files
git add .

# Check what will be committed
git status
```

### 2.3 Create First Commit

```powershell
git commit -m "Initial commit: Events Navigator with Map Features"
```

### 2.4 Create GitHub Repository

1. **Go to:** https://github.com/new
2. **Repository name:** `events-navigator-kiit` (or any name you like)
3. **Description:** "KIIT University Events Management Platform with Map Directions"
4. **Visibility:** Public (or Private - your choice)
5. **DO NOT** check "Initialize with README" (we already have files)
6. **Click "Create repository"**

### 2.5 Push to GitHub

**Copy the commands GitHub shows you, or use these:**

```powershell
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/events-navigator-kiit.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**You'll be asked for GitHub username and password/token**

✅ **Your code is now on GitHub!**

---

## 🔧 Step 3: Deploy Backend to Render

### 3.1 Sign Up for Render

1. **Go to:** https://render.com
2. **Click "Get Started for Free"**
3. **Sign up with GitHub** (recommended - easier to connect repos)

### 3.2 Create New Web Service

1. **Click "New +"** (top right)
2. **Select "Web Service"**

### 3.3 Connect GitHub Repository

1. **Click "Connect account"** (if not connected)
2. **Authorize Render** to access your GitHub
3. **Select your repository:** `events-navigator-kiit` (or your repo name)
4. **Click "Connect"**

### 3.4 Configure Backend Service

**Fill in these settings:**

| Setting | Value |
|---------|-------|
| **Name** | `events-navigator-backend` |
| **Region** | Choose closest to you (e.g., Singapore, Mumbai) |
| **Branch** | `main` |
| **Root Directory** | `backend` ⚠️ **IMPORTANT!** |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn app:app --bind 0.0.0.0:$PORT` |

### 3.5 Add Environment Variables

**Scroll down to "Environment Variables" section:**

Click "Add Environment Variable" for each:

| Key | Value |
|-----|-------|
| `SECRET_KEY` | `your-super-secret-key-change-this-2024` (generate a random string) |
| `KSAC_SECRET_KEY` | `hiiamfromksac` |
| `FACULTY_SECRET_KEY` | `faculty-secret-2024` |
| `SOCIETY_PRESIDENT_SECRET_KEY` | `society-secret-2024` |
| `ADMIN_SECRET_KEY` | `admin-secret-2024` |
| `PYTHON_VERSION` | `3.11.0` |

**To generate SECRET_KEY:**
```powershell
# In PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### 3.6 Deploy Backend

1. **Scroll down**
2. **Click "Create Web Service"**
3. **Wait for deployment** (5-10 minutes)
4. **Watch the logs** - you should see:
   ```
   ✅ Build successful
   ✅ Starting service
   ```

### 3.7 Get Backend URL

1. **Once deployed**, you'll see a URL like:
   ```
   https://events-navigator-backend.onrender.com
   ```
2. **Copy this URL** - you'll need it for frontend!
3. **Test it:** Open `https://your-backend-url.onrender.com/health`
   - Should show: `{"status":"healthy",...}`

✅ **Backend is deployed!**

---

## 🎨 Step 4: Deploy Frontend to Vercel

### 4.1 Sign Up for Vercel

1. **Go to:** https://vercel.com
2. **Click "Sign Up"**
3. **Sign up with GitHub** (recommended)

### 4.2 Create New Project

1. **Click "Add New..." → "Project"**
2. **Import your GitHub repository:**
   - Find `events-navigator-kiit` (or your repo name)
   - Click "Import"

### 4.3 Configure Frontend Project

**Fill in these settings:**

| Setting | Value |
|---------|-------|
| **Project Name** | `events-navigator-kiit` (or any name - **NO hyphens!**) |
| **Framework Preset** | `Vite` (should auto-detect) |
| **Root Directory** | `frontend` ⚠️ **IMPORTANT!** |
| **Build Command** | `npm run build` (or leave empty - auto-detected) |
| **Output Directory** | `dist` (or leave empty - auto-detected) |
| **Install Command** | `npm install` (or leave empty) |

### 4.4 Add Environment Variables

**Before deploying, add environment variable:**

1. **Scroll to "Environment Variables"**
2. **Click "Add"**
3. **Add this variable:**

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://events-navigator-backend.onrender.com/api` |

⚠️ **Replace with YOUR actual backend URL from Step 3.7!**

4. **Make sure it's enabled for:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### 4.5 Deploy Frontend

1. **Click "Deploy"**
2. **Wait for deployment** (2-5 minutes)
3. **Watch the build logs**

### 4.6 Get Frontend URL

1. **Once deployed**, you'll see:
   ```
   https://events-navigator-kiit.vercel.app
   ```
2. **Click the URL** to open your app!

✅ **Frontend is deployed!**

---

## ⚙️ Step 5: Configure Environment Variables

### 5.1 Update Backend CORS (if needed)

If your frontend URL is different, update backend CORS:

1. **Go to Render Dashboard**
2. **Click your backend service**
3. **Go to "Environment" tab**
4. **Add new variable:**

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://events-navigator-kiit.vercel.app` |

5. **Redeploy** (Render will auto-redeploy)

### 5.2 Verify Frontend Environment Variable

1. **Go to Vercel Dashboard**
2. **Click your project**
3. **Go to "Settings" → "Environment Variables"**
4. **Verify `VITE_API_URL` is set correctly**

---

## 🧪 Step 6: Test Your Deployment

### 6.1 Test Backend

1. **Open:** `https://your-backend-url.onrender.com/health`
   - Should show: `{"status":"healthy",...}`

2. **Open:** `https://your-backend-url.onrender.com/api/events`
   - Should show JSON with events (or empty array)

### 6.2 Test Frontend

1. **Open:** `https://your-frontend-url.vercel.app`
2. **Check browser console** (F12) for errors
3. **Try these:**
   - ✅ View events page
   - ✅ Click on an event
   - ✅ Test "Get Directions" button
   - ✅ Try registering/login

### 6.3 Test Map Feature

1. **Go to Events page**
2. **Click any event** (e.g., "TechFest 2024")
3. **Click "Get Directions"**
4. **Google Maps should open** with directions to KIIT location

✅ **Everything should work!**

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: Build fails**
- ✅ Check `requirements.txt` has all dependencies
- ✅ Verify Python version (3.11.0)
- ✅ Check build logs in Render

**Problem: Service crashes**
- ✅ Check logs in Render dashboard
- ✅ Verify `gunicorn` is in `requirements.txt`
- ✅ Check environment variables are set

**Problem: CORS errors**
- ✅ Add frontend URL to CORS origins in `app.py`
- ✅ Add `FRONTEND_URL` environment variable in Render

### Frontend Issues

**Problem: Can't connect to backend**
- ✅ Verify `VITE_API_URL` is set correctly in Vercel
- ✅ Check backend URL is accessible
- ✅ Check browser console for errors

**Problem: Build fails**
- ✅ Check `package.json` has all dependencies
- ✅ Verify Node.js version (should auto-detect)
- ✅ Check build logs in Vercel

**Problem: 404 errors on routes**
- ✅ Verify `vercel.json` has rewrites configured
- ✅ Check `outputDirectory` is `dist`

### Map Feature Issues

**Problem: Map buttons don't work**
- ✅ Check browser console (F12) for errors
- ✅ Verify `maps.js` file exists in `frontend/src/utils/`
- ✅ Check internet connection (needed for Google Maps)

**Problem: Google Maps doesn't open**
- ✅ Check pop-up blocker settings
- ✅ Try different browser
- ✅ Verify venue names are correct

---

## 📝 Post-Deployment Checklist

- [ ] Backend is accessible at Render URL
- [ ] Frontend is accessible at Vercel URL
- [ ] Backend health check works (`/health`)
- [ ] Frontend can load events from backend
- [ ] Map directions feature works
- [ ] Can register/login
- [ ] Can create events
- [ ] Environment variables are set correctly
- [ ] CORS is configured properly

---

## 🔄 Updating Your Deployment

### Update Backend

```powershell
# Make changes to your code
git add .
git commit -m "Update backend"
git push origin main

# Render will auto-deploy!
```

### Update Frontend

```powershell
# Make changes to your code
git add .
git commit -m "Update frontend"
git push origin main

# Vercel will auto-deploy!
```

---

## 🎉 Success!

Your application is now live at:
- **Frontend:** `https://your-project.vercel.app`
- **Backend:** `https://your-backend.onrender.com`

**Share your app with the world! 🌍**

---

## 📞 Need Help?

1. **Check deployment platform docs:**
   - Render: https://render.com/docs
   - Vercel: https://vercel.com/docs

2. **Check build logs** in dashboard

3. **Check browser console** (F12) for frontend errors

4. **Check backend logs** in Render dashboard

---

**Good luck with your deployment! 🚀**

