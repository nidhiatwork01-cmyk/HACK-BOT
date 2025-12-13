# 🎓 Adding Real KIIT University Events

This guide will help you add sample events with **real KIIT University locations** in Bhubaneswar, India.

## 🚀 Quick Method

### Step 1: Make sure backend has been run at least once
```powershell
cd backend
python app.py
```
(Let it run for a few seconds, then stop it with Ctrl+C)

This creates the database file `events.db`.

### Step 2: Run the sample events script
```powershell
cd backend
python add_kiit_sample_events.py
```

✅ **This will add 10 sample events with real KIIT locations!**

---

## 📍 Real KIIT Locations Included

The script adds events with these **real locations**:

1. **KIIT Main Auditorium, KIIT University, Bhubaneswar**
2. **KIIT Convention Centre, Bhubaneswar**
3. **KIIT Sports Complex, Bhubaneswar**
4. **KIIT School of Computer Engineering, Bhubaneswar**
5. **KIIT Innovation Lab, Bhubaneswar**
6. **KIIT Library, KIIT University, Bhubaneswar**
7. **KIIT School of Management, Bhubaneswar**
8. **KIIT Student Activity Centre, Bhubaneswar**

All locations are **real places** that Google Maps can find and provide directions to!

---

## 🎯 Sample Events Added

The script creates 10 diverse events:

### Technical Events:
- **TechFest 2024 - Hackathon** (Main Auditorium)
- **AI & Machine Learning Workshop** (School of Computer Engineering)
- **Startup Pitch Competition** (Innovation Lab)
- **Robotics Workshop** (Innovation Lab)

### Cultural Events:
- **Cultural Night - Music & Dance** (Convention Centre)
- **Literary Fest - Poetry & Prose** (Library)
- **Dance Competition** (Student Activity Centre)

### Sports Events:
- **Cricket Tournament Finals** (Sports Complex)
- **Basketball Championship** (Sports Complex)

### Academic Events:
- **Career Guidance Seminar** (School of Management)

---

## ✅ Verification

After running the script:

1. **Start your servers:**
   ```powershell
   # Terminal 1 - Backend
   cd backend
   python app.py

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Open browser:** http://localhost:3000/events

3. **Check the events:**
   - You should see 10 sample events
   - Each event has a real KIIT location
   - Click on any event to see the map feature

4. **Test map directions:**
   - Click on any event
   - Click "Get Directions" button
   - Google Maps should open with directions to the KIIT location

---

## 🗺️ Testing Map Features

1. **Go to Events page:** http://localhost:3000/events
2. **Click on "TechFest 2024 - Hackathon"**
3. **You should see:**
   - Venue: "KIIT Main Auditorium, KIIT University, Bhubaneswar"
   - "View Map" button
   - "Get Directions" button
   - Map preview card

4. **Click "Get Directions":**
   - Google Maps opens in new tab
   - Shows route to KIIT Main Auditorium
   - Works on mobile too!

---

## 🔄 Re-running the Script

If you want to add the events again:

- The script **skips events that already exist** (checks by title)
- To add fresh events, you can:
  1. Delete existing events from the database, OR
  2. Modify event titles in the script

---

## 📝 Customizing Events

To add your own events, edit `backend/add_kiit_sample_events.py`:

```python
{
    "title": "Your Event Name",
    "description": "Event description...",
    "category": "technical",  # or "cultural", "sports", "academic"
    "venue": "KIIT Main Auditorium, KIIT University, Bhubaneswar",
    "society": "Your Society Name",
    "date": "2024-12-25",  # Format: YYYY-MM-DD
    "time": "14:00:00",     # Format: HH:MM:SS
    "poster_url": "",       # Optional: URL to event poster
    "registration_url": ""  # Optional: Registration form link
}
```

---

## 🐛 Troubleshooting

### Script says "Events table does not exist"
- **Solution:** Run the backend at least once first
  ```powershell
  cd backend
  python app.py
  ```
  (Wait a few seconds, then stop with Ctrl+C)

### Events not showing up
- **Solution:** Make sure backend is running
- Check browser console (F12) for errors
- Verify database file exists: `backend/events.db`

### Map directions not working
- **Solution:** 
  - Check internet connection
  - Verify venue names are correct
  - Try clicking "View Map" first, then "Get Directions"

---

## 🎉 Success!

Once you've run the script, you'll have:
- ✅ 10 sample events with real KIIT locations
- ✅ All locations work with Google Maps
- ✅ Directions feature fully functional
- ✅ Events spread across different categories

**Happy testing! 🗺️**

