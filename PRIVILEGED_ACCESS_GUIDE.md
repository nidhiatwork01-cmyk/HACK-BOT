# 🔐 Privileged Access System - Complete Guide

## ✅ What's Been Built

### 1. **Role-Based Access Control**
- ✅ Student (default) - Can request events
- ✅ Faculty - Can view and respond to all requests
- ✅ KSAC Member - Can manage all requests
- ✅ Society President - Can view requests (with society filter)
- ✅ Admin - Full access

### 2. **Secret Key Authentication**
- ✅ Separate registration for privileged users
- ✅ Secret key verification during registration
- ✅ Only users with correct secret keys can register as privileged
- ✅ Different secret keys for each role

### 3. **Secure Request Storage**
- ✅ All event requests stored in database
- ✅ Only accessible to privileged users
- ✅ Role-based filtering
- ✅ Secure API endpoints

### 4. **Separate Registration System**
- ✅ `/privileged-register` - For Faculty/KSAC/Society Presidents
- ✅ `/register` - For regular students
- ✅ Same login system for all users

## 🔑 Default Secret Keys

**⚠️ CHANGE THESE IN PRODUCTION!**

- **Faculty**: `faculty-secret-2024`
- **KSAC Member**: `ksac-secret-2024`
- **Society President**: `society-secret-2024`
- **Admin**: `admin-secret-2024`

## 📝 How to Use

### For Faculty/KSAC/Society Presidents:

1. **Register**:
   - Go to `/privileged-register`
   - Select your role
   - Enter your secret key (get from administration)
   - Fill in details and register

2. **Login**:
   - Use regular login at `/login`
   - Same credentials as registration

3. **Access Admin Dashboard**:
   - Click "Admin" in navbar (only visible to privileged users)
   - View all student event requests
   - See AI analysis
   - Respond to students

### For Students:

1. **Register** (regular registration)
2. **Use AI Assistant** to request events
3. **Requests are automatically forwarded** to privileged users

## 🛡️ Security Features

1. ✅ Secret key verification
2. ✅ Role-based access control
3. ✅ Protected API endpoints
4. ✅ JWT tokens with role information
5. ✅ Database-level security

## 📊 Database Schema

### Users Table (Updated):
- `role` - student, faculty, ksac_member, society_president, admin
- `society_name` - For society presidents

### Event Requests Table:
- Stores all student requests
- Accessible only to privileged users
- Includes AI analysis

## 🎯 Access Levels

| Role | Can View Requests | Can Respond | Can See All |
|------|------------------|-------------|-------------|
| Student | ❌ | ❌ | ❌ |
| Faculty | ✅ | ✅ | ✅ |
| KSAC Member | ✅ | ✅ | ✅ |
| Society President | ✅ | ✅ | Limited |
| Admin | ✅ | ✅ | ✅ |

## 🔧 Configuration

Edit `backend/app.py` to change secret keys:
```python
FACULTY_SECRET_KEY = 'your-secret-here'
KSAC_SECRET_KEY = 'your-secret-here'
SOCIETY_PRESIDENT_SECRET_KEY = 'your-secret-here'
ADMIN_SECRET_KEY = 'your-secret-here'
```

Or use environment variables (recommended for production).

## ✅ Complete System!

- ✅ Role-based authentication
- ✅ Secret key protection
- ✅ Secure request storage
- ✅ Admin dashboard with access control
- ✅ Separate registration for privileged users

**All event requests are securely stored and only accessible to authorized personnel!**

