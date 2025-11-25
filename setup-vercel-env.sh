#!/bin/bash

# Vercel Environment Variables Setup Script
# This script helps you set up Firebase environment variables in Vercel

echo "🚀 FoundrVerse - Vercel Environment Variables Setup"
echo "=================================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed."
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installed!"
    echo ""
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
    echo ""
fi

echo "📋 Setting up Firebase environment variables..."
echo ""

# Get Firebase credentials from user
read -p "Enter NEXT_PUBLIC_FIREBASE_API_KEY: " FIREBASE_API_KEY
read -p "Enter NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: " FIREBASE_AUTH_DOMAIN
read -p "Enter NEXT_PUBLIC_FIREBASE_PROJECT_ID: " FIREBASE_PROJECT_ID
read -p "Enter NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: " FIREBASE_STORAGE_BUCKET
read -p "Enter NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: " FIREBASE_MESSAGING_SENDER_ID
read -p "Enter NEXT_PUBLIC_FIREBASE_APP_ID: " FIREBASE_APP_ID
read -p "Enter NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID (optional, press Enter to skip): " FIREBASE_MEASUREMENT_ID
read -p "Enter FIREBASE_SERVICE_ACCOUNT_KEY (paste entire JSON as single line): " FIREBASE_SERVICE_ACCOUNT_KEY
read -p "Enter RAZORPAY_KEY_ID: " RAZORPAY_KEY_ID
read -p "Enter RAZORPAY_KEY_SECRET: " RAZORPAY_KEY_SECRET
read -p "Enter RAZORPAY_WEBHOOK_SECRET (optional, press Enter to skip): " RAZORPAY_WEBHOOK_SECRET
read -p "Enter SESSION_COOKIE_SECRET (or press Enter to generate one): " SESSION_COOKIE_SECRET

# Generate SESSION_COOKIE_SECRET if not provided
if [ -z "$SESSION_COOKIE_SECRET" ]; then
    SESSION_COOKIE_SECRET=$(openssl rand -base64 32)
    echo "✅ Generated SESSION_COOKIE_SECRET: $SESSION_COOKIE_SECRET"
fi

echo ""
echo "🔧 Adding environment variables to Vercel..."
echo ""

# Add Firebase variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production <<< "$FIREBASE_API_KEY"
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY preview <<< "$FIREBASE_API_KEY"
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production <<< "$FIREBASE_AUTH_DOMAIN"
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN preview <<< "$FIREBASE_AUTH_DOMAIN"
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production <<< "$FIREBASE_PROJECT_ID"
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID preview <<< "$FIREBASE_PROJECT_ID"
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production <<< "$FIREBASE_STORAGE_BUCKET"
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET preview <<< "$FIREBASE_STORAGE_BUCKET"
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production <<< "$FIREBASE_MESSAGING_SENDER_ID"
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID preview <<< "$FIREBASE_MESSAGING_SENDER_ID"
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production <<< "$FIREBASE_APP_ID"
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID preview <<< "$FIREBASE_APP_ID"

if [ ! -z "$FIREBASE_MEASUREMENT_ID" ]; then
    vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID production <<< "$FIREBASE_MEASUREMENT_ID"
    vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID preview <<< "$FIREBASE_MEASUREMENT_ID"
fi

# Add service account
vercel env add FIREBASE_SERVICE_ACCOUNT_KEY production <<< "$FIREBASE_SERVICE_ACCOUNT_KEY"
vercel env add FIREBASE_SERVICE_ACCOUNT_KEY preview <<< "$FIREBASE_SERVICE_ACCOUNT_KEY"

# Add Razorpay variables
vercel env add RAZORPAY_KEY_ID production <<< "$RAZORPAY_KEY_ID"
vercel env add RAZORPAY_KEY_ID preview <<< "$RAZORPAY_KEY_ID"
vercel env add RAZORPAY_KEY_SECRET production <<< "$RAZORPAY_KEY_SECRET"
vercel env add RAZORPAY_KEY_SECRET preview <<< "$RAZORPAY_KEY_SECRET"

if [ ! -z "$RAZORPAY_WEBHOOK_SECRET" ]; then
    vercel env add RAZORPAY_WEBHOOK_SECRET production <<< "$RAZORPAY_WEBHOOK_SECRET"
    vercel env add RAZORPAY_WEBHOOK_SECRET preview <<< "$RAZORPAY_WEBHOOK_SECRET"
fi

# Add session secret
vercel env add SESSION_COOKIE_SECRET production <<< "$SESSION_COOKIE_SECRET"
vercel env add SESSION_COOKIE_SECRET preview <<< "$SESSION_COOKIE_SECRET"

echo ""
echo "✅ All environment variables have been added!"
echo ""
echo "🔄 Next steps:"
echo "1. Go to Vercel Dashboard and verify all variables are set"
echo "2. Redeploy your project"
echo "3. Test the deployment"
echo ""
echo "📖 For detailed instructions, see VERCEL_ENV_SETUP.md"

