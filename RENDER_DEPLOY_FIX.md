# Render Deployment Fix

## Problem
Render couldn't find `requirements.txt` because it was looking in the root directory, but the file is in the `backend/` folder.

## Solution Applied

Updated `render.yaml` to:
1. Set `rootDir: backend` - This tells Render to use the backend folder as the root
2. Changed start command to `gunicorn app:app` - Better for production

## What Changed

### render.yaml
```yaml
services:
  - type: web
    name: events-navigator-backend
    env: python
    rootDir: backend  # ← ADDED THIS
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app:app  # ← CHANGED FROM python app.py
    ...
```

## Next Steps

1. **Commit and push the updated `render.yaml` to GitHub:**
   ```bash
   git add render.yaml
   git commit -m "Fix Render deployment: set rootDir to backend"
   git push
   ```

2. **In Render Dashboard:**
   - Go to your service settings
   - Make sure **Root Directory** is set to `backend`
   - Or just let it auto-detect from `render.yaml`
   - Click "Manual Deploy" → "Deploy latest commit"

3. **Verify the build:**
   - Check the build logs
   - Should now see: `Successfully installed Flask...`
   - Should NOT see: `ERROR: Could not open requirements file`

## Alternative: Manual Configuration in Render

If `render.yaml` doesn't work, configure manually in Render dashboard:

1. Go to your service → Settings
2. Set **Root Directory**: `backend`
3. Set **Build Command**: `pip install -r requirements.txt`
4. Set **Start Command**: `gunicorn app:app`
5. Save and redeploy

## Environment Variables

Make sure these are set in Render:
- `SECRET_KEY` (auto-generated or set manually)
- `KSAC_SECRET_KEY=hiiamfromksac`
- `FACULTY_SECRET_KEY=faculty-secret-2024`
- `SOCIETY_PRESIDENT_SECRET_KEY=society-secret-2024`
- `ADMIN_SECRET_KEY=admin-secret-2024`
- `PORT` (Render sets this automatically, but app.py handles it)

## Testing

After deployment:
1. Check service logs for: `🚀 Events Navigator Backend starting on port...`
2. Test API: `https://your-app.onrender.com/api/stats`
3. Should return JSON with event statistics

## Common Issues

### Still getting "requirements.txt not found"
- Make sure `rootDir: backend` is in render.yaml
- Or set Root Directory manually in Render dashboard
- Verify the file exists: `backend/requirements.txt`

### Build succeeds but service won't start
- Check logs for Python errors
- Verify `gunicorn` is in requirements.txt (it is)
- Check if PORT environment variable is set

### CORS errors
- Backend CORS is configured for:
  - `localhost:3000`
  - `localhost:5173`
  - `*.vercel.app`
  - `*.netlify.app`
- Add your frontend URL to CORS origins if needed

