# 🎯 Vercel Deployment - Command Reference

## Essential Commands

### Initial Setup
```bash
# Install Vercel CLI (optional)
npm install -g vercel

# Login to Vercel
vercel login
```

### Deploy Backend
```bash
cd backend
vercel --prod

# Or link and deploy
vercel link
vercel --prod
```

### Deploy Frontend
```bash
cd frontend
vercel --prod

# Or link and deploy
vercel link
vercel --prod
```

### Update After Changes
```bash
# Just push to GitHub - auto-deploys!
git add .
git commit -m "Your changes"
git push

# Or manually redeploy
cd backend  # or frontend
vercel --prod
```

### Environment Variables
```bash
# Add environment variable
vercel env add VARIABLE_NAME

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm VARIABLE_NAME
```

### Logs & Debugging
```bash
# View recent logs
vercel logs

# View specific deployment logs
vercel logs [deployment-url]

# Open project dashboard
vercel dashboard
```

### Project Management
```bash
# List all projects
vercel ls

# Switch project
vercel switch

# Remove deployment
vercel remove [deployment-url]
```

## 🌐 Important URLs Structure

### Backend URLs
- Production: `https://hackbot-backend.vercel.app`
- API Endpoint: `https://hackbot-backend.vercel.app/api/events`
- Health Check: `https://hackbot-backend.vercel.app/api/health`

### Frontend URLs
- Production: `https://hackbot-frontend.vercel.app`
- Preview: `https://hackbot-frontend-git-[branch].vercel.app`

## 🔐 Environment Variables Needed

### Backend Project on Vercel
```
JWT_SECRET=your-secret-key-change-this-to-random
FLASK_ENV=production
CORS_ORIGINS=https://your-frontend-url.vercel.app
```

### Frontend Project on Vercel
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

## 📦 File Structure Required

```
HACK-BOT/
├── backend/
│   ├── api/
│   │   └── index.py          ← Entry point for Vercel
│   ├── app.py                ← Your Flask app
│   ├── requirements.txt      ← Python dependencies
│   ├── vercel.json           ← Backend config
│   └── .env.example
│
└── frontend/
    ├── src/
    ├── package.json          ← Node dependencies
    ├── vercel.json           ← Frontend config
    └── .env.example
```

## 🔄 Deployment Workflow

1. **Make changes locally**
   ```bash
   # Edit code
   git add .
   git commit -m "Description"
   ```

2. **Push to GitHub**
   ```bash
   git push
   ```

3. **Auto-deploy** ✨
   - Vercel detects push
   - Builds and deploys automatically
   - Get notification when complete

## 🐛 Common Issues & Fixes

### Issue: CORS Error
```bash
# Fix: Update backend CORS_ORIGINS
vercel env add CORS_ORIGINS
# Enter: https://your-frontend-url.vercel.app

# Redeploy
cd backend && vercel --prod
```

### Issue: Environment Variable Not Working
```bash
# Redeploy to apply new env vars
vercel --prod
```

### Issue: Database Connection Error
```
# SQLite doesn't persist on Vercel
# Solution: Use Vercel Postgres or external DB
```

### Issue: Build Failure
```bash
# Test locally first
cd frontend
npm install
npm run build

# Check logs
vercel logs
```

## 📱 Mobile/Browser Testing

Test your deployed app:
- Desktop browsers: Chrome, Firefox, Safari, Edge
- Mobile browsers: iOS Safari, Chrome Android
- Check responsive design
- Test all features

## 🎨 Custom Domain (Optional)

```bash
# Via CLI
vercel domains add yourdomain.com

# Via Dashboard
Project → Settings → Domains → Add Domain
```

## 📊 Monitor Your App

- **Dashboard**: https://vercel.com/dashboard
- **Analytics**: Enable in project settings
- **Logs**: `vercel logs` or dashboard Functions tab
- **Status**: Check deployment status in real-time

## 🚀 Quick Redeploy

```bash
# Redeploy latest production
vercel --prod --force

# Redeploy specific deployment
vercel rollback [deployment-url]
```

## 💡 Pro Tips

1. **Instant Previews**: Every branch gets a preview URL
2. **Monorepo Support**: One repo, multiple projects
3. **Edge Network**: Global CDN for fast loading
4. **Zero Config**: Most frameworks auto-detected
5. **Free Tier**: Perfect for personal/small projects

---

**Quick Help**: Run `vercel help` or visit https://vercel.com/docs
