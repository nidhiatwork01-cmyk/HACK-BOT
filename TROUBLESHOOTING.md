# Troubleshooting Guide

## Event Creation Failing?

### 1. Check if Backend is Running
```bash
# In backend directory
python app.py
```

You should see:
```
🚀 Events Navigator Backend starting on http://localhost:5000
📦 Database initialized: events.db
```

### 2. Check Backend Port
- Backend should run on `http://localhost:5000`
- Frontend expects backend on port 5000
- If port 5000 is busy, change it in `backend/app.py` and `frontend/src/services/api.js`

### 3. Check Browser Console
- Open browser DevTools (F12)
- Go to Console tab
- Look for error messages
- Check Network tab for failed API calls

### 4. Common Issues

**Issue: "Network error"**
- Backend is not running
- Solution: Start backend with `python backend/app.py`

**Issue: "CORS error"**
- Backend CORS not configured
- Solution: Already fixed in code, but restart backend

**Issue: "Missing required field"**
- Form validation error
- Solution: Fill all required fields (title, description, category, date, time, venue)

**Issue: Database error**
- Database file not created
- Solution: Backend auto-creates it on startup

### 5. Database Persistence

✅ **YES, storage is persistent!**

- SQLite database file: `backend/events.db`
- Created automatically on first run
- Persists all events and registrations
- Survives server restarts
- File location: `C:\AllMyProjects\hack-bot\backend\events.db`

### 6. Verify Database

Check if database exists:
```bash
cd backend
dir events.db  # Windows
# or
ls events.db   # Linux/Mac
```

### 7. Test Backend Directly

Open browser and go to:
- `http://localhost:5000/api/stats` - Should return JSON
- `http://localhost:5000/api/events` - Should return events list

### 8. Reset Database (if needed)

Delete `backend/events.db` and restart backend - it will recreate automatically.

