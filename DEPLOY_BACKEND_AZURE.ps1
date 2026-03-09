param(
    [string]$ResourceGroup = "event-navigator-rg",
    [string]$Location = "eastus",
    [string]$AcrName = "eventnavigatoracr",
    [string]$ContainerEnvName = "event-navigator-env",
    [string]$BackendAppName = "event-navigator-backend",
    [string]$ImageTag = "latest",
    [string]$FrontendUrl = "",
    [string]$SecretKey = "",
    [string]$KsacSecretKey = "hiiamfromksac",
    [string]$FacultySecretKey = "faculty-secret-2024",
    [string]$SocietyPresidentSecretKey = "society-secret-2024",
    [string]$AdminSecretKey = "admin-secret-2024"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    throw "Azure CLI (az) is not installed or not in PATH."
}
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw "Docker is not installed or not in PATH."
}

if ([string]::IsNullOrWhiteSpace($SecretKey)) {
    $chars = (48..57) + (65..90) + (97..122)
    $SecretKey = -join (1..64 | ForEach-Object { [char]($chars | Get-Random) })
}

Write-Host "==> Ensuring Azure resource group exists..." -ForegroundColor Cyan
az group create --name $ResourceGroup --location $Location | Out-Null

Write-Host "==> Ensuring Azure Container Registry exists..." -ForegroundColor Cyan
$acrCheck = az acr show --resource-group $ResourceGroup --name $AcrName --query name -o tsv 2>$null
if (-not $acrCheck) {
    az acr create --resource-group $ResourceGroup --name $AcrName --sku Basic | Out-Null
}

Write-Host "==> Logging in to ACR..." -ForegroundColor Cyan
az acr login --name $AcrName | Out-Null

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $scriptDir "backend"
$imageName = "$AcrName.azurecr.io/event-navigator-backend:$ImageTag"

Write-Host "==> Building backend image: $imageName" -ForegroundColor Cyan
Push-Location $backendDir
try {
    docker build -f Dockerfile.azure -t $imageName .
    Write-Host "==> Pushing backend image to ACR..." -ForegroundColor Cyan
    docker push $imageName
}
finally {
    Pop-Location
}

Write-Host "==> Ensuring Container Apps environment exists..." -ForegroundColor Cyan
az containerapp env show --name $ContainerEnvName --resource-group $ResourceGroup --query name -o tsv *> $null
if ($LASTEXITCODE -ne 0) {
    az containerapp env create --name $ContainerEnvName --resource-group $ResourceGroup --location $Location | Out-Null
}

$acrUser = az acr credential show --name $AcrName --query username -o tsv
$acrPass = az acr credential show --name $AcrName --query passwords[0].value -o tsv

$frontendSetting = if ([string]::IsNullOrWhiteSpace($FrontendUrl)) { "" } else { $FrontendUrl }

Write-Host "==> Creating/updating backend container app..." -ForegroundColor Cyan
az containerapp show --name $BackendAppName --resource-group $ResourceGroup --query name -o tsv *> $null

if ($LASTEXITCODE -ne 0) {
    az containerapp create `
      --name $BackendAppName `
      --resource-group $ResourceGroup `
      --environment $ContainerEnvName `
      --image $imageName `
      --target-port 8080 `
      --ingress external `
      --registry-server "$AcrName.azurecr.io" `
      --registry-username $acrUser `
      --registry-password $acrPass `
      --env-vars `
        PORT=8080 `
        SECRET_KEY=$SecretKey `
        KSAC_SECRET_KEY=$KsacSecretKey `
        FACULTY_SECRET_KEY=$FacultySecretKey `
        SOCIETY_PRESIDENT_SECRET_KEY=$SocietyPresidentSecretKey `
        ADMIN_SECRET_KEY=$AdminSecretKey `
        FRONTEND_URL=$frontendSetting | Out-Null
}
else {
    az containerapp update `
      --name $BackendAppName `
      --resource-group $ResourceGroup `
      --image $imageName `
      --set-env-vars `
        PORT=8080 `
        SECRET_KEY=$SecretKey `
        KSAC_SECRET_KEY=$KsacSecretKey `
        FACULTY_SECRET_KEY=$FacultySecretKey `
        SOCIETY_PRESIDENT_SECRET_KEY=$SocietyPresidentSecretKey `
        ADMIN_SECRET_KEY=$AdminSecretKey `
        FRONTEND_URL=$frontendSetting | Out-Null
}

$fqdn = az containerapp show --name $BackendAppName --resource-group $ResourceGroup --query properties.configuration.ingress.fqdn -o tsv
$backendUrl = "https://$fqdn"

Write-Host "" 
Write-Host "Backend deployed successfully." -ForegroundColor Green
Write-Host "Backend base URL: $backendUrl" -ForegroundColor Green
Write-Host "Health check: $backendUrl/health" -ForegroundColor Green
Write-Host "API base URL for frontend: $backendUrl/api" -ForegroundColor Yellow
Write-Host ""
Write-Host "Set this in frontend env: VITE_API_URL=$backendUrl/api" -ForegroundColor Yellow
