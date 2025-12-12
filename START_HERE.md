# 🚀 Quick Start - Events Navigator

## ⚠️ IMPORTANT: Start Backend First!

The error "Network error. Is the backend running?" means you need to start the backend server.

### Step 1: Start Backend (Terminal 1)

**Option A: Double-click**
- Double-click `start-backend.bat` in the project root

**Option B: Command Line**
```bash
cd backend
python app.py
```

You should see:
```
🚀 Events Navigator Backend starting on http://localhost:5000
📦 Database initialized: events.db
 * Running on http://127.0.0.1:5000
```

**Keep this terminal open!** The backend must stay running.

### Step 2: Start Frontend (Terminal 2)

Open a NEW terminal window:

```bash
cd frontend
npm install  # Only needed first time
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

### Step 3: Open Browser

Go to: **http://localhost:3000**

## ✅ Verify It's Working

1. Backend running? → Open http://localhost:5000/api/stats (should show JSON)
2. Frontend running? → Open http://localhost:3000 (should show homepage)
3. Can create events? → Try creating an event now!

## 🐛 Still Getting Errors?

### "Network error. Is the backend running?"
- ✅ Backend must be running in a separate terminal
- ✅ Check http://localhost:5000/api/stats works
- ✅ Make sure backend terminal shows "Running on..."

### "Failed to create event"
- ✅ Check backend terminal for error messages
- ✅ Make sure all required fields are filled
- ✅ Check browser console (F12) for details

### Database Issues
- ✅ Database auto-creates on first backend start
- ✅ File location: `backend/events.db`
- ✅ **YES, storage is persistent!** All data saves automatically

## 📝 Quick Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can see events page
- [ ] Can create events

## 💾 Storage Persistence

**YES!** Your data is persistent:
- SQLite database: `backend/events.db`
- Created automatically
- All events and registrations saved
- Survives server restarts
- File persists on your computer

