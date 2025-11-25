"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink, CheckCircle, AlertCircle, Settings, Key } from "lucide-react";

export default function SetupHelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/20 to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-28 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-4">
              <AlertCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Firebase Configuration Required
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your deployment needs Firebase environment variables configured in Vercel
            </p>
            <div className="mt-4">
              <a
                href="https://github.com/YuvisTechPoint/FoundrVerse/blob/main/VERCEL_FIREBASE_SETUP_STEPS.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
              >
                📋 View Step-by-Step Checklist <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quick Fix (5 minutes)
              </h2>
              <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">1</span>
                  <div>
                    <p className="font-medium">Go to Vercel Dashboard</p>
                    <a 
                      href="https://vercel.com/dashboard" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      Open Vercel Dashboard <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">2</span>
                  <div>
                    <p className="font-medium">Select your FoundrVerse project</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Click on your project from the dashboard</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">3</span>
                  <div>
                    <p className="font-medium">Go to Settings → Environment Variables</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Click Settings tab, then Environment Variables in sidebar</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">4</span>
                  <div>
                    <p className="font-medium">Add Firebase variables</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">See the list below for all required variables</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">5</span>
                  <div>
                    <p className="font-medium">Redeploy your project</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Go to Deployments → Click ⋯ → Redeploy</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Key className="w-5 h-5" />
                Required Environment Variables
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <code className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">NEXT_PUBLIC_FIREBASE_API_KEY</code>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <code className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</code>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <code className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">NEXT_PUBLIC_FIREBASE_PROJECT_ID</code>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <code className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</code>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <code className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</code>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <code className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">NEXT_PUBLIC_FIREBASE_APP_ID</code>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <code className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">FIREBASE_SERVICE_ACCOUNT_KEY</code>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                💡 <strong>Tip:</strong> Get these values from{" "}
                <a 
                  href="https://console.firebase.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  Firebase Console <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-200 mb-3">
                📖 Detailed Instructions
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                For complete step-by-step instructions with screenshots and troubleshooting:
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/YuvisTechPoint/FoundrVerse/blob/main/QUICK_VERCEL_SETUP.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                  Quick Setup Guide <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/YuvisTechPoint/FoundrVerse/blob/main/VERCEL_ENV_SETUP.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                >
                  Full Setup Guide <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ← Back to Home
              </Link>
              <a
                href="https://vercel.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Open Vercel Dashboard <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

