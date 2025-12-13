# How to Update Backend URL

## 🔍 Find Your Render Backend URL

1. Go to https://render.com
2. Log in to your account
3. Click on your backend service (e.g., `events-navigator-backend`)
4. Look at the top of the page - you'll see your service URL
5. It will look like: `https://events-navigator-backend-xxxx.onrender.com`
6. Copy this URL

## 📝 Where to Update the URL

### Option 1: In Vercel Dashboard (For Deployment)

1. Go to your Vercel project
2. Go to **Settings** → **Environment Variables**
3. Find `VITE_API_URL`
4. Update the value to: `https://YOUR-ACTUAL-RENDER-URL.onrender.com/api`
   - Replace `YOUR-ACTUAL-RENDER-URL` with your actual Render service name
   - Example: `https://events-navigator-backend-abc123.onrender.com/api`
5. Save and redeploy

### Option 2: Create .env.production File (For Local Testing)

Create `frontend/.env.production` file with:
```
VITE_API_URL=https://YOUR-ACTUAL-RENDER-URL.onrender.com/api
```

## 🎯 Quick Steps

1. **Get your Render URL:**
   - Render Dashboard → Your Service → Copy the URL

2. **Update in Vercel:**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Edit `VITE_API_URL`
   - Value: `https://YOUR-RENDER-URL.onrender.com/api`

3. **Redeploy:**
   - Click "Redeploy" or push a new commit

## ✅ Your Configuration

Your Render service URL: `https://event-navigator-backend.onrender.com`

Set `VITE_API_URL` to: `https://event-navigator-backend.onrender.com/api`

**Note:** Make sure to include `/api` at the end!

