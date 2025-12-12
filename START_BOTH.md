# 🚀 Quick Start Commands

## Option 1: Use Batch Files (Easiest)

### Terminal 1 - Backend:
Double-click `START_BACKEND.bat` or run:
```
START_BACKEND.bat
```

### Terminal 2 - Frontend:
Double-click `START_FRONTEND.bat` or run:
```
START_FRONTEND.bat
```

---

## Option 2: Manual Commands

### Terminal 1 - Backend:
```powershell
cd C:\AllMyProjects\hack-bot\backend
pip install Flask==3.0.0 flask-cors==4.0.0 PyJWT==2.8.0 bcrypt==4.1.2 python-dotenv==1.0.0
python app.py
```

### Terminal 2 - Frontend:
```powershell
cd C:\AllMyProjects\hack-bot\frontend
npm install
npm run dev
```

---

## ✅ What You'll See:

**Backend Terminal:**
```
🚀 Events Navigator Backend starting on http://localhost:5000
📦 Database initialized: events.db
⚠️ Using TF-IDF search (sentence-transformers disabled to avoid DLL errors)
 * Running on http://127.0.0.1:5000
```

**Frontend Terminal:**
```
VITE v5.4.21 ready in 1489 ms
➜ Local: http://localhost:3000/
```

---

## 🌐 Open Browser:
Go to: **http://localhost:3000**

---

## 🛑 To Stop:
Press `Ctrl+C` in each terminal

