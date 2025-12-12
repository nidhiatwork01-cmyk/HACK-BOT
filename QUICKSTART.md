# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Option A: Use Batch Files (Easiest!)

**Terminal 1 - Backend:**
- Double-click `START_BACKEND.bat` in the project root
- OR run: `START_BACKEND.bat`

**Terminal 2 - Frontend:**
- Double-click `START_FRONTEND.bat` in the project root  
- OR run: `START_FRONTEND.bat`

---

### Option B: Manual Commands

### 1. Backend Setup (Terminal 1)
```powershell
cd C:\AllMyProjects\hack-bot\backend
pip install Flask==3.0.0 flask-cors==4.0.0 PyJWT==2.8.0 bcrypt==4.1.2 python-dotenv==1.0.0
python app.py
```
✅ Backend running on http://localhost:5000

### 2. Frontend Setup (Terminal 2)
```powershell
cd C:\AllMyProjects\hack-bot\frontend
npm install
npm run dev
```
✅ Frontend running on http://localhost:3000

### 3. Open Browser
Navigate to `http://localhost:3000` and start using the app!

## 📝 First Steps

1. **Create an Event**: Click "Create Event" in navbar
2. **Browse Events**: Go to "Events" page
3. **View Calendar**: Check "Calendar" for date-organized view
4. **Register**: Click any event to register interest

## 🎨 Features to Demo

- ✅ Modern, clean UI with animations
- ✅ Event filtering by category
- ✅ Search functionality
- ✅ Calendar view
- ✅ Registration system
- ✅ Statistics dashboard
- ✅ Responsive design

## 🏆 Hackathon Presentation Tips

1. **Start with Home**: Show the beautiful landing page
2. **Create Event**: Demonstrate event creation
3. **Filter & Search**: Show filtering capabilities
4. **Calendar View**: Highlight unique calendar feature
5. **Registration**: Show registration flow
6. **Mobile View**: Resize browser to show responsiveness

## 🐛 Troubleshooting

**Backend not starting?**
- Check if port 5000 is available
- Ensure Python 3.7+ is installed
- Install dependencies: `pip install -r requirements.txt`

**Frontend not starting?**
- Check if port 3000 is available
- Ensure Node.js 16+ is installed
- Install dependencies: `npm install`

**CORS errors?**
- Ensure backend is running on port 5000
- Check browser console for specific errors

