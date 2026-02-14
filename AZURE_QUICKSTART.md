# ⚡ Azure Quick Start

Get your Campus Event Navigator running on Azure in 15 minutes!

## 🎯 Before You Start

**Requirements:**
- Azure account ([Get $200 free credits](https://azure.microsoft.com/free/))
- [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) installed
- Docker Desktop running

**Cost:** ~$30/month (Basic tier) or use free tier options

---

## 🚀 5-Step Deployment

### Step 1: Login & Setup (2 min)

```powershell
# Login to Azure
az login

# Set variables (change these!)
$RG = "event-navigator-rg"
$LOCATION = "eastus"
$ACR_NAME = "eventnavigatoracr"  # Must be unique globally
$APP_NAME = "event-navigator-app"  # Must be unique globally

# Create resource group
az group create --name $RG --location $LOCATION
```

### Step 2: Create Container Registry (2 min)

```powershell
# Create ACR
az acr create --resource-group $RG --name $ACR_NAME --sku Basic

# Login to ACR
az acr login --name $ACR_NAME
```

### Step 3: Build & Push Docker Image (5 min)

```powershell
# Navigate to project root (where Dockerfile is)
cd C:\Users\hiten\Desktop\HackABot

# Build the image
docker build -t ${ACR_NAME}.azurecr.io/event-navigator:latest .

# Push to Azure
docker push ${ACR_NAME}.azurecr.io/event-navigator:latest
```

### Step 4: Create Web App (3 min)

```powershell
# Create App Service Plan
az appservice plan create --name "${APP_NAME}-plan" `
  --resource-group $RG --is-linux --sku B1

# Get ACR credentials
$ACR_USER = az acr credential show --name $ACR_NAME --query username -o tsv
$ACR_PASS = az acr credential show --name $ACR_NAME --query passwords[0].value -o tsv

# Create Web App with Docker
az webapp create --resource-group $RG `
  --plan "${APP_NAME}-plan" `
  --name $APP_NAME `
  --deployment-container-image-name "${ACR_NAME}.azurecr.io/event-navigator:latest"

# Configure container
az webapp config container set --name $APP_NAME `
  --resource-group $RG `
  --docker-custom-image-name "${ACR_NAME}.azurecr.io/event-navigator:latest" `
  --docker-registry-server-url "https://${ACR_NAME}.azurecr.io" `
  --docker-registry-server-user $ACR_USER `
  --docker-registry-server-password $ACR_PASS
```

### Step 5: Configure Environment (3 min)

```powershell
# Set environment variables
az webapp config appsettings set --name $APP_NAME `
  --resource-group $RG `
  --settings `
    PORT=8080 `
    WEBSITES_PORT=8080 `
    SECRET_KEY="$(openssl rand -hex 32)" `
    KSAC_SECRET_KEY="hiiamfromksac" `
    FACULTY_SECRET_KEY="faculty-secret-2024" `
    SOCIETY_PRESIDENT_SECRET_KEY="society-secret-2024" `
    ADMIN_SECRET_KEY="admin-secret-2024"

# Enable HTTPS only
az webapp update --name $APP_NAME --resource-group $RG --https-only true
```

---

## 🎉 Done!

Your app is live at: `https://<APP_NAME>.azurewebsites.net`

**Test it:**
```powershell
curl https://${APP_NAME}.azurewebsites.net
```

---

## ⚠️ Important: Database Setup

**Your SQLite database won't persist on Azure!** Choose one option:

### Option A: PostgreSQL (Recommended for production)

```powershell
# Create PostgreSQL server (takes ~5 min)
az postgres flexible-server create `
  --resource-group $RG `
  --name "${APP_NAME}-db" `
  --location $LOCATION `
  --admin-user adminuser `
  --admin-password "YourStrongPass123!" `
  --sku-name Standard_B1ms `
  --tier Burstable `
  --version 14 `
  --storage-size 32

# Create database
az postgres flexible-server db create `
  --resource-group $RG `
  --server-name "${APP_NAME}-db" `
  --database-name eventsdb

# Allow Azure services
az postgres flexible-server firewall-rule create `
  --resource-group $RG `
  --name "${APP_NAME}-db" `
  --rule-name AllowAzureServices `
  --start-ip-address 0.0.0.0 `
  --end-ip-address 0.0.0.0

# Set database URL in Web App
$DB_URL = "postgresql://adminuser:YourStrongPass123!@${APP_NAME}-db.postgres.database.azure.com/eventsdb?sslmode=require"
az webapp config appsettings set --name $APP_NAME `
  --resource-group $RG `
  --settings DATABASE_URL=$DB_URL

# Initialize tables
# SSH into your web app or run locally with DATABASE_URL set:
# python backend/db_config_azure.py init
```

### Option B: Keep SQLite with Azure Files (Quick & Easy)

```powershell
# Create storage account
az storage account create `
  --name "${ACR_NAME}store" `
  --resource-group $RG `
  --location $LOCATION `
  --sku Standard_LRS

# Create file share
az storage share create `
  --account-name "${ACR_NAME}store" `
  --name eventdata

# Get storage key
$STORAGE_KEY = az storage account keys list `
  --account-name "${ACR_NAME}store" `
  --query '[0].value' -o tsv

# Mount to Web App
az webapp config storage-account add `
  --resource-group $RG `
  --name $APP_NAME `
  --custom-id EventsDB `
  --storage-type AzureFiles `
  --share-name eventdata `
  --account-name "${ACR_NAME}store" `
  --mount-path /app/backend/data `
  --access-key $STORAGE_KEY
```

---

## 📊 View Your App

```powershell
# Open in browser
start https://${APP_NAME}.azurewebsites.net

# View logs
az webapp log tail --name $APP_NAME --resource-group $RG

# Check status
az webapp show --name $APP_NAME --resource-group $RG --query state
```

---

## 🔧 Common Issues

### App shows "Application Error"
```powershell
# Check logs
az webapp log tail --name $APP_NAME --resource-group $RG

# Restart app
az webapp restart --name $APP_NAME --resource-group $RG
```

### Docker image won't push
```powershell
# Re-login to ACR
az acr login --name $ACR_NAME

# Check ACR credentials
az acr credential show --name $ACR_NAME
```

### Database connection fails
```powershell
# Test PostgreSQL connection
az postgres flexible-server connect --name "${APP_NAME}-db" --admin-user adminuser

# Check firewall rules
az postgres flexible-server firewall-rule list `
  --resource-group $RG --name "${APP_NAME}-db"
```

---

## 🔄 Update Your App

```powershell
# 1. Make changes to your code
# 2. Rebuild and push image
docker build -t ${ACR_NAME}.azurecr.io/event-navigator:latest .
docker push ${ACR_NAME}.azurecr.io/event-navigator:latest

# 3. Restart Web App
az webapp restart --name $APP_NAME --resource-group $RG
```

---

## 💰 Cost Optimization

**Free Tier Alternative:**
- Use Azure Static Web Apps (frontend) - FREE
- Use Azure Container Apps (backend) - FREE tier available
- See full guide: [AZURE_DEPLOYMENT_GUIDE.md](AZURE_DEPLOYMENT_GUIDE.md)

**Monitor Costs:**
```powershell
# View cost analysis
az consumption usage list --start-date 2026-02-01 --end-date 2026-02-14
```

---

## 🧹 Clean Up (Delete Everything)

```powershell
# Delete entire resource group (removes all resources)
az group delete --name $RG --yes --no-wait
```

---

## 📚 Next Steps

- [ ] Set up custom domain
- [ ] Configure SSL certificate
- [ ] Enable Application Insights monitoring
- [ ] Set up CI/CD with GitHub Actions
- [ ] Configure auto-scaling

See full guide: [AZURE_DEPLOYMENT_GUIDE.md](AZURE_DEPLOYMENT_GUIDE.md)

---

## 🆘 Need Help?

- **Logs:** `az webapp log tail --name $APP_NAME --resource-group $RG`
- **Status:** `az webapp show --name $APP_NAME --resource-group $RG`
- **Support:** [Azure Support](https://azure.microsoft.com/support/)
- **Docs:** [azure-deployment-guide.md](AZURE_DEPLOYMENT_GUIDE.md)

---

**🎉 Congratulations! Your app is now running on Microsoft Azure!**
