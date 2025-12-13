# Fix: "Project already exists" Error on Vercel

## 🔴 Error Message
```
Project "events_navigator" already exists, please use a new name.
```

## ✅ Solution Options

### Option 1: Use a Different Project Name (Easiest)

1. In the Vercel deployment page, find the **Project Name** field
2. Change it to something unique, for example:
   - `events_navigator_kiit`
   - `events_navigator_v2`
   - `events_navigator_2024`
   - `campus_events_navigator`
   - `kiit_events_portal`
3. Make sure it follows the rules:
   - Only letters, numbers, underscores
   - No hyphens, spaces, or special characters
   - Cannot start with a number
4. Click **Deploy**

### Option 2: Delete the Old Project and Reuse the Name

1. Go to https://vercel.com/dashboard
2. Find the project named `events_navigator`
3. Click on it → **Settings** → Scroll down
4. Click **Delete Project** (at the bottom)
5. Confirm deletion
6. Go back to create a new project
7. Use the name `events_navigator` again

### Option 3: Connect to Existing Project

If you want to update the existing project:

1. Go to https://vercel.com/dashboard
2. Find and click on `events_navigator`
3. Go to **Settings** → **Git**
4. Make sure it's connected to the correct GitHub repository
5. Click **Redeploy** or push a new commit to trigger auto-deploy

## 🎯 Recommended: Use Option 1

**Just change the project name to something unique:**
- `events_navigator_kiit` ← Recommended
- `kiit_events_portal`
- `campus_events_app`

Then click **Deploy** - it should work immediately!

## 📝 Current Configuration (Keep These)

Your current settings look correct:
- ✅ Build Command: `cd frontend && npm install && npm run build`
- ✅ Output Directory: `frontend/dist`
- ✅ Install Command: `cd frontend && npm install`
- ✅ Environment Variable: `VITE_API_URL` = `https://event-navigator-backend.onrender.com/api`

**Just change the project name and you're good to go!**

