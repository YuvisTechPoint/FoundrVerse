# Automated Vercel Environment Variables Setup
# Run this script to automatically configure all Firebase environment variables

Write-Host "FoundrVerse - Automated Vercel Setup" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check Vercel CLI
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Check login
Write-Host "Checking Vercel login..." -ForegroundColor Yellow
$loginCheck = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please log in to Vercel..." -ForegroundColor Yellow
    vercel login
}

Write-Host ""
Write-Host "Adding environment variables..." -ForegroundColor Cyan
Write-Host ""

# Firebase Config
$envVars = @{
    "NEXT_PUBLIC_FIREBASE_API_KEY" = "AIzaSyCYm9zNzLIAfNlgNdjQ_em89UUy_dMaXU4"
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" = "foundrverse-71575.firebaseapp.com"
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID" = "foundrverse-71575"
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" = "foundrverse-71575.firebasestorage.app"
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" = "413817556532"
    "NEXT_PUBLIC_FIREBASE_APP_ID" = "1:413817556532:web:bcb4edbfe1fde947f30461"
    "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID" = "G-YRLHCZT889"
    # IMPORTANT: Replace this with your actual service account key from Firebase Console
    # Get it from: Firebase Console → Project Settings → Service Accounts → Generate new private key
    # Copy the entire JSON and paste it here as a single-line string
    "FIREBASE_SERVICE_ACCOUNT_KEY" = 'YOUR_SERVICE_ACCOUNT_JSON_HERE'
}

# Generate session secret
$rng = New-Object System.Security.Cryptography.RNGCryptoServiceProvider
$bytes = New-Object byte[] 32
$rng.GetBytes($bytes)
$sessionSecret = [Convert]::ToBase64String($bytes)
$envVars["SESSION_COOKIE_SECRET"] = $sessionSecret

# Add each variable
foreach ($varName in $envVars.Keys) {
    Write-Host "Setting $varName..." -ForegroundColor Yellow
    $value = $envVars[$varName]
    
    # For each environment
    foreach ($env in @("production", "preview", "development")) {
        try {
            echo $value | vercel env add $varName $env --yes 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  [OK] $env" -ForegroundColor Green
            } else {
                Write-Host "  [SKIP] $env (may already exist)" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "  [ERROR] $env" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Select your project -> Deployments" -ForegroundColor White
Write-Host "3. Click three dots -> Redeploy" -ForegroundColor White
Write-Host "4. Wait for deployment to complete" -ForegroundColor White
Write-Host "5. Test your site - Firebase errors should be gone!" -ForegroundColor White
Write-Host ""
