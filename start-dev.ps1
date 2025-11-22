# PowerShell script to start the dev server easily
# Usage: .\start-dev.ps1

Write-Host "🚀 Starting Startup School Development Server..." -ForegroundColor Cyan

# Kill any existing Next.js processes
Write-Host "Checking for running processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*node*"}
if ($nodeProcesses) {
    Write-Host "Stopping existing Node processes..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# Remove .next directory if it exists
if (Test-Path ".next") {
    Write-Host "Cleaning .next directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the dev server
Write-Host "Starting development server..." -ForegroundColor Green
npm run dev

