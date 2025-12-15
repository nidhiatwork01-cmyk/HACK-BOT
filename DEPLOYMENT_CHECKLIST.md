# ✅ Deployment Checklist

Use this checklist to track your deployment progress!

## 📋 Pre-Deployment

- [ ] Code is working locally
- [ ] Backend runs on `python app.py`
- [ ] Frontend runs on `npm run dev`
- [ ] Map features work locally
- [ ] All files committed to Git
- [ ] `.gitignore` is set up correctly

## 🔵 GitHub Setup

- [ ] GitHub account created
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] Repository is accessible

## 🔧 Backend Deployment (Render)

- [ ] Render account created
- [ ] GitHub connected to Render
- [ ] New Web Service created
- [ ] Repository selected
- [ ] **Root Directory:** `backend` ✅
- [ ] **Build Command:** `pip install -r requirements.txt` ✅
- [ ] **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT` ✅
- [ ] Environment variables added:
  - [ ] `SECRET_KEY`
  - [ ] `KSAC_SECRET_KEY`
  - [ ] `FACULTY_SECRET_KEY`
  - [ ] `SOCIETY_PRESIDENT_SECRET_KEY`
  - [ ] `ADMIN_SECRET_KEY`
  - [ ] `PYTHON_VERSION` = `3.11.0`
- [ ] Service deployed successfully
- [ ] Backend URL copied: `https://________________.onrender.com`
- [ ] Health check works: `/health` endpoint

## 🎨 Frontend Deployment (Vercel)

- [ ] Vercel account created
- [ ] GitHub connected to Vercel
- [ ] New Project created
- [ ] Repository imported
- [ ] **Project Name:** (no hyphens!) ✅
- [ ] **Root Directory:** `frontend` ✅
- [ ] **Framework:** Vite ✅
- [ ] **Build Command:** `npm run build` ✅
- [ ] **Output Directory:** `dist` ✅
- [ ] Environment variable added:
  - [ ] `VITE_API_URL` = `https://your-backend.onrender.com/api`
- [ ] Project deployed successfully
- [ ] Frontend URL copied: `https://________________.vercel.app`

## 🔗 Configuration

- [ ] Backend CORS allows Vercel domain
- [ ] Frontend `VITE_API_URL` points to backend
- [ ] Environment variables verified in both platforms

## 🧪 Testing

- [ ] Backend health check: `/health` ✅
- [ ] Backend API: `/api/events` ✅
- [ ] Frontend loads: Home page ✅
- [ ] Events page loads ✅
- [ ] Can view event details ✅
- [ ] Map "Get Directions" button works ✅
- [ ] Map "View Map" button works ✅
- [ ] Can register/login ✅
- [ ] Can create events ✅
- [ ] No console errors (F12) ✅

## 📝 Final Steps

- [ ] Add sample events (run `add_kiit_sample_events.py` on backend)
- [ ] Test all features end-to-end
- [ ] Share your deployed URLs!

---

## 🎯 Your Deployment URLs

**Backend:** `https://________________.onrender.com`  
**Frontend:** `https://________________.vercel.app`

**Save these URLs!** 📌

---

## 🆘 If Something Fails

1. ✅ Check build logs in Render/Vercel dashboard
2. ✅ Check browser console (F12)
3. ✅ Verify environment variables
4. ✅ Check CORS configuration
5. ✅ Review `COMPLETE_DEPLOYMENT_GUIDE.md`

---

**Good luck! 🚀**

