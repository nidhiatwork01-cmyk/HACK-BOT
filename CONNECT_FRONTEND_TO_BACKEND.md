# 🔗 Connect Frontend to Backend - Final Steps

## ✅ Current Status

- ✅ **Backend**: Working on Render (`https://event-navigator-backend.onrender.com`)
- ✅ **Frontend**: Deployed on Vercel
- ⚠️ **Connection**: Need to configure frontend to use backend URL

---

## 🎯 Step 1: Set Environment Variable in Vercel

The frontend needs to know where your backend is!

### Go to Vercel Dashboard:

1. **Open**: https://vercel.com/nidhis-projects-974b1b41/event-navigator/settings/environment-variables

2. **Click "Add New"** button

3. **Fill in the form**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://event-navigator-backend.onrender.com/api`
   - **Environments**: 
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
   - Click **Save**

4. **Verify it was added**:
   - You should see `VITE_API_URL` in the list
   - Value should be: `https://event-navigator-backend.onrender.com/api`

---

## 🚀 Step 2: Redeploy Frontend

After adding the environment variable, you MUST redeploy for it to take effect!

### Option A: Redeploy via CLI (Recommended)

```powershell
cd C:\AllMyProjects\hack-bot\frontend
vercel --prod
```

### Option B: Redeploy via Dashboard

1. Go to: https://vercel.com/nidhis-projects-974b1b41/event-navigator/deployments
2. Find the latest deployment
3. Click the **three dots (⋯)** menu
4. Click **"Redeploy"**
5. Wait 1-2 minutes for deployment

---

## 🧪 Step 3: Test Your Full Application

### 1. Open Your Frontend

Visit your Vercel URL:
```
https://event-navigator-q6fmk3s6y-nidhis-projects-974b1b41.vercel.app
```

### 2. Check Browser Console

- Press **F12** to open Developer Tools
- Go to **Console** tab
- Look for errors

**✅ Good Signs:**
- No errors about "localhost:5000"
- API calls going to `https://event-navigator-backend.onrender.com/api`
- Events loading successfully

**❌ Bad Signs:**
- Errors about "localhost:5000" → Environment variable not set
- CORS errors → Backend CORS configuration issue
- Network errors → Backend might be spinning up (wait 50 seconds)

### 3. Test Key Features

- [ ] **Homepage loads** - Events should display
- [ ] **View events** - Click on an event to see details
- [ ] **Register account** - Create a new user account
- [ ] **Login** - Sign in with your account
- [ ] **Create event** - (If logged in) Create a new event
- [ ] **Search/Filter** - Test event filtering

---

## 🔍 Step 4: Verify Connection

### Check Network Tab

1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Refresh the page
4. Look for requests to:
   - ✅ `event-navigator-backend.onrender.com` (correct!)
   - ❌ `localhost:5000` (wrong - env var not set)

### Test API Directly

Open these URLs in your browser:

1. **Backend Root**: 
   ```
   https://event-navigator-backend.onrender.com/
   ```
   Should show API info ✅

2. **Events Endpoint**:
   ```
   https://event-navigator-backend.onrender.com/api/events
   ```
   Should show events list ✅

---

## ⚠️ Common Issues & Fixes

### Issue: Frontend still shows "localhost" errors

**Cause**: Environment variable not set or not redeployed

**Fix**:
1. Double-check `VITE_API_URL` is set in Vercel dashboard
2. Make sure you redeployed after adding it
3. Wait 2-3 minutes after redeploy
4. Hard refresh browser (Ctrl+Shift+R)

### Issue: CORS errors in console

**Cause**: Backend CORS not allowing Vercel domain

**Fix**: Backend already configured for `*.vercel.app` domains, but if you see CORS errors:
1. Check backend logs on Render
2. Verify CORS configuration in `backend/app.py`

### Issue: "Network error" or "Backend not responding"

**Cause**: Backend instance spun down (free tier)

**Fix**:
1. Wait 50-60 seconds for first request
2. Backend will wake up automatically
3. Subsequent requests will be fast

### Issue: Events not loading

**Cause**: Backend might be down or API endpoint issue

**Fix**:
1. Test backend directly: `https://event-navigator-backend.onrender.com/api/events`
2. Check Render dashboard for service status
3. Check Render logs for errors

---

## ✅ Success Checklist

Your app is fully working when:

- [ ] Frontend loads without errors
- [ ] Events display on homepage
- [ ] Can register new account
- [ ] Can login
- [ ] Can create events (if logged in)
- [ ] No "localhost" errors in console
- [ ] API calls go to Render backend
- [ ] Network tab shows successful API requests

---

## 🎉 You're Done!

Once all the above works, your full-stack application is live and connected!

**Your Live URLs:**
- **Frontend**: `https://event-navigator-q6fmk3s6y-nidhis-projects-974b1b41.vercel.app`
- **Backend**: `https://event-navigator-backend.onrender.com`

---

## 📝 Quick Reference

**Vercel Environment Variables:**
- URL: https://vercel.com/nidhis-projects-974b1b41/event-navigator/settings/environment-variables
- Key: `VITE_API_URL`
- Value: `https://event-navigator-backend.onrender.com/api`

**Redeploy Command:**
```powershell
cd frontend
vercel --prod
```

**Test Backend:**
- Root: `https://event-navigator-backend.onrender.com/`
- Health: `https://event-navigator-backend.onrender.com/health`
- Events: `https://event-navigator-backend.onrender.com/api/events`

