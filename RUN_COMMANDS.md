# 🚀 Exact Commands to Run Both Servers

## Terminal 1 - Backend

Copy and paste this:

```bash
cd C:\AllMyProjects\hack-bot\backend
pip install -r requirements.txt
python app.py
```

**You should see:**
```
🚀 Events Navigator Backend starting on http://localhost:5000
📦 Database initialized: events.db
 * Running on http://127.0.0.1:5000
```

**✅ Keep this terminal open!**

---

## Terminal 2 - Frontend

Copy and paste this:

```bash
cd C:\AllMyProjects\hack-bot\frontend
npm run dev
```

**You should see:**
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:3000/
```

**✅ Keep this terminal open too!**

---

## Then Open Browser

Go to: **http://localhost:3000**

---

## Quick Copy-Paste (All at Once)

**Terminal 1:**
```
cd C:\AllMyProjects\hack-bot\backend && pip install -r requirements.txt && python app.py
```

**Terminal 2:**
```
cd C:\AllMyProjects\hack-bot\frontend && npm run dev
```

---

## ⚠️ Important

- **BOTH terminals must stay open**
- **Backend runs on port 5000**
- **Frontend runs on port 3000**
- **Don't close either terminal while using the app**

