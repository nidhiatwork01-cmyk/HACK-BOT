# ✅ Set VITE_API_URL in Vercel - Step by Step

## 🎯 The Problem

Your frontend is trying to use `import.meta.env.VITE_API_URL`, but it's `undefined`, so it defaults to `localhost:5000` (which doesn't work on deployed frontend).

---

## ✅ Solution: Set Environment Variable

### Step 1: Go to Vercel Environment Variables

**Direct Link**:
```
https://vercel.com/nidhis-projects-974b1b41/event-navigator/settings/environment-variables
```

Or navigate:
1. Go to: https://vercel.com
2. Click on **"event-navigator"** project
3. Go to **Settings** tab
4. Click **Environment Variables** in left sidebar

### Step 2: Add the Variable

1. **Click "Add New"** button (top right)

2. **Fill in the form**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://event-navigator-backend.onrender.com/api`
   - **Environments**: 
     - ✅ **Production** (check this!)
     - ✅ **Preview** (check this!)
     - ✅ **Development** (check this!)
   
3. **Click "Save"**

### Step 3: Verify It Was Added

You should see in the list:
```
VITE_API_URL = https://event-navigator-backend.onrender.com/api
```

---

## 🚀 Step 4: Redeploy (CRITICAL!)

**Environment variables are baked into the build**, so you MUST redeploy:

### Option A: Redeploy via Dashboard

1. Go to: https://vercel.com/nidhis-projects-974b1b41/event-navigator/deployments
2. Find the **latest deployment**
3. Click the **three dots (⋯)** menu
4. Click **"Redeploy"**
5. **Leave "Use existing Build Cache" UNCHECKED** (important!)
6. Click **"Redeploy"** button
7. Wait 1-2 minutes

### Option B: Redeploy via CLI

```powershell
cd frontend
vercel --prod
```

---

## ✅ Step 5: Verify It's Working

### Method 1: Check in Browser (After Redeploy)

1. **Open your deployed site**
2. **Press F12** → **Console** tab
3. **Don't type `import.meta.env.VITE_API_URL`** (that won't work in console)
4. Instead, **try to login** - should work now!

### Method 2: Check Network Tab

1. **Open your deployed site**
2. **Press F12** → **Network** tab
3. **Try to login**
4. **Look for `/auth/login` request**
5. **Check Request URL**:
   - ✅ Should be: `https://event-navigator-backend.onrender.com/api/auth/login`
   - ❌ If shows: `http://localhost:5000/api/auth/login` → Env var not set!

### Method 3: Check Build Logs

1. Go to deployment page
2. Click on **"Build Logs"**
3. Look for environment variables being used
4. Should see `VITE_API_URL` in the build

---

## 🔍 Why the Console Error Happened

When you type `import.meta.env.VITE_API_URL` in the browser console, you get:
```
SyntaxError: Cannot use 'import.meta' outside a module
```

**This is normal!** The console isn't a module context, so `import.meta` doesn't work there.

**The real check**: See if your app actually connects to the backend (Network tab).

---

## 📋 Complete Checklist

- [ ] `VITE_API_URL` is set in Vercel dashboard
- [ ] Value is: `https://event-navigator-backend.onrender.com/api`
- [ ] All environments are selected (Production, Preview, Development)
- [ ] Frontend is redeployed (after setting env var)
- [ ] "Use existing Build Cache" was UNCHECKED during redeploy
- [ ] Network tab shows requests going to Render backend (not localhost)
- [ ] Login/registration works without "Network error"

---

## ⚠️ Important Notes

1. **Environment variables are build-time**, not runtime
   - Must redeploy after adding/changing them
   - Can't change them without rebuilding

2. **Build Cache**
   - Uncheck "Use existing Build Cache" when redeploying with new env vars
   - Ensures the new variable is included

3. **Vite Prefix**
   - Only variables starting with `VITE_` are exposed to frontend
   - `VITE_API_URL` is correct ✅
   - `API_URL` (without VITE_) won't work ❌

---

## 🆘 Still Not Working?

### Check 1: Is Variable Actually Set?

1. Go to environment variables page
2. Make sure `VITE_API_URL` is in the list
3. Make sure value is correct (no typos)

### Check 2: Did You Redeploy?

- Environment variables only work after redeploy
- Check deployment time - should be after you added the variable

### Check 3: Check Build Logs

1. Go to deployment → Build Logs
2. Look for errors
3. Check if environment variables are being read

### Check 4: Hard Refresh Browser

- Press **Ctrl+Shift+R** (or **Cmd+Shift+R** on Mac)
- Clears cache and reloads

---

## ✅ Success Indicators

You'll know it's working when:

- ✅ No "Network error" messages
- ✅ Login/registration works
- ✅ Network tab shows requests to `event-navigator-backend.onrender.com`
- ✅ No CORS errors
- ✅ Events load successfully

---

**After setting the variable and redeploying, your app should work!** 🎉

