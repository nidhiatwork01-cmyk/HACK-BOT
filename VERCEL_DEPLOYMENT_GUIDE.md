# 🚀 Complete Vercel Deployment Guide

Deploy your HackBot KIIT application (Backend + Frontend) on Vercel from scratch.

## 📋 Prerequisites

1. **Vercel Account** - Sign up at https://vercel.com (free tier works)
2. **GitHub Account** - Your code should be in a GitHub repository
3. **Git Installed** - Have Git installed on your computer
4. **Node.js & npm** - For frontend dependencies

---

## 🎯 Deployment Strategy

We'll deploy TWO separate Vercel projects:
1. **Backend** - Python Flask API as Vercel Serverless Functions
2. **Frontend** - React/Vite static site

---

## 📦 STEP 1: Push Your Code to GitHub

### 1.1 Initialize Git (if not already done)
```bash
cd C:\Users\hiten\Desktop\HackABot\HACK-BOT
git init
```

### 1.2 Create .gitignore
Create a `.gitignore` file in the root if you don't have one:
```
# Python
__pycache__/
*.py[cod]
*.so
*.egg
*.egg-info/
venv/
env/
.env
*.db

# Node
node_modules/
dist/
.env.local

# IDE
.vscode/
.idea/
```

### 1.3 Commit and Push
```bash
git add .
git commit -m "Initial commit for Vercel deployment"
```

### 1.4 Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository (e.g., `hackbot-kiit`)
3. **Don't** initialize with README (you already have code)

### 1.5 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/hackbot-kiit.git
git branch -M main
git push -u origin main
```

---

## 🔧 STEP 2: Deploy Backend (Flask API)

### 2.1 Install Vercel CLI (Optional but Recommended)
```bash
npm install -g vercel
```

### 2.2 Deploy Backend via Vercel Website

#### Option A: Using Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import Your Repository**
   - Select "Import Git Repository"
   - Choose your GitHub repository
   - Click "Import"

3. **Configure Backend Project**
   - **Project Name**: `hackbot-backend` (or your choice)
   - **Framework Preset**: Other
   - **Root Directory**: Click "Edit" → Select `backend`
   - **Build Command**: Leave empty (not needed for Python)
   - **Output Directory**: Leave empty

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   - `JWT_SECRET` = `your-super-secret-key-change-this-to-random-string`
   - `FLASK_ENV` = `production`
   - `CORS_ORIGINS` = `*` (we'll update this later with frontend URL)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for deployment
   - Copy your backend URL (e.g., `https://hackbot-backend.vercel.app`)

#### Option B: Using Vercel CLI

```bash
cd backend
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? hackbot-backend
# - In which directory is your code? ./
# - Want to override settings? No

# Add environment variables
vercel env add JWT_SECRET
# Enter: your-super-secret-key-change-this

vercel env add FLASK_ENV
# Enter: production

# Deploy to production
vercel --prod
```

### 2.3 Test Your Backend
Visit: `https://your-backend-url.vercel.app/api/events`

You should see JSON response (might be empty array if no events).

---

## 🎨 STEP 3: Deploy Frontend (React App)

### 3.1 Deploy Frontend via Vercel Website

#### Option A: Using Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import Your Repository AGAIN**
   - Select "Import Git Repository"
   - Choose the SAME GitHub repository
   - Click "Import"

3. **Configure Frontend Project**
   - **Project Name**: `hackbot-frontend` (or your choice)
   - **Framework Preset**: Vite
   - **Root Directory**: Click "Edit" → Select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   - `VITE_API_URL` = `https://your-backend-url.vercel.app/api`
   
   ⚠️ **IMPORTANT**: Replace with your actual backend URL from Step 2.3

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for deployment
   - Copy your frontend URL (e.g., `https://hackbot-frontend.vercel.app`)

#### Option B: Using Vercel CLI

```bash
cd frontend
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? hackbot-frontend
# - In which directory is your code? ./
# - Want to override settings? No

# Add environment variable
vercel env add VITE_API_URL
# Enter: https://your-backend-url.vercel.app/api

# Deploy to production
vercel --prod
```

---

## 🔄 STEP 4: Update Backend CORS Settings

Now that you have your frontend URL, update backend CORS:

### 4.1 Update Backend Environment Variable

1. Go to Vercel Dashboard
2. Select your **backend project**
3. Go to Settings → Environment Variables
4. Find `CORS_ORIGINS` (or add it if missing)
5. Update value to: `https://your-frontend-url.vercel.app`
6. Click "Save"

### 4.2 Redeploy Backend

**Via Dashboard:**
- Go to Deployments tab
- Click "..." on latest deployment → "Redeploy"

**Via CLI:**
```bash
cd backend
vercel --prod
```

---

## ✅ STEP 5: Test Your Application

### 5.1 Open Your Frontend
Visit: `https://your-frontend-url.vercel.app`

### 5.2 Test Features
- [ ] Homepage loads
- [ ] Can view events
- [ ] Can register/login
- [ ] Can create events (if logged in)
- [ ] Calendar works
- [ ] ML features work

### 5.3 Check Browser Console
- Press F12 to open Developer Tools
- Check Console tab for errors
- Check Network tab to see API calls

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: 500 Internal Server Error**
- Check Vercel deployment logs: Project → Deployments → Click deployment → Functions tab
- Common fix: Missing environment variables

**Problem: Module not found errors**
- Ensure `requirements.txt` has all dependencies
- Redeploy backend

**Problem: Database errors**
- SQLite has limitations on Vercel (read-only filesystem after deployment)
- Consider using Vercel Postgres or external database for production

### Frontend Issues

**Problem: Can't connect to backend**
- Check VITE_API_URL in Vercel environment variables
- Ensure it ends with `/api`
- Check CORS settings on backend

**Problem: Build fails**
- Check build logs in Vercel
- Run `npm run build` locally to test
- Ensure all dependencies are in package.json

**Problem: Page not found on refresh**
- Already handled by `rewrites` in vercel.json
- If issue persists, check vercel.json is properly configured

### CORS Errors

**Problem: CORS policy blocking requests**
```bash
# Update backend app.py CORS configuration
# Make sure CORS origin includes your frontend URL
```

---

## 🔧 Database Solution for Production

⚠️ **Important**: SQLite doesn't work well on Vercel due to serverless nature.

### Option 1: Vercel Postgres (Recommended)

1. Go to your backend project on Vercel
2. Go to Storage tab
3. Click "Create Database" → Choose Postgres
4. Install the database
5. Copy connection string
6. Update backend code to use PostgreSQL instead of SQLite

### Option 2: External Database (Free Options)

- **Supabase** (PostgreSQL) - https://supabase.com
- **PlanetScale** (MySQL) - https://planetscale.com
- **MongoDB Atlas** - https://www.mongodb.com/atlas

---

## 🔄 Updating Your App

### When you make code changes:

```bash
# Commit changes
git add .
git commit -m "Your update message"
git push

# Vercel will automatically redeploy!
```

### To redeploy manually:

**Via Dashboard:**
- Go to project → Deployments → Click "..." → Redeploy

**Via CLI:**
```bash
vercel --prod
```

---

## 📝 Environment Variables Reference

### Backend (.env)
```env
JWT_SECRET=your-super-secret-key-minimum-32-characters
FLASK_ENV=production
CORS_ORIGINS=https://your-frontend-url.vercel.app
DATABASE_URL=your-database-connection-string
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.vercel.app/api
```

---

## 🎉 Success Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Vercel
- [ ] Backend URL works and returns JSON
- [ ] Frontend deployed on Vercel
- [ ] Frontend loads without errors
- [ ] Frontend can communicate with backend
- [ ] CORS configured properly
- [ ] Environment variables set correctly
- [ ] Custom domains configured (optional)
- [ ] Database solution implemented (if needed)

---

## 📚 Useful Commands

```bash
# Check Vercel projects
vercel ls

# View deployment logs
vercel logs

# Open project in dashboard
vercel dashboard

# Remove a deployment
vercel remove [deployment-url]

# Link to existing project
vercel link
```

---

## 🔗 Important URLs

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Vercel Python Runtime**: https://vercel.com/docs/functions/serverless-functions/runtimes/python

---

## 💡 Pro Tips

1. **Custom Domains**: Add custom domain in Vercel Dashboard → Settings → Domains
2. **Preview Deployments**: Every Git branch gets automatic preview URL
3. **Environment Variables**: Set different values for Production/Preview/Development
4. **Analytics**: Enable Vercel Analytics in project settings
5. **Logs**: Use `vercel logs` to debug production issues

---

## 🆘 Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console (F12)
3. Verify environment variables
4. Check CORS configuration
5. Ensure database is accessible

---

**🎊 Congratulations!** Your HackBot KIIT app is now live on Vercel!

Share your URLs:
- 🎨 Frontend: `https://your-frontend-url.vercel.app`
- 🔌 Backend: `https://your-backend-url.vercel.app`
