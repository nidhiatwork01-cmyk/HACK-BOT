# ⚡ Quick Start: Vercel Deployment 

## 🚀 Deploy in 15 Minutes

### Step 1: Push to GitHub (5 min)
```bash
cd C:\Users\hiten\Desktop\HackABot\HACK-BOT
git init
git add .
git commit -m "Ready for Vercel deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Deploy Backend (5 min)
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Set **Root Directory** to `backend`
4. Add environment variable: `JWT_SECRET` = `any-random-secret-key-here`
5. Click Deploy
6. **Copy your backend URL** (e.g., `https://hackbot-backend.vercel.app`)

### Step 3: Deploy Frontend (5 min)
1. Go to https://vercel.com/new again
2. Import the SAME GitHub repo
3. Set **Root Directory** to `frontend`
4. Add environment variable: `VITE_API_URL` = `https://YOUR-BACKEND-URL.vercel.app/api`
5. Click Deploy
6. **Your app is live!** 🎉

### Step 4: Update Backend CORS
1. Go to backend project → Settings → Environment Variables
2. Add: `CORS_ORIGINS` = `https://YOUR-FRONTEND-URL.vercel.app`
3. Redeploy backend

---

## ✅ Verification

- ✓ Backend working: Visit `https://your-backend.vercel.app/api/events`
- ✓ Frontend working: Visit `https://your-frontend.vercel.app`
- ✓ Check browser console (F12) for no errors

---

## 📖 Full Guide

See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for complete details.

---

## 🐛 Quick Fixes

**Can't connect to backend?**
- Check `VITE_API_URL` includes `/api` at the end
- Check `CORS_ORIGINS` in backend settings

**Database errors?**
- SQLite has issues on Vercel serverless
- Use Vercel Postgres or external DB for production

**Build fails?**
- Check Vercel logs in dashboard
- Verify all dependencies in package.json/requirements.txt
