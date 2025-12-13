# 🔧 Fix "Network Error" - Frontend Can't Connect to Backend

## 🐛 Problem

You're seeing: **"Network error. Is the backend running?"**

This means your **Vercel frontend** can't connect to your **Render backend**.

---

## ✅ Quick Fix Steps

### Step 1: Check Backend is Running

Test if your backend is accessible:

1. **Open in browser**: `https://event-navigator-backend.onrender.com/`
   - Should show: `{"message": "Events Navigator Backend API", ...}`
   - If you see "Not Found" or error → Backend needs to be deployed

2. **Test health endpoint**: `https://event-navigator-backend.onrender.com/health`
   - Should show: `{"status": "healthy", ...}`

### Step 2: Set Environment Variable in Vercel (CRITICAL!)

**This is the most common issue!**

1. **Go to Vercel Dashboard**:
   ```
   https://vercel.com/nidhis-projects-974b1b41/event-navigator/settings/environment-variables
   ```

2. **Click "Add New"**

3. **Add this environment variable**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://event-navigator-backend.onrender.com/api`
   - **Environments**: 
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **Save**

4. **Redeploy Frontend**:
   - Go to: https://vercel.com/nidhis-projects-974b1b41/event-navigator/deployments
   - Click **three dots (⋯)** on latest deployment
   - Click **"Redeploy"**
   - Wait 1-2 minutes

### Step 3: Verify Backend is Deployed

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click on `event-navigator-backend`**
3. **Check status**: Should be **"Live"** (green)
4. **If not live**: Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🔍 Debug Steps

### Check 1: What URL is Frontend Using?

1. Open your Vercel site
2. Press **F12** → **Console** tab
3. Type: `import.meta.env.VITE_API_URL`
4. **Expected**: `https://event-navigator-backend.onrender.com/api`
5. **If shows**: `undefined` or `http://localhost:5000/api` → Environment variable not set!

### Check 2: Test Backend Directly

Open these URLs in browser:

1. **Root**: `https://event-navigator-backend.onrender.com/`
   - ✅ Should show JSON
   - ❌ If error → Backend not deployed

2. **Health**: `https://event-navigator-backend.onrender.com/health`
   - ✅ Should show `{"status": "healthy"}`
   - ❌ If error → Backend issue

3. **Events**: `https://event-navigator-backend.onrender.com/api/events`
   - ✅ Should show `[]` or events list
   - ❌ If CORS error → CORS not fixed yet

### Check 3: Browser Network Tab

1. Open your Vercel site
2. Press **F12** → **Network** tab
3. Try to login
4. Look for `/auth/login` request
5. Check:
   - **Request URL**: Should be `https://event-navigator-backend.onrender.com/api/auth/login`
   - **Status**: 
     - ✅ `200` = Working!
     - ❌ `CORS error` = CORS issue
     - ❌ `Failed` = Backend not accessible
     - ❌ `localhost:5000` = Wrong URL (env var not set)

---

## 🛠️ Common Issues & Fixes

### Issue 1: Environment Variable Not Set

**Symptom**: Frontend tries `localhost:5000` or shows `undefined`

**Fix**:
1. Set `VITE_API_URL` in Vercel dashboard
2. Redeploy frontend
3. Wait 2-3 minutes

### Issue 2: Backend Not Deployed

**Symptom**: Backend URL returns error or "Not Found"

**Fix**:
1. Go to Render dashboard
2. Deploy latest commit
3. Wait 2-3 minutes
4. Test backend URL

### Issue 3: CORS Error

**Symptom**: Browser console shows CORS error

**Fix**:
1. Make sure you deployed the CORS fix (commit with "Fix CORS")
2. Backend should allow all origins now
3. Redeploy backend if needed

### Issue 4: Backend Spinning Up (Free Tier)

**Symptom**: First request takes 50+ seconds, then works

**Fix**:
- This is normal for Render free tier
- Wait 50-60 seconds for first request
- Subsequent requests are fast

---

## 📋 Complete Checklist

- [ ] Backend is deployed on Render (status: "Live")
- [ ] Backend root URL works: `https://event-navigator-backend.onrender.com/`
- [ ] Backend health endpoint works: `/health`
- [ ] `VITE_API_URL` is set in Vercel dashboard
- [ ] `VITE_API_URL` value is: `https://event-navigator-backend.onrender.com/api`
- [ ] Frontend is redeployed after setting env var
- [ ] No CORS errors in browser console
- [ ] Network tab shows requests going to Render backend (not localhost)

---

## 🚀 Quick Fix Command

If you want to test locally first:

```powershell
# Check if backend is accessible
Invoke-WebRequest -Uri "https://event-navigator-backend.onrender.com/" | Select-Object -ExpandProperty Content
```

---

## ✅ After Fixing

Once everything is set:

1. **Frontend**: `https://eventsnavigator-ft2rtcisu-nidhis-projects-974b1b41.vercel.app`
2. **Backend**: `https://event-navigator-backend.onrender.com`
3. **Connection**: Frontend → Backend ✅

**Test**:
- Go to frontend
- Try to register/login
- Should work without network errors!

---

**Most likely issue**: `VITE_API_URL` environment variable is not set in Vercel dashboard! 🎯

