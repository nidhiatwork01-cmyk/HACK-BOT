# Environment Variable Guide: VITE_API_URL

## What is VITE_API_URL?

`VITE_API_URL` is an **environment variable** (configuration setting) that tells your frontend where to find the backend API.

- **Key (Name):** `VITE_API_URL` ← This is the variable name
- **Value:** `https://event-navigator-backend.onrender.com/api` ← This is your backend URL

**You don't need to "generate" a key** - `VITE_API_URL` is just the name of the variable. You just need to set its value to your backend URL.

## How It Works

### In Your Code
Your frontend code uses it like this:
```javascript
// frontend/src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
```

- If `VITE_API_URL` is set → uses that URL
- If not set → defaults to `http://localhost:5000/api` (for local development)

### Why "VITE_" Prefix?
Vite (your build tool) only exposes environment variables that start with `VITE_` to the frontend code. This is a security feature.

## Where to Set It

### Option 1: In Vercel Dashboard (For Production)

1. Go to https://vercel.com
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New** or edit existing
5. Enter:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://event-navigator-backend.onrender.com/api`
   - **Environment:** Select all (Production, Preview, Development)
6. Click **Save**
7. **Redeploy** your project for changes to take effect

### Option 2: In .env.production File (For Local Testing)

The file `frontend/.env.production` has been created with:
```
VITE_API_URL=https://event-navigator-backend.onrender.com/api
```

This file is used when you run `npm run build` locally.

### Option 3: In .env.local File (For Local Development)

Create `frontend/.env.local` (this file is git-ignored):
```
VITE_API_URL=http://localhost:5000/api
```

This is for local development when your backend runs on localhost.

## Step-by-Step: Setting in Vercel

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Click on your project

2. **Navigate to Environment Variables:**
   - Click **Settings** (top menu)
   - Click **Environment Variables** (left sidebar)

3. **Add/Edit Variable:**
   - If `VITE_API_URL` exists → Click the edit icon (pencil)
   - If it doesn't exist → Click **Add New**
   
4. **Enter the Values:**
   ```
   Key:   VITE_API_URL
   Value: https://event-navigator-backend.onrender.com/api
   ```
   
5. **Select Environments:**
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
   (Check all three)

6. **Save:**
   - Click **Save** button

7. **Redeploy:**
   - Go to **Deployments** tab
   - Click the three dots (⋯) on latest deployment
   - Click **Redeploy**

## Verification

After setting it, verify it works:

1. **Check in Vercel:**
   - Settings → Environment Variables
   - Should see `VITE_API_URL` listed

2. **Test Your Deployed App:**
   - Open your Vercel URL (e.g., `https://your-app.vercel.app`)
   - Open browser console (F12)
   - Try to load events
   - Should connect to: `https://event-navigator-backend.onrender.com/api`

3. **Check Network Tab:**
   - Open DevTools → Network tab
   - Look for API requests
   - Should go to `https://event-navigator-backend.onrender.com/api/events`

## Common Questions

### Q: Do I need to generate a secret key?
**A:** No! `VITE_API_URL` is just a configuration variable name. You're setting its value to your backend URL.

### Q: What if I change my backend URL?
**A:** Just update the value in Vercel Environment Variables and redeploy.

### Q: Why is it called "VITE_API_URL"?
**A:** 
- `VITE_` prefix is required by Vite to expose it to frontend code
- `API_URL` describes what it is (the API endpoint URL)

### Q: Can I use a different name?
**A:** Yes, but you'd need to update `frontend/src/services/api.js` to use your new name. It's easier to stick with `VITE_API_URL`.

## Summary

- **Key Name:** `VITE_API_URL` (just a variable name, not a secret)
- **Value:** `https://event-navigator-backend.onrender.com/api` (your backend URL)
- **Where to Set:** Vercel Dashboard → Settings → Environment Variables
- **No generation needed** - just set the value!

