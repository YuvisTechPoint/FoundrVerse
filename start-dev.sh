#!/bin/bash
# Bash script to start the dev server easily
# Usage: ./start-dev.sh

echo "🚀 Starting Startup School Development Server..."

# Kill any existing Next.js processes
echo "Checking for running processes..."
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Remove .next directory if it exists
if [ -d ".next" ]; then
    echo "Cleaning .next directory..."
    rm -rf .next
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the dev server
echo "Starting development server..."
npm run dev

