# 🔐 Authentication & Event Protection System

## ✅ What's Been Added

### 1. **User Authentication System**
- ✅ Login/Signup with school email validation
- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected routes
- ✅ User session management

### 2. **School Email Validation**
- ✅ Only allows emails from configured school domains
- ✅ Configurable in `backend/app.py` (SCHOOL_EMAIL_DOMAINS)
- ✅ Default: `kiit.ac.in`, `kiit.edu`, `kiituniversity.edu.in`

### 3. **Event Password Protection**
- ✅ Event creators can set a password when creating events
- ✅ Password-protected events show a lock icon
- ✅ Users must enter password to register
- ✅ Passwords are securely hashed and stored

### 4. **Security Features**
- ✅ Passwords hashed with bcrypt (never stored in plain text)
- ✅ JWT tokens for secure authentication
- ✅ Token expiration (7 days)
- ✅ Protected API endpoints
- ✅ Secure password verification

## 📁 New Files Created

### Backend:
- Updated `backend/app.py` with authentication endpoints
- Updated `backend/requirements.txt` with new dependencies

### Frontend:
- `frontend/src/context/AuthContext.jsx` - Authentication context
- `frontend/src/services/auth.js` - Auth API service
- `frontend/src/pages/Login.jsx` - Login page
- `frontend/src/pages/Register.jsx` - Registration page
- `frontend/src/components/auth/ProtectedRoute.jsx` - Route protection

## 🔧 Configuration

### School Email Domains
Edit `backend/app.py`:
```python
SCHOOL_EMAIL_DOMAINS = ['kiit.ac.in', 'kiit.edu', 'your-school.edu']
```

### Secret Key (Production)
Set environment variable:
```bash
export SECRET_KEY='your-secret-key-here'
```

Or edit `backend/app.py`:
```python
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key')
```

## 🚀 How to Use

### 1. Install New Dependencies

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
# (No new dependencies needed)
```

### 2. Restart Servers

Both backend and frontend need to be restarted to load new code.

### 3. User Flow

1. **Register**: User signs up with school email
2. **Login**: User logs in with credentials
3. **Create Event**: Authenticated users can create events
4. **Lock Event**: Optional password protection when creating
5. **Register for Event**: 
   - If locked: Enter password first
   - If unlocked: Direct registration

## 📊 Database Schema

### New Tables:
- **users**: Stores user accounts
  - id, email, password_hash, name, created_at

### Updated Tables:
- **events**: Added authentication fields
  - created_by (user_id)
  - event_password_hash
  - is_locked

- **registrations**: Linked to users
  - user_id (foreign key)

## 🔒 Security Best Practices Implemented

1. ✅ Password hashing (bcrypt)
2. ✅ JWT token authentication
3. ✅ Token expiration
4. ✅ Protected API endpoints
5. ✅ School email validation
6. ✅ Secure password storage
7. ✅ Input validation
8. ✅ Error handling

## 🎯 Features

### For Users:
- Secure registration with school email
- Login/logout functionality
- View profile in navbar
- Register for events (with password if locked)

### For Event Creators:
- Must be logged in to create events
- Option to password-protect events
- Events linked to creator account

### For Admins:
- All user data stored securely
- Event ownership tracking
- Registration tracking per user

## 🐛 Troubleshooting

### "Only school email addresses allowed"
- Check `SCHOOL_EMAIL_DOMAINS` in `backend/app.py`
- Add your school domain if missing

### "Invalid or expired token"
- User needs to login again
- Token expires after 7 days

### "Event password required"
- Event is password protected
- User must enter correct password

### Can't create events
- Must be logged in
- Check if token is valid

## 📝 API Endpoints

### Authentication:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Events (Updated):
- `POST /api/events` - Create event (now requires auth)
- `POST /api/events/:id/register` - Register (now requires auth + password if locked)

## 🎉 Ready to Use!

The authentication system is fully integrated and ready. Users must:
1. Register with school email
2. Login to create events
3. Enter password for locked events to register

All data is securely stored and protected!

