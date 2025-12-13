#  Deployment Guide

## Quick Deploy Options

### Option 1: Render (Backend) + Vercel (Frontend) - RECOMMENDED 

**Easiest and free for hackathon!**

---

## 📦 Backend Deployment (Render)

### Step 1: Prepare Backend

1. Create `render.yaml` (already created for you)
2. Update `requirements.txt` with all dependencies
3. Make sure `app.py` is the entry point

### Step 2: Deploy to Render

1. Go to https://render.com
2. Sign up/Login
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `event-navigator-backend`
   - **Environment**: `Python 3`
   - **Root Directory**: `backend` (IMPORTANT!)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Environment Variables**:
     ```
     SECRET_KEY=your-random-secret-key-here
     KSAC_SECRET_KEY=hiiamfromksac
     FACULTY_SECRET_KEY=faculty-secret-2024
     SOCIETY_PRESIDENT_SECRET_KEY=society-secret-2024
     ADMIN_SECRET_KEY=admin-secret-2024
     ```
6. Click "Create Web Service"
7. Copy the URL: `https://event-navigator-backend.onrender.com`
   - **IMPORTANT:** Use this URL for frontend configuration!

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Update Frontend Config

1. Create `.env.production` in `frontend/` folder:
   ```
   VITE_API_URL=https://event-navigator-backend.onrender.com/api
   ```

2. Update `vite.config.js` if needed

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. **IMPORTANT - Project Name:**
   - Use only: letters, numbers, underscores
   - **NO hyphens (-), spaces, or special characters**
   - **Cannot start with a number**
   - **Must be unique** - if you see "Project already exists" error, use a different name
   - Good: `events_navigator_kiit`, `eventsnavigator`, `kiit_events_portal`
   - Bad: `events-navigator` ❌, `123events` ❌, `events_navigator` (if already exists) ❌
6. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (or leave empty)
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - **Key**: `VITE_API_URL`
     - **Value**: `https://event-navigator-backend.onrender.com/api`
     - **Environment**: Select all (Production, Preview, Development)
7. **Remove any example environment variables** (like `EXAMPLE_NAME`)
8. Click "Deploy"
9. Your app will be live at `https://your-project-name.vercel.app`

---

## 🔧 Alternative: Railway (All-in-One)

### Deploy Both on Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project
4. Add two services:
   - **Backend Service**: Connect backend folder, set start command `python app.py`
   - **Frontend Service**: Connect frontend folder, set build command `npm run build`

---

## 📝 Important Notes

### Database
- SQLite works for development
- For production, consider PostgreSQL (Render provides free PostgreSQL)
- Update `app.py` to use PostgreSQL connection string

### CORS
- Backend already has CORS enabled
- Make sure frontend URL is in allowed origins

### Environment Variables
- Never commit `.env` files
- Set all secrets in deployment platform

---

## ✅ Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend can connect to backend API
- [ ] Database is initialized
- [ ] Environment variables are set
- [ ] CORS is configured correctly
- [ ] Test login/registration
- [ ] Test event creation
- [ ] Test ML features

---

## 🆘 Troubleshooting

**Backend not starting?**
- Check build logs in Render
- Verify Python version
- Check environment variables

**Frontend can't connect?**
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Check browser console for errors

**Database errors?**
- Run migration script on first deploy
- Check database file permissions

**Vercel Errors:**

**Error: "The provided path 'frontend/frontend' does not exist"**
- **Fix**: Go to Vercel Dashboard → Project Settings → Root Directory
- Set Root Directory to: `frontend` (if deploying from root) or `.` (if deploying from frontend)
- Make sure `frontend/vercel.json` exists

**Error: "Environment Variable references Secret which does not exist"**
- **Fix**: Go to Vercel Dashboard → Settings → Environment Variables
- Add `VITE_API_URL` with value: `https://event-navigator-backend.onrender.com/api`
- Make sure it's enabled for Production, Preview, and Development
- **DO NOT** use `@secret_name` syntax in vercel.json - set it directly in dashboard

**Error: "vercel.json should be inside provided root directory"**
- **Fix**: 
  - If deploying from `frontend/`, make sure `frontend/vercel.json` exists
  - If deploying from root, make sure root `vercel.json` exists and Root Directory is set to `.`

**Quick Vercel CLI Fix:**
```powershell
# 1. Navigate to frontend directory
cd frontend

# 2. Make sure environment variable is set in Vercel dashboard first!
# Go to: https://vercel.com/your-project/settings/environment-variables

# 3. Deploy
vercel --prod
```

---

## 🎯 Quick Deploy Commands

### Render (Backend)
```bash
# Just connect GitHub repo and configure
# Render handles the rest!
```

### Vercel (Frontend)
```bash
cd frontend
npm install -g vercel
vercel
# Follow prompts
```

---

**Need help? Check the deployment platform's documentation!**



