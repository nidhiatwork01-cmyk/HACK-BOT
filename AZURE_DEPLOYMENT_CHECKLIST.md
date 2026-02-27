# ✅ Azure Deployment Checklist

Use this checklist to ensure everything is ready before deploying to Microsoft Azure.

---

## 📋 Pre-Deployment Verification

### Backend Files
- [x] `app.py` - Main Flask application
- [x] `db_config_azure.py` - PostgreSQL adapter
- [x] `requirements.txt` - All dependencies including psycopg2-binary
- [x] All ML modules (ml_*.py files)
- [x] Utility scripts (migrate_db.py, add_kiit_sample_events.py, etc.)
- [x] `__init__.py` for package imports

### Frontend Files
- [x] `package.json` - Node dependencies
- [x] `vite.config.js` - Build configuration
- [x] `tailwind.config.js` - Tailwind setup
- [x] All source files in src/

### Docker Configuration
- [x] `Dockerfile` - Multi-stage build (root directory)
- [x] `.dockerignore` - Excludes node_modules, __pycache__, etc.

### Documentation
- [x] `README.md` - Project overview (Azure-focused)
- [x] `AZURE_QUICKSTART.md` - 15-minute quick start
- [x] `AZURE_DEPLOYMENT_GUIDE.md` - Complete guide
- [x] `HOW_TO_RUN.md` - Local development
- [x] `QUICKSTART.md` - Quick local setup

---

## 🔧 Configuration Checklist

### CORS Configuration
- [x] Azure domains added to CORS in app.py:
  - `https://*.azurewebsites.net`
  - `https://*.azurestaticapps.net`

### Environment Variables Required
- [ ] `SECRET_KEY` - Random secret for JWT
- [ ] `KSAC_SECRET_KEY` - For KSAC access
- [ ] `FACULTY_SECRET_KEY` - For faculty access
- [ ] `SOCIETY_PRESIDENT_SECRET_KEY` - For society presidents
- [ ] `ADMIN_SECRET_KEY` - For admin access
- [ ] `PORT` - Set to 8080
- [ ] `WEBSITES_PORT` - Set to 8080 (Azure specific)
- [ ] `DATABASE_URL` - PostgreSQL connection string (if using PostgreSQL)

### Database Configuration
- [ ] Choose database option:
  - [ ] Option A: Azure Database for PostgreSQL (Recommended)
  - [ ] Option B: Azure Files with SQLite (Quick/Dev)
- [ ] Database initialized
- [ ] Sample data loaded (optional)

---

## 🚀 Deployment Steps

### 1. Azure Account Setup
- [ ] Azure account created
- [ ] Azure CLI installed
- [ ] Logged in: `az login`
- [ ] Subscription selected

### 2. Resource Group
- [ ] Created: `az group create --name event-navigator-rg-sea --location southeastasia`
- [ ] Student subscriptions may be region-restricted; use an allowed region (e.g., `southeastasia`)

### 3. Container Registry
- [ ] ACR created: `az acr create --resource-group event-navigator-rg-sea --name eventnavigatoracrs --sku Basic`
- [ ] Logged in: `az acr login --name eventnavigatoracrs`

### 4. Docker Image
- [ ] Image built: `docker build -t eventnavigatoracrs.azurecr.io/event-navigator:latest .`
- [ ] Image pushed: `docker push eventnavigatoracrs.azurecr.io/event-navigator:latest`

### 5. App Service Plan
- [ ] Created: `az appservice plan create --name event-navigator-plan-sea --resource-group event-navigator-rg-sea --is-linux --sku B1`

### 6. Web App
- [ ] Created: `az webapp create --resource-group event-navigator-rg-sea --plan event-navigator-plan-sea --name event-navigator-app-sea --deployment-container-image-name eventnavigatoracrs.azurecr.io/event-navigator:latest`
- [ ] ACR credentials configured
- [ ] Environment variables set

### 7. Database (If using PostgreSQL)
- [ ] PostgreSQL server created
- [ ] Database created
- [ ] Firewall rules configured
- [ ] DATABASE_URL set in Web App
- [ ] Tables initialized: `python backend/db_config_azure.py init`

### 8. Post-Deployment
- [ ] App accessible at `https://<app-name>.azurewebsites.net`
- [ ] HTTPS enabled
- [ ] Logs checked: `az webapp log tail`
- [ ] Sample data loaded (optional)
- [ ] Test user created

---

## 🧪 Testing Checklist

### Local Testing (Before Deployment)
- [ ] Backend runs locally: `python backend/app.py`
- [ ] Frontend runs locally: `npm run dev` (in frontend/)
- [ ] Docker build succeeds: `docker build -t test .`
- [ ] Docker container runs: `docker run -p 8080:8080 test`
- [ ] All ML modules import correctly
- [ ] Database migrations work

### Azure Testing (After Deployment)
- [ ] App homepage loads
- [ ] Can register with @kiit.ac.in email
- [ ] Can login
- [ ] Can create event
- [ ] Can search events
- [ ] Can register for event
- [ ] ML features working (search, recommendations)
- [ ] Calendar view working
- [ ] AI Assistant working
- [ ] Profile page loads
- [ ] Admin dashboard accessible (for privileged users)

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: App doesn't start
- Check: `az webapp log tail --name <app-name> --resource-group <rg>`
- Fix: Verify PORT and WEBSITES_PORT are set to 8080

**Issue**: RequestDisallowedByAzure when creating resources
- Cause: Subscription policy restricts regions
- Fix: Create resources in an allowed region (e.g., `southeastasia`) or create a new resource group there

**Issue**: Database connection fails
- Check: DATABASE_URL environment variable
- Check: PostgreSQL firewall rules allow Azure services
- Fix: Run `az postgres flexible-server firewall-rule create`

**Issue**: CORS errors
- Check: CORS configuration in app.py includes Azure domains
- Check: Frontend VITE_API_URL points to correct backend URL

**Issue**: ML features not working
- Check logs for import errors
- Verify: Should fallback to TF-IDF if sentence-transformers fails
- This is expected and normal

---

## 📊 Monitoring

### Enable Monitoring
- [ ] Application Insights created
- [ ] Connected to Web App
- [ ] Logs streaming configured

### Metrics to Monitor
- [ ] Response times
- [ ] Error rates
- [ ] Database connections
- [ ] Memory usage
- [ ] CPU usage

---

## 🔒 Security Checklist

- [ ] HTTPS only enabled
- [ ] Environment variables in Key Vault (optional but recommended)
- [ ] Strong SECRET_KEY generated
- [ ] Database firewall configured
- [ ] No secrets in code or Git repository
- [ ] .gitignore includes .env, *.db, node_modules, __pycache__

---

## 💰 Cost Management

- [ ] Understand pricing:
  - B1 App Service: ~$13/month
  - Basic ACR: ~$5/month
  - PostgreSQL B1ms: ~$12/month
- [ ] Set up cost alerts
- [ ] Monitor usage
- [ ] Consider free tier options for dev/test

---

## 📚 Documentation Review

- [ ] README.md updated with Azure info
- [ ] AZURE_QUICKSTART.md reviewed
- [ ] AZURE_DEPLOYMENT_GUIDE.md reviewed
- [ ] All links working
- [ ] Screenshots updated (if any)

---

## 🎯 Final Verification

### Before Going Live
- [ ] All features tested
- [ ] Performance acceptable
- [ ] Database backed up
- [ ] Monitoring enabled
- [ ] Team has access to Azure portal
- [ ] Documentation accessible
- [ ] Support plan in place

### After Going Live
- [ ] Users can access the app
- [ ] Load testing completed (if expecting high traffic)
- [ ] Backup/restore tested
- [ ] Monitoring dashboards configured
- [ ] Incident response plan ready

---

## 🚀 Quick Deploy Command Summary

```powershell
# Variables
$RG = "event-navigator-rg-sea"
$LOCATION = "southeastasia"
$ACR_NAME = "eventnavigatoracrs"
$APP_NAME = "event-navigator-app-sea"

# 1. Create resource group
az group create --name $RG --location $LOCATION

# 2. Create ACR
az acr create --resource-group $RG --name $ACR_NAME --sku Basic
az acr login --name $ACR_NAME

# 3. Build and push
docker build -t ${ACR_NAME}.azurecr.io/event-navigator:latest .
docker push ${ACR_NAME}.azurecr.io/event-navigator:latest

# 4. Create App Service Plan
az appservice plan create --name "event-navigator-plan-sea" --resource-group $RG --is-linux --sku B1

# 5. Create Web App
$ACR_USER = az acr credential show --name $ACR_NAME --query username -o tsv
$ACR_PASS = az acr credential show --name $ACR_NAME --query passwords[0].value -o tsv

az webapp create --resource-group $RG --plan "event-navigator-plan-sea" --name $APP_NAME `
  --deployment-container-image-name "${ACR_NAME}.azurecr.io/event-navigator:latest"

az webapp config container set --name $APP_NAME --resource-group $RG `
  --docker-custom-image-name "${ACR_NAME}.azurecr.io/event-navigator:latest" `
  --docker-registry-server-url "https://${ACR_NAME}.azurecr.io" `
  --docker-registry-server-user $ACR_USER `
  --docker-registry-server-password $ACR_PASS

# 6. Set environment variables
az webapp config appsettings set --name $APP_NAME --resource-group $RG `
  --settings PORT=8080 WEBSITES_PORT=8080 `
    SECRET_KEY="$(openssl rand -hex 32)" `
    KSAC_SECRET_KEY="hiiamfromksac" `
    FACULTY_SECRET_KEY="faculty-secret-2024" `
    SOCIETY_PRESIDENT_SECRET_KEY="society-secret-2024" `
    ADMIN_SECRET_KEY="admin-secret-2024"

# 7. Enable HTTPS
az webapp update --name $APP_NAME --resource-group $RG --https-only true

# Done!
Write-Host "✅ Deployed to: https://${APP_NAME}.azurewebsites.net" -ForegroundColor Green
```

---

## ✅ Completion

Once all items are checked:
- [ ] Deployment is complete
- [ ] App is live and accessible
- [ ] Team notified
- [ ] Documentation shared
- [ ] Support contact info provided

---

**For detailed instructions, see:**
- Quick Start: [AZURE_QUICKSTART.md](AZURE_QUICKSTART.md)
- Complete Guide: [AZURE_DEPLOYMENT_GUIDE.md](AZURE_DEPLOYMENT_GUIDE.md)

**🎉 Ready to deploy to Microsoft Azure!**
