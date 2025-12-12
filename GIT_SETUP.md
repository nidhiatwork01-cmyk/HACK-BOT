# 📦 Git Setup Guide

## Step 1: Initialize Git Repository

```powershell
cd C:\AllMyProjects\hack-bot
git init
```

## Step 2: Add All Files

```powershell
git add .
```

## Step 3: Create First Commit

```powershell
git commit -m "Initial commit: Events Navigator - Campus Event Management Platform with ML Features"
```

## Step 4: Add Remote Repository (GitHub/GitLab)

### If you have a GitHub repository:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### If you don't have a repository yet:

1. Go to GitHub.com
2. Click "New Repository"
3. Name it (e.g., "hack-bot" or "events-navigator")
4. Don't initialize with README
5. Copy the repository URL
6. Run:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## 🔄 Daily Git Workflow

### Check Status
```powershell
git status
```

### Add Changes
```powershell
git add .
```

### Commit Changes
```powershell
git commit -m "Description of your changes"
```

### Push to GitHub
```powershell
git push
```

### Pull Latest Changes
```powershell
git pull
```

---

## 📝 Good Commit Messages

Examples:
- `git commit -m "Add ML features: semantic search, description enhancement, success prediction"`
- `git commit -m "Fix login authentication issue"`
- `git commit -m "Update UI with KIIT branding"`
- `git commit -m "Add user profile page"`

---

## 🚫 Files NOT Included (in .gitignore)

- `node_modules/` - Frontend dependencies
- `*.db` - Database files
- `__pycache__/` - Python cache
- `.env` - Environment variables (secrets)
- `dist/` - Build files

---

## ✅ Quick Setup (Copy-Paste All at Once)

```powershell
cd C:\AllMyProjects\hack-bot
git init
git add .
git commit -m "Initial commit: Events Navigator Platform"
```

Then add your remote and push:
```powershell
git remote add origin YOUR_REPO_URL
git branch -M main
git push -u origin main
```

