# Troubleshooting Delete Event Issue

## Quick Fix: Delete Event Directly from Database

If the web interface isn't working, you can delete the event directly:

```bash
# Navigate to backend folder
cd backend

# Run Python to delete event 6
python -c "import sqlite3; conn = sqlite3.connect('events.db'); c = conn.cursor(); c.execute('DELETE FROM registrations WHERE event_id = 6'); c.execute('DELETE FROM events WHERE id = 6'); conn.commit(); print('Deleted event 6'); conn.close()"
```

## Debug Steps

### 1. Check Backend Server is Running
- Open terminal where backend is running
- You should see: `🚀 Events Navigator Backend starting on port 5000`
- If not running, start it: `cd backend && python app.py`

### 2. Check Browser Console (F12)
- Open Developer Tools (F12)
- Go to Console tab
- Try deleting the event
- Look for error messages
- Check Network tab → find DELETE request → see response

### 3. Check Backend Console
When you try to delete, you should see:
```
🗑️ DELETE request received for event 6
   User ID: X, Role: Y
DEBUG: Event creator ID: ...
DEBUG: Current user ID: ...
```

### 4. Verify Authentication
- Make sure you're logged in
- Check if token exists: Open browser console → `localStorage.getItem('token')`
- Should return a JWT token string

### 5. Check Event Ownership
- Event ID 6 might have `created_by: None` (orphaned)
- Or it might belong to a different user
- Check backend console for debug output

## Common Issues

### Issue: "Network error"
**Solution:** Backend server is not running on port 5000

### Issue: "Unauthorized" or 403 error
**Solution:** 
- You're not the event creator
- You're not an admin
- Token is expired (try logging out and back in)

### Issue: "Event not found" or 404 error
**Solution:** Event was already deleted or doesn't exist

### Issue: CORS error
**Solution:** Backend CORS is configured for `localhost:3000` - make sure frontend runs on that port

## Manual Database Deletion

If all else fails, delete directly from database:

1. Stop backend server (Ctrl+C)
2. Run:
   ```bash
   cd backend
   python -c "import sqlite3; conn = sqlite3.connect('events.db'); c = conn.cursor(); c.execute('DELETE FROM registrations WHERE event_id = 6'); c.execute('DELETE FROM events WHERE id = 6'); conn.commit(); print('Deleted'); conn.close()"
   ```
3. Restart backend server
4. Refresh frontend

## Test Backend Connection

Test if backend is reachable:
```bash
curl http://localhost:5000/api/stats
```

Should return JSON with event statistics.

