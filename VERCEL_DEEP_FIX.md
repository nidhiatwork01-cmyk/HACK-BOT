# Vercel Deployment Deep Fix Guide

## Issues Identified

1. **Root Directory Mismatch**: Vercel is looking for `frontend/frontend` because the root directory setting is incorrect
2. **Environment Variable Secret Missing**: `vercel.json` references a secret `@vite_api_url` that doesn't exist
3. **vercel.json Location**: The configuration file needs to be in the correct location

## Solutions Applied

### ✅ Fixed Files

1. **Created `frontend/vercel.json`**: This is the correct location for Vercel configuration when deploying from the frontend directory
2. **Removed problematic env reference**: Removed the secret reference from root `vercel.json`

## Step-by-Step Fix Instructions

### Option 1: Deploy from Frontend Directory (RECOMMENDED)

1. **Navigate to frontend directory:**
   ```powershell
   cd frontend
   ```

2. **Set Environment Variable in Vercel Dashboard:**
   - Go to: https://vercel.com/nidhis-projects-974b1b41/event-navigator/settings/environment-variables
   - Add a new environment variable:
     - **Name**: `VITE_API_URL`
     - **Value**: `https://event-navigator-backend.onrender.com/api`
     - **Environment**: Select all (Production, Preview, Development)
   - Click **Save**

3. **Update Root Directory in Vercel Settings:**
   - Go to: https://vercel.com/nidhis-projects-974b1b41/event-navigator/settings
   - Scroll to **Root Directory**
   - Set it to: `frontend` (or leave it empty if deploying from frontend directory)
   - Click **Save**

4. **Deploy:**
   ```powershell
   vercel --prod
   ```

### Option 2: Deploy from Root Directory

1. **Update Root Directory in Vercel Settings:**
   - Go to: https://vercel.com/nidhis-projects-974b1b41/event-navigator/settings
   - Scroll to **Root Directory**
   - Set it to: `.` (root) or leave it empty
   - Click **Save**

2. **Set Environment Variable in Vercel Dashboard:**
   - Go to: https://vercel.com/nidhis-projects-974b1b41/event-navigator/settings/environment-variables
   - Add: `VITE_API_URL` = `https://event-navigator-backend.onrender.com/api`
   - Select all environments
   - Click **Save**

3. **Deploy from root:**
   ```powershell
   cd C:\AllMyProjects\hack-bot
   vercel --prod
   ```

## Quick Fix Commands

If you want to deploy from the frontend directory (recommended):

```powershell
# 1. Navigate to frontend
cd frontend

# 2. Deploy (after setting env var in dashboard)
vercel --prod
```

## Important Notes

- **Environment Variable**: Must be set in Vercel Dashboard, not in `vercel.json` (for security)
- **Root Directory**: Should match where you're deploying from
- **vercel.json**: Now exists in `frontend/` directory with correct configuration
- **Backend URL**: `https://event-navigator-backend.onrender.com/api`

## Verification

After deployment, check:
1. ✅ Build completes successfully
2. ✅ Environment variable is set in Vercel dashboard
3. ✅ Root directory matches your deployment location
4. ✅ Frontend can connect to backend API

## Troubleshooting

If you still get errors:

1. **"Root directory does not exist"**: 
   - Check Vercel dashboard settings → Root Directory
   - Make sure it matches your project structure

2. **"Environment variable not found"**:
   - Go to Vercel dashboard → Settings → Environment Variables
   - Add `VITE_API_URL` with value `https://event-navigator-backend.onrender.com/api`
   - Make sure it's enabled for Production environment

3. **"vercel.json not found"**:
   - Make sure `frontend/vercel.json` exists
   - Or set root directory to `.` and use root `vercel.json`

