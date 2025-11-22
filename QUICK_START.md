# 🚀 Quick Start Guide

## Easy Setup (Windows PowerShell)

### Option 1: Use the Helper Script
```powershell
.\start-dev.ps1
```

### Option 2: Manual Steps

1. **Kill any running processes:**
   ```powershell
   Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
   ```

2. **Clean build cache:**
   ```powershell
   Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
   ```

3. **Install dependencies (if needed):**
   ```powershell
   npm install
   ```

4. **Start the dev server:**
   ```powershell
   npm run dev
   ```

5. **Open your browser:**
   Go to http://localhost:3000

## Troubleshooting

### "Unable to acquire lock" Error
This means another Next.js process is running. Fix it:
```powershell
# Kill all Node processes
Get-Process node | Stop-Process -Force

# Remove lock file
Remove-Item -Recurse -Force .next

# Restart
npm run dev
```

### Port 3000 Already in Use
Use a different port:
```powershell
npm run dev -- -p 3001
```

### Multiple Lockfile Warning
This is just a warning and won't prevent the app from running. You can ignore it, or:
- Remove any `package-lock.json` files outside the project directory
- The app will work fine with the warning

## What's Fixed

✅ Fixed CSS border issue in globals.css
✅ Removed duplicate next.config.mjs
✅ Added helper scripts for easy startup
✅ Cleaned up configuration

## Ready to Go!

Just run:
```powershell
npm run dev
```

Then open http://localhost:3000 in your browser! 🎉

