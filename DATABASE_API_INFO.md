# Database and API Information

## 🗄️ Database: SQLite

**Database Name:** `events.db`  
**Location:** `backend/events.db`  
**Type:** SQLite (file-based, embedded database)

### Database Schema

#### Events Table
```sql
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    venue TEXT NOT NULL,
    poster_url TEXT,
    registration_url TEXT,
    society TEXT,
    created_by INTEGER,  -- Foreign key to users.id
    event_password_hash TEXT,
    is_locked INTEGER DEFAULT 0,
    is_expired INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
)
```

#### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'student',
    society_name TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
```

#### Registrations Table
```sql
CREATE TABLE registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER,
    user_id INTEGER,
    user_email TEXT,
    registered_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
)
```

---

## 🔌 API: Flask REST API

**Framework:** Flask 3.0.0  
**Base URL:** `http://localhost:5000/api`  
**Protocol:** HTTP/HTTPS  
**Data Format:** JSON

### Delete Event Endpoint

**Endpoint:** `DELETE /api/events/<event_id>`  
**Authentication:** Required (JWT Bearer Token)  
**Authorization:** Only event creator or admin/faculty/ksac_member

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response (Success - 200):**
```json
{
  "message": "Event deleted successfully",
  "registrations_deleted": 2
}
```

**Response (Error - 403):**
```json
{
  "error": "Unauthorized: Only event creator or admin can delete events",
  "details": "Event created by: 5, Your ID: 3"
}
```

**Response (Error - 404):**
```json
{
  "error": "Event not found"
}
```

**Response (Error - 500):**
```json
{
  "error": "Failed to delete event",
  "details": "Error message here"
}
```

---

## 🔍 Troubleshooting Delete Issues

### Common Issues and Solutions

#### 1. **Type Mismatch Error**
**Problem:** `created_by` and `user_id` might be different types (int vs string)

**Solution:** The updated code now converts both to integers for comparison:
```python
is_creator = int(event_creator_id) == int(current_user_id)
```

#### 2. **Authentication Token Missing**
**Problem:** Token not being sent in request headers

**Check:**
- Is user logged in?
- Is token stored in localStorage?
- Is token being sent in Authorization header?

**Solution:** The frontend `api.js` automatically adds the token via interceptors.

#### 3. **User ID Mismatch**
**Problem:** The logged-in user's ID doesn't match `event.created_by`

**Debug:**
- Check backend console logs for debug output
- Verify `user.id === event.created_by` in frontend
- Check if event was created by a different user

#### 4. **Database Connection Issues**
**Problem:** SQLite database file locked or inaccessible

**Solution:**
- Ensure backend server has write permissions
- Check if database file exists: `backend/events.db`
- Restart backend server

#### 5. **Foreign Key Constraints**
**Problem:** SQLite foreign key constraints preventing deletion

**Solution:** The code deletes registrations first, then the event (cascade delete).

---

## 🧪 Testing the Delete Endpoint

### Using cURL
```bash
curl -X DELETE http://localhost:5000/api/events/6 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Using Browser Console
```javascript
// Get token from localStorage
const token = localStorage.getItem('token');

// Make delete request
fetch('http://localhost:5000/api/events/6', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

---

## 📊 Database Access

### View Events
```bash
# Using SQLite command line
sqlite3 backend/events.db
SELECT * FROM events;
```

### Check Event Creator
```sql
SELECT id, title, created_by FROM events WHERE id = 6;
```

### Check User ID
```sql
SELECT id, email, name FROM users WHERE email = 'your.email@kiit.ac.in';
```

---

## 🔐 Security Features

1. **JWT Authentication:** All delete requests require valid JWT token
2. **Authorization Check:** Only creator or admin can delete
3. **Type Safety:** Integer conversion for ID comparison
4. **Error Handling:** Detailed error messages for debugging
5. **Cascade Delete:** Automatically removes related registrations

---

## 📝 Current Implementation Details

### Backend (`backend/app.py`)
- **Delete Endpoint:** Line 375-413
- **Database:** SQLite (`events.db`)
- **Error Logging:** Full traceback printed to console
- **Debug Output:** User ID and event creator ID logged

### Frontend (`frontend/src/pages/EventDetail.jsx`)
- **Delete Function:** `handleDeleteEvent()`
- **API Call:** `deleteEvent(id)` from `api.js`
- **Visibility:** Only shown when `user.id === event.created_by`

### API Service (`frontend/src/services/api.js`)
- **Function:** `deleteEvent(eventId)`
- **Method:** DELETE
- **URL:** `/api/events/${eventId}`
- **Error Handling:** Catches and displays error messages

---

## 🐛 Debugging Steps

1. **Check Backend Console:**
   - Look for debug output showing user IDs
   - Check for error tracebacks
   - Verify authentication is working

2. **Check Browser Console:**
   - Open DevTools (F12)
   - Check Network tab for DELETE request
   - Verify request headers include Authorization
   - Check response status and body

3. **Verify Database:**
   - Check if event exists: `SELECT * FROM events WHERE id = 6;`
   - Check event creator: `SELECT created_by FROM events WHERE id = 6;`
   - Check user ID: `SELECT id FROM users WHERE email = 'your.email@kiit.ac.in';`

4. **Test Authentication:**
   - Verify token is valid
   - Check if user is logged in
   - Verify user ID matches event creator

---

**Last Updated:** 2024  
**Database:** SQLite 3  
**API:** Flask REST API

