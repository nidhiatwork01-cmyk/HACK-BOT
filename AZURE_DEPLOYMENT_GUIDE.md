# 🔷 Azure Deployment Guide

Complete guide to deploy the Campus Event Navigator on Microsoft Azure.

---

## 📋 Prerequisites

- Azure Account ([Free trial available](https://azure.microsoft.com/free/))
- Azure CLI installed ([Download here](https://docs.microsoft.com/cli/azure/install-azure-cli))
- Docker Desktop (for local testing)
- Git repository with your code

---

## 🚀 Deployment Options

### Option 1: Azure Web App with Docker (RECOMMENDED)
Deploy the entire app as a containerized web service.

### Option 2: Azure Static Web Apps + Container App
Separate frontend (Static Web App) and backend (Container App).

---

## 🐳 Option 1: Azure Web App with Docker Container

This deploys both frontend and backend together using your existing Dockerfile.

### Step 1: Login to Azure

```bash
# Login to Azure
az login

# Set your subscription (if you have multiple)
az account list --output table
az account set --subscription "YOUR_SUBSCRIPTION_ID"
```

### Step 2: Create Resource Group

```bash
# Create a resource group
az group create --name event-navigator-rg --location eastus
```

### Step 3: Create Azure Container Registry (ACR)

```bash
# Create ACR to store your Docker image
az acr create --resource-group event-navigator-rg \
  --name eventnavigatoracr --sku Basic

# Login to ACR
az acr login --name eventnavigatoracr
```

### Step 4: Build and Push Docker Image

```bash
# Navigate to project root (where Dockerfile is)
cd c:\Users\hiten\Desktop\HackABot

# Build the image
docker build -t eventnavigatoracr.azurecr.io/event-navigator:latest .

# Push to ACR
docker push eventnavigatoracr.azurecr.io/event-navigator:latest
```

### Step 5: Create App Service Plan

```bash
# Create Linux App Service Plan (B1 = Basic tier, ~$13/month)
az appservice plan create --name event-navigator-plan \
  --resource-group event-navigator-rg \
  --is-linux --sku B1
```

### Step 6: Create Web App

```bash
# Create Web App from Docker image
az webapp create --resource-group event-navigator-rg \
  --plan event-navigator-plan \
  --name event-navigator-app \
  --deployment-container-image-name eventnavigatoracr.azurecr.io/event-navigator:latest

# Enable ACR authentication
az webapp config container set --name event-navigator-app \
  --resource-group event-navigator-rg \
  --docker-custom-image-name eventnavigatoracr.azurecr.io/event-navigator:latest \
  --docker-registry-server-url https://eventnavigatoracr.azurecr.io \
  --docker-registry-server-user $(az acr credential show --name eventnavigatoracr --query username -o tsv) \
  --docker-registry-server-password $(az acr credential show --name eventnavigatoracr --query passwords[0].value -o tsv)
```

### Step 7: Configure Environment Variables

```bash
# Set environment variables
az webapp config appsettings set --name event-navigator-app \
  --resource-group event-navigator-rg \
  --settings \
    PORT=8080 \
    SECRET_KEY="your-random-secret-key-$(openssl rand -hex 32)" \
    KSAC_SECRET_KEY="hiiamfromksac" \
    FACULTY_SECRET_KEY="faculty-secret-2024" \
    SOCIETY_PRESIDENT_SECRET_KEY="society-secret-2024" \
    ADMIN_SECRET_KEY="admin-secret-2024" \
    WEBSITES_PORT=8080
```

### Step 8: Access Your App

Your app will be available at: `https://event-navigator-app.azurewebsites.net`

---

## 🗄️ DATABASE CONFIGURATION (CRITICAL!)

⚠️ **IMPORTANT**: SQLite won't work properly on Azure because the file system is ephemeral!

### Solution A: Azure Database for PostgreSQL (RECOMMENDED)

#### 1. Create PostgreSQL Database

```bash
# Create PostgreSQL server
az postgres flexible-server create \
  --resource-group event-navigator-rg \
  --name event-navigator-db \
  --location eastus \
  --admin-user adminuser \
  --admin-password "YourStrongPassword123!" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 14 \
  --storage-size 32

# Create database
az postgres flexible-server db create \
  --resource-group event-navigator-rg \
  --server-name event-navigator-db \
  --database-name eventsdb

# Allow Azure services to access
az postgres flexible-server firewall-rule create \
  --resource-group event-navigator-rg \
  --name event-navigator-db \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

#### 2. Update Backend Code

Install PostgreSQL adapter in `backend/requirements.txt`:
```
psycopg2-binary==2.9.9
```

Modify `backend/app.py` database connection:
```python
import psycopg2
from psycopg2.extras import RealDictCursor

# Replace sqlite3.connect with PostgreSQL
def get_db_connection():
    if os.environ.get('DATABASE_URL'):
        # PostgreSQL for production
        conn = psycopg2.connect(
            os.environ.get('DATABASE_URL'),
            cursor_factory=RealDictCursor
        )
    else:
        # SQLite for development
        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row
    return conn
```

#### 3. Set Database URL

```bash
az webapp config appsettings set --name event-navigator-app \
  --resource-group event-navigator-rg \
  --settings DATABASE_URL="postgresql://adminuser:YourStrongPassword123!@event-navigator-db.postgres.database.azure.com/eventsdb?sslmode=require"
```

### Solution B: Azure Files for SQLite (Simpler, but not recommended for production)

```bash
# Create storage account
az storage account create \
  --name eventnavigatorstore \
  --resource-group event-navigator-rg \
  --location eastus \
  --sku Standard_LRS

# Create file share
az storage share create \
  --account-name eventnavigatorstore \
  --name eventdata

# Mount to Web App
az webapp config storage-account add \
  --resource-group event-navigator-rg \
  --name event-navigator-app \
  --custom-id EventsDB \
  --storage-type AzureFiles \
  --share-name eventdata \
  --account-name eventnavigatorstore \
  --mount-path /app/backend \
  --access-key $(az storage account keys list --account-name eventnavigatorstore --query '[0].value' -o tsv)
```

---

## 🌐 Option 2: Azure Static Web Apps + Container Apps

Deploy frontend and backend separately for better scalability.

### Frontend: Azure Static Web Apps

```bash
# Install Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Create Static Web App (via Azure Portal is easier)
# 1. Go to Azure Portal > Create Resource > Static Web App
# 2. Connect to your GitHub repo
# 3. Set build details:
#    - App location: /HACK-BOT/frontend
#    - Output location: dist
#    - Build preset: React
```

**Or via GitHub Actions** (create `.github/workflows/azure-static-web-apps.yml`):

```yaml
name: Deploy to Azure Static Web Apps

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/HACK-BOT/frontend"
          api_location: ""
          output_location: "dist"
```

### Backend: Azure Container Apps

```bash
# Create Container Apps environment
az containerapp env create \
  --name event-navigator-env \
  --resource-group event-navigator-rg \
  --location eastus

# Deploy backend as Container App
az containerapp create \
  --name event-navigator-backend \
  --resource-group event-navigator-rg \
  --environment event-navigator-env \
  --image eventnavigatoracr.azurecr.io/event-navigator:latest \
  --target-port 8080 \
  --ingress external \
  --registry-server eventnavigatoracr.azurecr.io \
  --registry-username $(az acr credential show --name eventnavigatoracr --query username -o tsv) \
  --registry-password $(az acr credential show --name eventnavigatoracr --query passwords[0].value -o tsv) \
  --env-vars \
    SECRET_KEY="your-secret-key" \
    KSAC_SECRET_KEY="hiiamfromksac" \
    FACULTY_SECRET_KEY="faculty-secret-2024" \
    ADMIN_SECRET_KEY="admin-secret-2024"
```

### Connect Frontend to Backend

Update frontend environment variables in Azure Static Web App:
```
VITE_API_URL=https://event-navigator-backend.azurecontainerapps.io/api
```

---

## 🔒 Security Best Practices

### 1. Use Azure Key Vault for Secrets

```bash
# Create Key Vault
az keyvault create \
  --name event-navigator-kv \
  --resource-group event-navigator-rg \
  --location eastus

# Add secrets
az keyvault secret set --vault-name event-navigator-kv \
  --name SECRET-KEY --value "your-secret-key"

# Grant Web App access
az webapp identity assign \
  --name event-navigator-app \
  --resource-group event-navigator-rg

# Reference in app settings
az webapp config appsettings set \
  --name event-navigator-app \
  --resource-group event-navigator-rg \
  --settings SECRET_KEY="@Microsoft.KeyVault(VaultName=event-navigator-kv;SecretName=SECRET-KEY)"
```

### 2. Enable HTTPS Only

```bash
az webapp update --name event-navigator-app \
  --resource-group event-navigator-rg \
  --https-only true
```

### 3. Configure Custom Domain (Optional)

```bash
# Add custom domain
az webapp config hostname add \
  --webapp-name event-navigator-app \
  --resource-group event-navigator-rg \
  --hostname events.yourdomain.com

# Enable SSL
az webapp config ssl bind \
  --name event-navigator-app \
  --resource-group event-navigator-rg \
  --certificate-thumbprint YOUR_CERT_THUMBPRINT \
  --ssl-type SNI
```

---

## 📊 Monitoring & Logging

### Enable Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --app event-navigator-insights \
  --location eastus \
  --resource-group event-navigator-rg \
  --application-type web

# Connect to Web App
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
  --app event-navigator-insights \
  --resource-group event-navigator-rg \
  --query instrumentationKey -o tsv)

az webapp config appsettings set \
  --name event-navigator-app \
  --resource-group event-navigator-rg \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY="$INSTRUMENTATION_KEY"
```

### View Logs

```bash
# Stream logs
az webapp log tail --name event-navigator-app \
  --resource-group event-navigator-rg

# Download logs
az webapp log download --name event-navigator-app \
  --resource-group event-navigator-rg
```

---

## 🔄 Continuous Deployment

### GitHub Actions Workflow

Create `.github/workflows/azure-deploy.yml`:

```yaml
name: Deploy to Azure

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Login to Azure
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    
    - name: Login to ACR
      run: |
        az acr login --name eventnavigatoracr
    
    - name: Build and Push Docker Image
      run: |
        docker build -t eventnavigatoracr.azurecr.io/event-navigator:${{ github.sha }} .
        docker push eventnavigatoracr.azurecr.io/event-navigator:${{ github.sha }}
    
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'event-navigator-app'
        images: 'eventnavigatoracr.azurecr.io/event-navigator:${{ github.sha }}'
```

---

## 💰 Cost Estimation

**Basic Setup (Development/Hackathon):**
- App Service Plan (B1): ~$13/month
- Azure Container Registry (Basic): ~$5/month
- PostgreSQL (Burstable B1ms): ~$12/month
- **Total: ~$30/month**

**Free Tier Option:**
- Azure Static Web Apps: FREE (100 GB bandwidth/month)
- Azure Container Apps: FREE (First 180,000 vCPU-seconds + 360,000 GiB-s)
- Use SQLite with mounted Azure Files: ~$2/month

**Note:** Azure offers $200 free credits for new accounts!

---

## 🐛 Troubleshooting

### App not starting?

```bash
# Check logs
az webapp log tail --name event-navigator-app --resource-group event-navigator-rg

# Verify container is running
az webapp show --name event-navigator-app --resource-group event-navigator-rg
```

### Database connection issues?

```bash
# Test PostgreSQL connection
az postgres flexible-server connect --name event-navigator-db

# Check firewall rules
az postgres flexible-server firewall-rule list \
  --resource-group event-navigator-rg \
  --name event-navigator-db
```

### CORS errors?

Ensure your Azure domain is in the CORS configuration in `backend/app.py` (already added).

---

## 🎉 Quick Deploy (All-in-One Script)

Save this as `deploy-azure.sh`:

```bash
#!/bin/bash

# Configuration
RG="event-navigator-rg"
LOCATION="eastus"
ACR_NAME="eventnavigatoracr"
APP_NAME="event-navigator-app"
PLAN_NAME="event-navigator-plan"

# Create resource group
az group create --name $RG --location $LOCATION

# Create ACR
az acr create --resource-group $RG --name $ACR_NAME --sku Basic
az acr login --name $ACR_NAME

# Build and push Docker image
docker build -t $ACR_NAME.azurecr.io/event-navigator:latest .
docker push $ACR_NAME.azurecr.io/event-navigator:latest

# Create App Service Plan
az appservice plan create --name $PLAN_NAME --resource-group $RG --is-linux --sku B1

# Create Web App
az webapp create --resource-group $RG --plan $PLAN_NAME --name $APP_NAME \
  --deployment-container-image-name $ACR_NAME.azurecr.io/event-navigator:latest

# Configure ACR credentials
ACR_USER=$(az acr credential show --name $ACR_NAME --query username -o tsv)
ACR_PASS=$(az acr credential show --name $ACR_NAME --query passwords[0].value -o tsv)

az webapp config container set --name $APP_NAME --resource-group $RG \
  --docker-custom-image-name $ACR_NAME.azurecr.io/event-navigator:latest \
  --docker-registry-server-url https://$ACR_NAME.azurecr.io \
  --docker-registry-server-user $ACR_USER \
  --docker-registry-server-password $ACR_PASS

# Set environment variables
az webapp config appsettings set --name $APP_NAME --resource-group $RG \
  --settings \
    PORT=8080 \
    SECRET_KEY="$(openssl rand -hex 32)" \
    KSAC_SECRET_KEY="hiiamfromksac" \
    FACULTY_SECRET_KEY="faculty-secret-2024" \
    SOCIETY_PRESIDENT_SECRET_KEY="society-secret-2024" \
    ADMIN_SECRET_KEY="admin-secret-2024" \
    WEBSITES_PORT=8080

echo "✅ Deployment complete!"
echo "🌐 Your app: https://$APP_NAME.azurewebsites.net"
```

Run with: `bash deploy-azure.sh`

---

## 📚 Additional Resources

- [Azure Web Apps Documentation](https://docs.microsoft.com/azure/app-service/)
- [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/)
- [Azure Database for PostgreSQL](https://docs.microsoft.com/azure/postgresql/)
- [Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/)

---

## ✅ Deployment Checklist

- [ ] Azure account created
- [ ] Azure CLI installed and logged in
- [ ] Docker image built successfully
- [ ] Resource group created
- [ ] Container Registry created
- [ ] Image pushed to ACR
- [ ] Web App created
- [ ] Environment variables configured
- [ ] Database solution chosen and configured
- [ ] CORS configured for Azure domains
- [ ] HTTPS enabled
- [ ] Monitoring/logging enabled
- [ ] Custom domain configured (optional)
- [ ] CI/CD pipeline set up (optional)

---

**Need Help?** Check logs with `az webapp log tail` or visit [Azure Support](https://azure.microsoft.com/support/).
