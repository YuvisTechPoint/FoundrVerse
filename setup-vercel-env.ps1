# Vercel Environment Variables Setup Script (PowerShell)
# This script helps you set up Firebase environment variables in Vercel

Write-Host "🚀 FoundrVerse - Vercel Environment Variables Setup" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
try {
    $null = Get-Command vercel -ErrorAction Stop
    Write-Host "✅ Vercel CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI is not installed." -ForegroundColor Red
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed!" -ForegroundColor Green
    Write-Host ""
}

# Check if user is logged in
try {
    $null = vercel whoami 2>&1
    Write-Host "✅ Logged in to Vercel" -ForegroundColor Green
} catch {
    Write-Host "🔐 Please log in to Vercel..." -ForegroundColor Yellow
    vercel login
    Write-Host ""
}

Write-Host "📋 Setting up Firebase environment variables..." -ForegroundColor Cyan
Write-Host ""

# Get Firebase credentials from user
$FIREBASE_API_KEY = Read-Host "Enter NEXT_PUBLIC_FIREBASE_API_KEY"
$FIREBASE_AUTH_DOMAIN = Read-Host "Enter NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
$FIREBASE_PROJECT_ID = Read-Host "Enter NEXT_PUBLIC_FIREBASE_PROJECT_ID"
$FIREBASE_STORAGE_BUCKET = Read-Host "Enter NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
$FIREBASE_MESSAGING_SENDER_ID = Read-Host "Enter NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
$FIREBASE_APP_ID = Read-Host "Enter NEXT_PUBLIC_FIREBASE_APP_ID"
$FIREBASE_MEASUREMENT_ID = Read-Host "Enter NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID (optional, press Enter to skip)"
$FIREBASE_SERVICE_ACCOUNT_KEY = Read-Host "Enter FIREBASE_SERVICE_ACCOUNT_KEY (paste entire JSON as single line)"
$RAZORPAY_KEY_ID = Read-Host "Enter RAZORPAY_KEY_ID"
$RAZORPAY_KEY_SECRET = Read-Host "Enter RAZORPAY_KEY_SECRET"
$RAZORPAY_WEBHOOK_SECRET = Read-Host "Enter RAZORPAY_WEBHOOK_SECRET (optional, press Enter to skip)"
$SESSION_COOKIE_SECRET = Read-Host "Enter SESSION_COOKIE_SECRET (or press Enter to generate one)"

# Generate SESSION_COOKIE_SECRET if not provided
if ([string]::IsNullOrWhiteSpace($SESSION_COOKIE_SECRET)) {
    # Generate a random 32-character string
    $bytes = New-Object byte[] 32
    [System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
    $SESSION_COOKIE_SECRET = [Convert]::ToBase64String($bytes)
    Write-Host "✅ Generated SESSION_COOKIE_SECRET: $SESSION_COOKIE_SECRET" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔧 Adding environment variables to Vercel..." -ForegroundColor Cyan
Write-Host ""

# Function to add environment variable
function Add-VercelEnv {
    param(
        [string]$Name,
        [string]$Value,
        [string[]]$Environments = @("production", "preview")
    )
    
    foreach ($env in $Environments) {
        Write-Host "Adding $Name to $env..." -ForegroundColor Yellow
        echo $Value | vercel env add $Name $env
    }
}

# Add Firebase variables
Add-VercelEnv "NEXT_PUBLIC_FIREBASE_API_KEY" $FIREBASE_API_KEY
Add-VercelEnv "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" $FIREBASE_AUTH_DOMAIN
Add-VercelEnv "NEXT_PUBLIC_FIREBASE_PROJECT_ID" $FIREBASE_PROJECT_ID
Add-VercelEnv "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" $FIREBASE_STORAGE_BUCKET
Add-VercelEnv "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" $FIREBASE_MESSAGING_SENDER_ID
Add-VercelEnv "NEXT_PUBLIC_FIREBASE_APP_ID" $FIREBASE_APP_ID

if (![string]::IsNullOrWhiteSpace($FIREBASE_MEASUREMENT_ID)) {
    Add-VercelEnv "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID" $FIREBASE_MEASUREMENT_ID
}

# Add service account
Add-VercelEnv "FIREBASE_SERVICE_ACCOUNT_KEY" $FIREBASE_SERVICE_ACCOUNT_KEY

# Add Razorpay variables
Add-VercelEnv "RAZORPAY_KEY_ID" $RAZORPAY_KEY_ID
Add-VercelEnv "RAZORPAY_KEY_SECRET" $RAZORPAY_KEY_SECRET

if (![string]::IsNullOrWhiteSpace($RAZORPAY_WEBHOOK_SECRET)) {
    Add-VercelEnv "RAZORPAY_WEBHOOK_SECRET" $RAZORPAY_WEBHOOK_SECRET
}

# Add session secret
Add-VercelEnv "SESSION_COOKIE_SECRET" $SESSION_COOKIE_SECRET

Write-Host ""
Write-Host "✅ All environment variables have been added!" -ForegroundColor Green
Write-Host ""
Write-Host "🔄 Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to Vercel Dashboard and verify all variables are set"
Write-Host "2. Redeploy your project"
Write-Host "3. Test the deployment"
Write-Host ""
Write-Host "📖 For detailed instructions, see VERCEL_ENV_SETUP.md" -ForegroundColor Yellow

