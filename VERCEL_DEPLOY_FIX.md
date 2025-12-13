# Vercel Deployment Fix Guide

## 🔴 Error: "The name contains invalid characters"

This error usually means:
1. **Project name** has invalid characters (hyphens, spaces, etc.)
2. **Environment variable name** is invalid

## ✅ Solution Steps

### Step 1: Fix Project Name in Vercel

1. Go to your Vercel project settings
2. Click on **Settings** → **General**
3. Find **Project Name** field
4. Change it to use only:
   - Letters (a-z, A-Z)
   - Numbers (0-9)
   - Underscores (_)
   - **NO hyphens (-), spaces, or special characters**
   - **Cannot start with a number**

**Good names:**
- `events_navigator`
- `eventsnavigator`
- `EventsNavigator`
- `events_navigator_kiit`

**Bad names:**
- `events-navigator` ❌ (hyphen)
- `events navigator` ❌ (space)
- `123events` ❌ (starts with number)
- `events@navigator` ❌ (special character)

### Step 2: Set Up Environment Variables Correctly

In Vercel Dashboard → **Settings** → **Environment Variables**:

1. **Remove** the `EXAMPLE_NAME` variable (it's just an example)
2. **Add/Update** these variables:

   **Key:** `VITE_API_URL`  
   **Value:** `https://event-navigator-backend.onrender.com/api`  
   **Environment:** Production, Preview, Development (select all)

### Step 3: Configure Build Settings

In Vercel Dashboard → **Settings** → **General**:

- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build` (or leave empty, Vite auto-detects)
- **Output Directory:** `dist`
- **Install Command:** `npm install` (or leave empty)

### Step 4: Update vercel.json (Optional)

The `vercel.json` is already configured correctly. Just make sure it's in the **root** of your repository.

## 📝 Quick Checklist

- [ ] Project name uses only letters, numbers, underscores (no hyphens)
- [ ] Project name doesn't start with a number
- [ ] Environment variable `VITE_API_URL` is set correctly
- [ ] Removed `EXAMPLE_NAME` environment variable
- [ ] Root Directory is set to `frontend`
- [ ] Build Command is `npm run build` or empty
- [ ] Output Directory is `dist`

## 🚀 After Fixing

1. Click **Deploy** button
2. Wait for build to complete
3. Your app will be live at `https://your-project-name.vercel.app`

## 🔍 If Still Getting Errors

1. **Check the exact error message** - it will tell you which name is invalid
2. **Verify environment variable names:**
   - Must start with a letter or underscore
   - Can contain letters, numbers, underscores
   - Cannot contain hyphens, spaces, or special characters
3. **Check project name** follows the rules above

## 📌 Example Configuration

**Project Name:** `events_navigator_kiit`

**Environment Variables:**
```
VITE_API_URL = https://events-navigator-backend.onrender.com/api
```

**Build Settings:**
- Root Directory: `frontend`
- Build Command: (empty - auto-detected)
- Output Directory: `dist`

