# Automated Vercel Environment Variables Setup Script (PowerShell)
# This script automatically sets up all Firebase environment variables in Vercel

Write-Host "🚀 FoundrVerse - Automated Vercel Environment Variables Setup" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host ""

# Firebase Configuration Values (from your project)
$FIREBASE_CONFIG = @{
    API_KEY = "AIzaSyCYm9zNzLIAfNlgNdjQ_em89UUy_dMaXU4"
    AUTH_DOMAIN = "foundrverse-71575.firebaseapp.com"
    PROJECT_ID = "foundrverse-71575"
    STORAGE_BUCKET = "foundrverse-71575.firebasestorage.app"
    MESSAGING_SENDER_ID = "413817556532"
    APP_ID = "1:413817556532:web:bcb4edbfe1fde947f30461"
    MEASUREMENT_ID = "G-YRLHCZT889"
}

# Service Account Key (from service-account.json)
# IMPORTANT: Replace this with your actual service account key from Firebase Console
# Get it from: Firebase Console → Project Settings → Service Accounts → Generate new private key
# Copy the entire JSON and paste it here as a single-line string
$SERVICE_ACCOUNT_KEY = 'YOUR_SERVICE_ACCOUNT_JSON_HERE'

# Generate SESSION_COOKIE_SECRET if not set
$rng = New-Object System.Security.Cryptography.RNGCryptoServiceProvider
$bytes = New-Object byte[] 32
$rng.GetBytes($bytes)
$SESSION_COOKIE_SECRET = [Convert]::ToBase64String($bytes)

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI..." -ForegroundColor Yellow
try {
    $null = Get-Command vercel -ErrorAction Stop
    Write-Host "✅ Vercel CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI is not installed." -ForegroundColor Red
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Vercel CLI. Please install manually: npm install -g vercel" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Vercel CLI installed!" -ForegroundColor Green
    Write-Host ""
}

# Check if user is logged in
Write-Host "Checking Vercel authentication..." -ForegroundColor Yellow
try {
    $whoami = vercel whoami 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Logged in to Vercel as: $whoami" -ForegroundColor Green
    } else {
        throw "Not logged in"
    }
} catch {
    Write-Host "🔐 Please log in to Vercel..." -ForegroundColor Yellow
    vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to log in to Vercel" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

Write-Host ""
Write-Host "🔧 Adding Firebase environment variables to Vercel..." -ForegroundColor Cyan
Write-Host ""

# Function to add environment variable
function Add-VercelEnv {
    param(
        [string]$Name,
        [string]$Value,
        [string[]]$Environments = @("production", "preview", "development")
    )
    
    Write-Host "Adding $Name..." -ForegroundColor Yellow
    foreach ($env in $Environments) {
        try {
            echo $Value | vercel env add $Name $env --yes 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✅ Added to $env" -ForegroundColor Green
            } else {
                Write-Host "  ⚠️  Failed to add to $env (may already exist)" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "  ⚠️  Error adding to $env : $_" -ForegroundColor Yellow
        }
    }
}

# Add Firebase variables
Add-VercelEnv "NEXT_PUBLIC_FIREBASE_API_KEY" $FIREBASE_CONFIG.API_KEY
Add-VercelEnv "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" $FIREBASE_CONFIG.AUTH_DOMAIN
Add-VercelEnv "NEXT_PUBLIC_FIREBASE_PROJECT_ID" $FIREBASE_CONFIG.PROJECT_ID
Add-VercelEnv "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" $FIREBASE_CONFIG.STORAGE_BUCKET
Add-VercelEnv "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" $FIREBASE_CONFIG.MESSAGING_SENDER_ID
Add-VercelEnv "NEXT_PUBLIC_FIREBASE_APP_ID" $FIREBASE_CONFIG.APP_ID
Add-VercelEnv "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID" $FIREBASE_CONFIG.MEASUREMENT_ID

# Add service account
Write-Host "Adding FIREBASE_SERVICE_ACCOUNT_KEY..." -ForegroundColor Yellow
Add-VercelEnv "FIREBASE_SERVICE_ACCOUNT_KEY" $SERVICE_ACCOUNT_KEY

# Add session secret
Write-Host "Adding SESSION_COOKIE_SECRET..." -ForegroundColor Yellow
Add-VercelEnv "SESSION_COOKIE_SECRET" $SESSION_COOKIE_SECRET
Write-Host "  Generated SESSION_COOKIE_SECRET: $SESSION_COOKIE_SECRET" -ForegroundColor Cyan

# Check for Razorpay variables (optional)
Write-Host ""
Write-Host "💳 Razorpay Configuration (Optional)" -ForegroundColor Cyan
$setupRazorpay = Read-Host "Do you want to set up Razorpay variables? (y/n)"
if ($setupRazorpay -eq "y" -or $setupRazorpay -eq "Y") {
    $RAZORPAY_KEY_ID = Read-Host "Enter RAZORPAY_KEY_ID"
    $RAZORPAY_KEY_SECRET = Read-Host "Enter RAZORPAY_KEY_SECRET"
    $RAZORPAY_WEBHOOK_SECRET = Read-Host "Enter RAZORPAY_WEBHOOK_SECRET (optional, press Enter to skip)"
    
    if ($RAZORPAY_KEY_ID) {
        Add-VercelEnv "RAZORPAY_KEY_ID" $RAZORPAY_KEY_ID
    }
    if ($RAZORPAY_KEY_SECRET) {
        Add-VercelEnv "RAZORPAY_KEY_SECRET" $RAZORPAY_KEY_SECRET
    }
    if ($RAZORPAY_WEBHOOK_SECRET) {
        Add-VercelEnv "RAZORPAY_WEBHOOK_SECRET" $RAZORPAY_WEBHOOK_SECRET
    }
}

Write-Host ""
Write-Host "✅ Environment variables setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🔄 Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Select your FoundrVerse project" -ForegroundColor White
Write-Host "3. Go to Settings → Environment Variables to verify all variables are set" -ForegroundColor White
Write-Host "4. Go to Deployments tab and redeploy your project" -ForegroundColor White
Write-Host "5. Test your deployment - Firebase errors should be gone! 🎉" -ForegroundColor White
Write-Host ""
Write-Host "📖 For detailed instructions, see VERCEL_ENV_SETUP.md" -ForegroundColor Yellow
Write-Host ""

