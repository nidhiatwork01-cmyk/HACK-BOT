# 📋 EXACT Commands to Run Both Servers

## Copy and Paste These Commands

### Step 1: Open First Terminal (for Backend)

**In VS Code:**
- Click the `+` button in terminal to open a NEW terminal
- OR press `Ctrl + Shift + ` (backtick) to open new terminal

**Copy and paste this:**
```bash
cd C:\AllMyProjects\hack-bot\backend
python app.py
```

**You should see:**
```
🚀 Events Navigator Backend starting on http://localhost:5000
📦 Database initialized: events.db
 * Running on http://127.0.0.1:5000
```

**✅ LEAVE THIS TERMINAL OPEN!**

---

### Step 2: Open Second Terminal (for Frontend)

**In VS Code:**
- Click the `+` button again to open ANOTHER new terminal
- OR press `Ctrl + Shift + ` (backtick) again

**Copy and paste this:**
```bash
cd C:\AllMyProjects\hack-bot\frontend
npm run dev
```

**You should see:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

**✅ LEAVE THIS TERMINAL OPEN TOO!**

---

### Step 3: Open Browser

Go to: **http://localhost:3000**

---

## Visual Guide

```
Terminal 1 (Backend)          Terminal 2 (Frontend)
┌──────────────────┐          ┌──────────────────┐
│ cd backend       │          │ cd frontend       │
│ python app.py   │          │ npm run dev       │
│                  │          │                   │
│ Running...      │          │ Running...        │
│ Port: 5000      │          │ Port: 3000        │
└──────────────────┘          └──────────────────┘
         │                            │
         └────────────┬───────────────┘
                      │
                      ▼
              ┌───────────────┐
              │   Browser     │
              │ localhost:3000│
              └───────────────┘
```

---

## Quick Copy-Paste (All at Once)

**Terminal 1:**
```
cd C:\AllMyProjects\hack-bot\backend && python app.py
```

**Terminal 2:**
```
cd C:\AllMyProjects\hack-bot\frontend && npm run dev
```

---

## That's It! 🎉

Now both are running. Try creating an event!

