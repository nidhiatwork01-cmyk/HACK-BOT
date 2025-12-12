# 🚀 How to Run Both Frontend and Backend

## The Setup (Already Configured ✅)

- **Frontend**: Runs on `http://localhost:3000` (React/Vite)
- **Backend**: Runs on `http://localhost:5000` (Flask)
- **Connection**: Frontend automatically connects to backend via proxy

## Step-by-Step Instructions

### Step 1: Start Backend (Terminal 1)

Open **PowerShell** or **Command Prompt**:

```bash
cd C:\AllMyProjects\hack-bot\backend
python app.py
```

**You should see:**
```
🚀 Events Navigator Backend starting on http://localhost:5000
📦 Database initialized: events.db
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

**✅ Keep this terminal open!** The backend must stay running.

### Step 2: Start Frontend (Terminal 2)

Open a **NEW** PowerShell/Command Prompt window:

```bash
cd C:\AllMyProjects\hack-bot\frontend
npm install    # Only needed first time
npm run dev
```

**You should see:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 3: Open Browser

Go to: **http://localhost:3000**

## How They Connect

1. **Frontend (port 3000)** - Your React app runs here
2. **Backend (port 5000)** - Your Flask API runs here
3. **Vite Proxy** - Automatically forwards `/api/*` requests from frontend to backend

**Example:**
- Frontend makes request to: `http://localhost:3000/api/events`
- Vite proxy forwards it to: `http://localhost:5000/api/events`
- Backend processes and returns data
- Frontend receives the response

## Visual Guide

```
┌─────────────────┐         ┌─────────────────┐
│   Browser       │         │   Frontend      │
│  localhost:3000 │ ──────> │  (React/Vite)   │
│                 │         │  Port: 3000      │
└─────────────────┘         └────────┬────────┘
                                     │
                                     │ /api/* requests
                                     │ (via proxy)
                                     ▼
                            ┌─────────────────┐
                            │   Backend       │
                            │  (Flask)        │
                            │  Port: 5000     │
                            └─────────────────┘
```

## Quick Test

1. **Test Backend**: Open http://localhost:5000/api/stats
   - Should show JSON data
   - If error → Backend not running

2. **Test Frontend**: Open http://localhost:3000
   - Should show homepage
   - If blank → Frontend not running

3. **Test Connection**: Try creating an event
   - If works → Both connected! ✅
   - If error → Check both terminals

## Troubleshooting

### "Network error. Is the backend running?"
- ✅ Start backend in Terminal 1
- ✅ Check http://localhost:5000/api/stats works
- ✅ Make sure backend terminal shows "Running on..."

### Frontend won't start
- ✅ Run `npm install` in frontend folder first
- ✅ Make sure Node.js is installed
- ✅ Check if port 3000 is available

### Backend won't start
- ✅ Make sure Python is installed
- ✅ Run `pip install -r requirements.txt` in backend folder
- ✅ Check if port 5000 is available

## One-Command Start (Windows)

Create a file `start-all.bat`:

```batch
@echo off
start "Backend" cmd /k "cd backend && python app.py"
timeout /t 3
start "Frontend" cmd /k "cd frontend && npm run dev"
```

Double-click to start both!

