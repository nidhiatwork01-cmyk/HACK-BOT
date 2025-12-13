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
   - **Name**: `events-navigator-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Environment Variables**:
     ```
     SECRET_KEY=your-random-secret-key-here
     KSAC_SECRET_KEY=hiiamfromksac
     FACULTY_SECRET_KEY=faculty-secret-2024
     SOCIETY_PRESIDENT_SECRET_KEY=society-secret-2024
     ADMIN_SECRET_KEY=admin-secret-2024
     ```
6. Click "Create Web Service"
7. Copy the URL (e.g., `https://your-app.onrender.com`)

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Update Frontend Config

1. Create `.env.production` in `frontend/` folder:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

2. Update `vite.config.js` if needed

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```
6. Click "Deploy"
7. Your app will be live at `https://your-app.vercel.app`

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



