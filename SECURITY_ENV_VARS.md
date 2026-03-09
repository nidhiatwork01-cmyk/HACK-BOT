# 🔒 Environment Variables Security Guide

## ⚠️ CRITICAL: Never Commit Actual .env Files

Environment files contain sensitive credentials, API keys, and secrets. **NEVER** commit actual `.env` files to Git or include them in Docker images.

---

## ✅ What's Safe to Commit

- ✅ `.env.example` - Template files with placeholder values
- ✅ `.env.production` - Template with placeholder backend URLs (no actual secrets)

## ❌ What Should NEVER Be Committed

- ❌ `.env` - Local development environment file
- ❌ `.env.local` - Local overrides
- ❌ `.env.development` - Development secrets
- ❌ `.env.production.local` - Production secrets
- ❌ Any file containing actual API keys, passwords, or secrets

---

## 🛡️ Protection Mechanisms in Place

### 1. `.gitignore` Protection
Located at: `HACK-BOT/.gitignore`

Excludes:
```
.env
.env.*
*.env
.env.local
.env.*.local
.env.development
.env.production.local
.env.development.local
```

**Exceptions** (safe templates):
```
!.env.example
!.env.production
```

### 2. `.dockerignore` Protection
Located at: 
- `HACK-BOT/.dockerignore` (root Docker builds)
- `HACK-BOT/backend/.dockerignore` (backend-only builds)

Excludes all .env variants from Docker image builds:
```
.env
.env.*
*.env
.env.local
.env.*.local
.env.production
.env.development
.env.example
```

---

## 🔧 How to Use Environment Variables

### Local Development

1. Copy the example file:
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend
   cp frontend/.env.example frontend/.env
   ```

2. Edit with your local values:
   ```bash
   # backend/.env
   SECRET_KEY=your-local-secret-key
   DATABASE_URL=sqlite:///events.db
   
   # frontend/.env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Never commit these files!** They're already in `.gitignore`.

### Azure Deployment

**DO NOT** use `.env` files in production. Set environment variables directly in Azure:

#### Web App
```powershell
az webapp config appsettings set \
  --name your-app \
  --resource-group your-rg \
  --settings \
    SECRET_KEY="production-secret" \
    KSAC_SECRET_KEY="secret-value"
```

#### Container Apps
```powershell
az containerapp update \
  --name your-app \
  --resource-group your-rg \
  --set-env-vars \
    SECRET_KEY="production-secret" \
    KSAC_SECRET_KEY="secret-value"
```

#### Azure Key Vault (Recommended)
For production secrets, use Azure Key Vault:
```powershell
# Create Key Vault
az keyvault create --name your-keyvault --resource-group your-rg

# Add secrets
az keyvault secret set --vault-name your-keyvault --name SECRET-KEY --value "..."

# Reference in app settings
az webapp config appsettings set \
  --name your-app \
  --settings SECRET_KEY="@Microsoft.KeyVault(VaultName=your-keyvault;SecretName=SECRET-KEY)"
```

---

## 🔍 Verify No Secrets in Git

### Check for committed secrets
```powershell
# Search for .env files in git history
git log --all --full-history -- "**/.env"
git log --all --full-history -- "**/.env.*"

# Search for potential secrets in current commit
git grep -i "password\|secret\|api_key\|api-key" -- "*.env*"
```

### If you accidentally committed secrets

1. **Immediately rotate/change all exposed secrets**
2. Remove from git history:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch path/to/.env" \
     --prune-empty --tag-name-filter cat -- --all
   ```

3. Force push (⚠️ only if safe):
   ```bash
   git push origin --force --all
   ```

---

## 📦 Verify Docker Images Don't Contain Secrets

### Inspect built image
```powershell
# List files in image
docker run --rm your-image ls -la /app/backend
docker run --rm your-image find /app -name ".env*"

# Should return empty or only .env.example files
```

### Rebuild if secrets were included
```powershell
# Clean build
docker system prune -a
docker build --no-cache -t your-image .
```

---

## 🎯 Current Deployment Status

As of the latest deployment:
- ✅ All `.dockerignore` files updated with comprehensive .env exclusions
- ✅ `.gitignore` updated with comprehensive .env exclusions
- ✅ Azure deployments use environment variables set via Azure CLI
- ✅ No `.env` files included in Docker images
- ✅ Only safe template files (`.env.example`, `.env.production`) in repo

---

## 🚨 Security Checklist

Before every commit:
- [ ] No `.env` files staged for commit
- [ ] Only template files (`.env.example`) are committed
- [ ] Actual secrets are stored in Azure Key Vault or app settings
- [ ] `.gitignore` and `.dockerignore` are up to date

Before every deployment:
- [ ] Docker build doesn't include `.env` files (check build logs)
- [ ] Secrets are set via Azure CLI or Key Vault
- [ ] No hardcoded secrets in code
- [ ] Production secrets differ from development/example values

---

## 📚 Resources

- [Azure Key Vault Best Practices](https://docs.microsoft.com/azure/key-vault/general/best-practices)
- [Managing Secrets in Docker](https://docs.docker.com/engine/swarm/secrets/)
- [12-Factor App: Config](https://12factor.net/config)

---

**Remember: Secrets in code = Security breach. Always use environment variables or secret management services!**
