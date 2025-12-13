# 🔧 Render Backend Fix Guide

## 🐛 Issues Identified

1. **"URL not found" error** - Backend returns 404 on root URL
2. **Free tier spin-down** - Render free instances spin down after 15 minutes of inactivity
3. **Missing root route** - No endpoint at `/` to verify the backend is running

## ✅ Fixes Applied

1. **Added root route (`/`)** - Now returns API information
2. **Added health check endpoint (`/health`)** - For Render monitoring
3. **Updated render.yaml** - Added health check path configuration

---

## 🚀 Step-by-Step Fix

### Step 1: Commit and Push Changes

```powershell
cd C:\AllMyProjects\hack-bot
git add .
git commit -m "Add root route and health check endpoint for Render"
git push origin main
```

### Step 2: Trigger Manual Deploy on Render

1. Go to: https://dashboard.render.com
2. Click on your **event-navigator-backend** service
3. Click **"Manual Deploy"** button
4. Select **"Deploy latest commit"**
5. Wait for deployment to complete (2-3 minutes)

### Step 3: Test the Backend

After deployment completes, test these URLs:

1. **Root URL** (should work now):
   ```
   https://event-navigator-backend.onrender.com/
   ```
   Should return: `{"message": "Events Navigator Backend API", "status": "running", ...}`

2. **Health Check**:
   ```
   https://event-navigator-backend.onrender.com/health
   ```
   Should return: `{"status": "healthy", "database": "connected", ...}`

3. **API Endpoint**:
   ```
   https://event-navigator-backend.onrender.com/api/events
   ```
   Should return: List of events (or empty array `[]`)

---

## ⚠️ Free Tier Spin-Down Issue

**Important**: Render's free tier spins down after 15 minutes of inactivity.

### What This Means:
- First request after spin-down takes **50+ seconds** to respond
- Subsequent requests are fast
- This is normal for free tier

### Solutions:

#### Option 1: Wait for First Request (Free)
- First request will wake up the instance
- Wait 50-60 seconds
- Then it will work normally

#### Option 2: Use a Keep-Alive Service (Free)
- Use a service like **UptimeRobot** or **cron-job.org**
- Set it to ping `/health` every 10 minutes
- Keeps the instance awake

#### Option 3: Upgrade to Paid Tier ($7/month)
- Instance stays awake 24/7
- No spin-down delays
- Better for production

---

## 🔍 Troubleshooting

### Issue: Still getting "URL not found"

**Check 1: Is the service running?**
1. Go to Render dashboard
2. Check service status (should be "Live")
3. If it says "Stopped" or "Error", check logs

**Check 2: Check Deployment Logs**
1. In Render dashboard, click on your service
2. Go to **"Logs"** tab
3. Look for errors like:
   - `ModuleNotFoundError` - Missing dependencies
   - `Port already in use` - Port configuration issue
   - `Database error` - Database connection issue

**Check 3: Verify Start Command**
- Should be: `gunicorn app:app --bind 0.0.0.0:$PORT`
- Check in Render dashboard → Settings → Start Command

**Check 4: Test Health Endpoint**
- Visit: `https://event-navigator-backend.onrender.com/health`
- If this works but root doesn't, there's a routing issue

### Issue: Backend crashes on startup

**Check Logs:**
1. Go to Render dashboard → Logs
2. Look for Python errors
3. Common issues:
   - Missing dependencies in `requirements.txt`
   - Database initialization errors
   - Import errors

**Fix:**
1. Check `backend/requirements.txt` has all dependencies
2. Make sure `gunicorn` is installed: `gunicorn==21.2.0`
3. Verify database initialization doesn't fail

### Issue: "502 Bad Gateway" or "Service Unavailable"

**Causes:**
1. Service is spinning up (wait 50 seconds)
2. Service crashed (check logs)
3. Port mismatch (check PORT environment variable)

**Fix:**
1. Wait 1 minute and try again
2. Check Render logs for errors
3. Verify `PORT` env var is set to `10000` in render.yaml

---

## 📋 Verification Checklist

After deploying, verify:

- [ ] Root URL (`/`) returns API info
- [ ] Health endpoint (`/health`) returns `{"status": "healthy"}`
- [ ] Events endpoint (`/api/events`) returns data
- [ ] No errors in Render logs
- [ ] Service status is "Live" in Render dashboard
- [ ] Frontend can connect to backend (check browser console)

---

## 🧪 Test Commands

You can test the backend using PowerShell:

```powershell
# Test root endpoint
Invoke-WebRequest -Uri "https://event-navigator-backend.onrender.com/" | Select-Object -ExpandProperty Content

# Test health endpoint
Invoke-WebRequest -Uri "https://event-navigator-backend.onrender.com/health" | Select-Object -ExpandProperty Content

# Test events endpoint
Invoke-WebRequest -Uri "https://event-navigator-backend.onrender.com/api/events" | Select-Object -ExpandProperty Content
```

Or use a browser:
- Visit: `https://event-navigator-backend.onrender.com/`
- Visit: `https://event-navigator-backend.onrender.com/health`
- Visit: `https://event-navigator-backend.onrender.com/api/events`

---

## 🎯 Quick Fix Summary

1. **Commit changes**: `git add . && git commit -m "Fix backend routes" && git push`
2. **Manual deploy** on Render dashboard
3. **Wait 2-3 minutes** for deployment
4. **Test root URL**: `https://event-navigator-backend.onrender.com/`
5. **If first request is slow**: Wait 50 seconds (free tier spin-up)

---

## 📞 Still Having Issues?

1. **Check Render Logs**: Dashboard → Service → Logs tab
2. **Check Service Status**: Should be "Live"
3. **Verify Environment Variables**: All required vars are set
4. **Test Locally**: Run `python backend/app.py` to check for errors

---

**After fixing, your backend should be accessible at:**
- Root: `https://event-navigator-backend.onrender.com/`
- Health: `https://event-navigator-backend.onrender.com/health`
- API: `https://event-navigator-backend.onrender.com/api/events`

