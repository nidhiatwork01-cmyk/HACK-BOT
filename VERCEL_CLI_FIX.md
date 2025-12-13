# Fix Vercel CLI Deployment Error

## 🔴 Error
```
Error: The provided path "C:\AllMyProjects\hack-bot\frontend\frontend" does not exist.
```

## ✅ Solution Options

### Option 1: Run Vercel from Root Directory (Recommended)

1. **Go back to project root:**
   ```bash
   cd C:\AllMyProjects\hack-bot
   ```

2. **Run Vercel from root:**
   ```bash
   vercel --prod
   ```

3. **When asked for root directory, specify:**
   - Root Directory: `frontend`

### Option 2: Update Vercel Project Settings

1. **Go to Vercel Dashboard:**
   - https://vercel.com/nidhis-projects-974b1b41/event-navigator/settings

2. **Update Root Directory:**
   - Go to **Settings** → **General**
   - Find **Root Directory** field
   - **Clear it** (leave empty) or set to `.` (current directory)
   - Save

3. **Then run from frontend folder:**
   ```bash
   cd frontend
   vercel --prod
   ```

### Option 3: Use Vercel Dashboard (Easiest)

Since you've already linked the project, just use the web dashboard:

1. Go to https://vercel.com/dashboard
2. Click on your project: `event-navigator`
3. Go to **Deployments** tab
4. Click **Redeploy** on the latest deployment
5. Or push a new commit to trigger auto-deploy

## 🎯 Recommended: Use Option 3 (Dashboard)

**Easiest way - just use the web interface:**

1. Go to: https://vercel.com/nidhis-projects-974b1b41/event-navigator
2. Make sure **Environment Variables** are set:
   - `VITE_API_URL` = `https://event-navigator-backend.onrender.com/api`
3. Click **Deployments** → **Redeploy** (or wait for auto-deploy from Git)

## 📝 Current Status

✅ You're logged into Vercel CLI  
✅ Project is linked: `event-navigator`  
✅ Environment variables downloaded to `.env.local`  
❌ Root directory configuration issue

## 🔧 Quick Fix Commands

**From project root:**
```bash
cd C:\AllMyProjects\hack-bot
vercel --prod --cwd frontend
```

**Or update settings and run from frontend:**
```bash
cd frontend
# First, update Root Directory in Vercel dashboard to "." or empty
vercel --prod
```

## 💡 Best Practice

For future deployments, just **push to GitHub** and Vercel will auto-deploy:
```bash
git add .
git commit -m "Update frontend"
git push origin main
```

Vercel will automatically detect the push and deploy!

