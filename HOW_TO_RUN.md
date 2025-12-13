# 🚀 How to Run the Application

## Quick Start Guide

### Step 1: Start the Backend Server

**Open Terminal/PowerShell Window 1:**

```powershell
cd C:\Users\hiten\Desktop\Hackathon\HACK-BOT\backend
python app.py
```

**OR use the batch file:**
```powershell
cd C:\Users\hiten\Desktop\Hackathon\HACK-BOT
.\START_BACKEND.bat
```

✅ **You should see:**
```
🚀 Events Navigator Backend starting on port 5000
📦 Database initialized: events.db
 * Running on http://0.0.0.0:5000
```

**Keep this terminal open!** ⚠️ Don't close it.

---

### Step 2: Start the Frontend Server

**Open a NEW Terminal/PowerShell Window 2:**

```powershell
cd C:\Users\hiten\Desktop\Hackathon\HACK-BOT\frontend
npm install
npm run dev
```

**OR use the batch file:**
```powershell
cd C:\Users\hiten\Desktop\Hackathon\HACK-BOT
.\START_FRONTEND.bat
```

✅ **You should see:**
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**Keep this terminal open too!** ⚠️

---

### Step 3: Open in Browser

1. Open your web browser (Chrome, Firefox, Edge)
2. Go to: **http://localhost:3000**
3. You should see the landing page!

---

## 🗺️ Testing the Map Feature

### View Events with Maps:

1. **Click "Events" in the navbar** or go to: http://localhost:3000/events
2. **You should see 10 sample events** with real KIIT locations
3. **Click on any event** (e.g., "TechFest 2024 - Hackathon")
4. **You'll see:**
   - Venue location with "View Map" and "Get Directions" buttons
   - A clickable map preview card
   - Navigation icon (→) next to venue in event cards

5. **Click "Get Directions"** → Google Maps opens with directions to KIIT!

---

## 📋 Complete Command List

### Option A: Using Batch Files (Easiest)

**Terminal 1:**
```powershell
cd C:\Users\hiten\Desktop\Hackathon\HACK-BOT
.\START_BACKEND.bat
```

**Terminal 2:**
```powershell
cd C:\Users\hiten\Desktop\Hackathon\HACK-BOT
.\START_FRONTEND.bat
```

### Option B: Manual Commands

**Terminal 1 - Backend:**
```powershell
cd C:\Users\hiten\Desktop\Hackathon\HACK-BOT\backend
python app.py
```

**Terminal 2 - Frontend:**
```powershell
cd C:\Users\hiten\Desktop\Hackathon\HACK-BOT\frontend
npm install
npm run dev
```

---

## ✅ What You Should See

### Backend Terminal:
```
🚀 Events Navigator Backend starting on port 5000
📦 Database initialized: events.db
 * Running on http://0.0.0.0:5000
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

### Frontend Terminal:
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Browser:
- Landing page at http://localhost:3000
- Events page with 10 KIIT events
- Map buttons working on event detail pages

---

## 🐛 Troubleshooting

### Backend won't start?

**Error: "python is not recognized"**
- Install Python 3.7+ from python.org
- Or use: `py app.py` instead of `python app.py`

**Error: "Module not found"**
```powershell
cd backend
pip install Flask==3.0.0 flask-cors==4.0.0 PyJWT==2.8.0 bcrypt==4.1.2 python-dotenv==1.0.0
```

**Port 5000 already in use:**
- Close other applications using port 5000
- Or change port in `backend/app.py` (line 1462)

---

### Frontend won't start?

**Error: "npm is not recognized"**
- Install Node.js 16+ from nodejs.org
- Restart your terminal after installation

**Error: "Cannot find module"**
```powershell
cd frontend
rm -r node_modules
npm install
npm run dev
```

**Port 3000 already in use:**
- Close other applications using port 3000
- Vite will automatically try the next available port

---

### Events not showing?

1. **Check backend is running** - Should see "Running on port 5000"
2. **Check browser console** (Press F12) for errors
3. **Verify database exists:** `backend/events.db`
4. **Re-run sample events script:**
   ```powershell
   cd backend
   python add_kiit_sample_events.py
   ```

---

### Map buttons not working?

1. **Check browser console** (F12) for JavaScript errors
2. **Verify internet connection** (needed for Google Maps)
3. **Check pop-up blocker** - Allow pop-ups for localhost
4. **Try different browser** (Chrome, Firefox, Edge)

---

## 🎯 Quick Test Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can see events list (10 events)
- [ ] Can click on an event
- [ ] See "View Map" and "Directions" buttons
- [ ] Clicking buttons opens Google Maps
- [ ] No errors in browser console (F12)

---

## 💡 Tips

1. **Keep both terminals open** while using the app
2. **Use Ctrl+C** to stop servers when done
3. **Check terminal output** for error messages
4. **Browser console (F12)** shows frontend errors
5. **Backend terminal** shows API errors

---

## 🎉 Success!

Once both servers are running:
- ✅ Backend: http://localhost:5000
- ✅ Frontend: http://localhost:3000
- ✅ Events with real KIIT locations
- ✅ Map directions feature working!

**Happy testing! 🗺️**

