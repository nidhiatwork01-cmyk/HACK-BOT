# 🔐 Secret Keys for Privileged Access

## ⚠️ IMPORTANT: Change These in Production!

These are default secret keys. **You MUST change them before deploying to production!**

## Default Secret Keys

### Faculty Members
- **Secret Key**: `faculty-secret-2024`
- **Access**: Can view and respond to all event requests

### KSAC Members
- **Secret Key**: `hiiamfromksac`
- **Access**: Can manage event requests and coordinate events

### Society Presidents
- **Secret Key**: `society-secret-2024`
- **Access**: Can view requests related to their society

### Admins
- **Secret Key**: `admin-secret-2024`
- **Access**: Full administrative access

## 🔧 How to Change Secret Keys

### Option 1: Environment Variables (Recommended)
Set these in your environment:
```bash
export FACULTY_SECRET_KEY='your-faculty-secret'
export KSAC_SECRET_KEY='your-ksac-secret'
export SOCIETY_PRESIDENT_SECRET_KEY='your-society-secret'
export ADMIN_SECRET_KEY='your-admin-secret'
```

### Option 2: Edit backend/app.py
```python
FACULTY_SECRET_KEY = 'your-faculty-secret'
KSAC_SECRET_KEY = 'your-ksac-secret'
SOCIETY_PRESIDENT_SECRET_KEY = 'your-society-secret'
ADMIN_SECRET_KEY = 'your-admin-secret'
```

## 📝 How to Use

1. **Faculty/KSAC/Society Presidents**:
   - Go to `/privileged-register`
   - Select your role
   - Enter the corresponding secret key
   - Register and login
   - Access Admin Dashboard at `/admin`

2. **Students**:
   - Use regular registration at `/register`
   - No secret key needed
   - Can use Event Assistant to request events

## 🎯 Role Permissions

- **Student**: Can request events via AI assistant
- **Faculty**: Can view and respond to all requests
- **KSAC Member**: Can manage all requests
- **Society President**: Can view requests (filtered by society)
- **Admin**: Full access to everything

## 🔒 Security Notes

- Secret keys are verified during registration
- Only users with correct secret keys can register as privileged users
- All requests are stored securely in database
- Role-based access control protects admin endpoints

