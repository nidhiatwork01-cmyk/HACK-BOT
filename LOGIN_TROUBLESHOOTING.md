# 🔍 Login Troubleshooting Guide

## Common Issues & Solutions

### Issue: "Invalid email or password" after registration

---

## ✅ Quick Checks

### 1. **Check Which Backend You're Using**

**Problem**: You might have registered on **local backend** but trying to login on **deployed backend** (or vice versa).

**Solution**:
- **Local Backend**: `http://localhost:5000/api`
- **Deployed Backend**: `https://event-navigator-backend.onrender.com/api`

**Check your frontend**:
- Open browser DevTools (F12)
- Go to **Network** tab
- Try to login
- Check which URL the login request goes to

**Fix**:
- Make sure `VITE_API_URL` in Vercel is set to your deployed backend
- Or register/login on the same backend

---

### 2. **Check Email Case**

**Problem**: Email might be stored differently than you're typing.

**Solution**:
- Backend automatically lowercases emails
- Try typing your email in all lowercase
- Example: `2330373@kiit.ac.in` (not `2330373@KIIT.AC.IN`)

---

### 3. **Verify User Exists in Database**

**Run this script** to check if your user exists:

```powershell
cd backend
python debug_login.py your.email@kiit.ac.in
```

This will show:
- All registered users
- Whether your specific email exists
- User details

---

### 4. **Check Password**

**Common mistakes**:
- Extra spaces before/after password
- Wrong password (typo)
- Password was changed but you're using old one

**Solution**:
- Try typing password in a text editor first, then copy-paste
- Make sure no extra spaces
- If unsure, try registering again with a simple password

---

### 5. **Backend Connection Issue**

**Check if backend is running**:

**Local**:
```powershell
# Check if backend is running
# Should see: "🚀 Events Navigator Backend starting on port 5000"
```

**Deployed**:
- Visit: `https://event-navigator-backend.onrender.com/`
- Should see: `{"message": "Events Navigator Backend API", ...}`

---

## 🔧 Step-by-Step Debugging

### Step 1: Check Browser Console

1. Open DevTools (F12)
2. Go to **Console** tab
3. Try to login
4. Look for errors:
   - `Network error` → Backend not running
   - `401 Unauthorized` → Wrong email/password
   - `404 Not Found` → Wrong API URL

### Step 2: Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Try to login
4. Click on the `/auth/login` request
5. Check:
   - **Request URL**: Should be your backend URL
   - **Request Payload**: Check email/password being sent
   - **Response**: See error message

### Step 3: Check Backend Logs

**Local Backend**:
- Check terminal where backend is running
- Look for error messages

**Deployed Backend (Render)**:
1. Go to: https://dashboard.render.com
2. Click on your service
3. Go to **Logs** tab
4. Look for login errors

### Step 4: Verify Database

Run the debug script:
```powershell
cd backend
python debug_login.py
```

This shows all users in the database.

---

## 🛠️ Quick Fixes

### Fix 1: Re-register (If user doesn't exist)

1. Go to registration page
2. Use the same email
3. Use a simple password (remember it!)
4. Register again
5. Try logging in

### Fix 2: Reset Password (Manual)

If you have database access:
```python
# This requires direct database access
# Contact admin or use backend script
```

### Fix 3: Check Environment Variables

**Frontend**:
- Make sure `VITE_API_URL` points to correct backend
- Check in Vercel dashboard

**Backend**:
- Make sure database file is correct
- Check `events.db` exists

---

## 🧪 Test Login Directly

Test the login API directly:

```powershell
# Using PowerShell
$body = @{
    email = "your.email@kiit.ac.in"
    password = "yourpassword"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://event-navigator-backend.onrender.com/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

Or use Postman/curl:
```bash
curl -X POST https://event-navigator-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your.email@kiit.ac.in","password":"yourpassword"}'
```

---

## 📋 Checklist

Before asking for help, check:

- [ ] Backend is running (local or deployed)
- [ ] Frontend is connecting to correct backend
- [ ] Email is in lowercase
- [ ] Password has no extra spaces
- [ ] User exists in database (run debug script)
- [ ] No errors in browser console
- [ ] No errors in backend logs

---

## 🆘 Still Not Working?

1. **Run debug script**:
   ```powershell
   cd backend
   python debug_login.py your.email@kiit.ac.in
   ```

2. **Check backend logs** for errors

3. **Try registering again** with a simple password

4. **Check if you're using the right backend** (local vs deployed)

---

## 💡 Prevention Tips

1. **Always use lowercase email** when logging in
2. **Remember which backend** you registered on
3. **Use a password manager** to avoid typos
4. **Test login immediately** after registration

---

**Most common issue**: Registered on local backend, trying to login on deployed backend (or vice versa)!

