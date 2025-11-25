"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  RefreshCw, 
  AlertTriangle,
  Copy,
  Check,
  ArrowRight,
  Settings,
  Key,
  Shield
} from "lucide-react";

type ConfigStatus = {
  name: string;
  configured: boolean;
  hint: string;
};

type ConfigResponse = {
  status: string;
  clientReady: boolean;
  serverReady: boolean;
  required: {
    client: ConfigStatus[];
    server: ConfigStatus[];
  };
  optional: ConfigStatus[];
  summary: {
    total: number;
    configured: number;
    missing: number;
  };
  instructions: {
    vercelDashboard: string;
    firebaseConsole: string;
    projectSettings: string;
    serviceAccounts: string;
  };
};

export default function SetupHelpPage() {
  const [config, setConfig] = useState<ConfigResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);

  const checkConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/check-config");
      if (!response.ok) throw new Error("Failed to check configuration");
      const data = await response.json();
      setConfig(data);
      
      // Auto-advance to appropriate step based on config status
      if (data.clientReady && data.serverReady) {
        setActiveStep(4);
      } else if (data.summary.configured > 0) {
        setActiveStep(3);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConfig();
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const StatusIcon = ({ configured }: { configured: boolean }) => (
    configured ? (
      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
    )
  );

  const envVarExamples: Record<string, string> = {
    "NEXT_PUBLIC_FIREBASE_API_KEY": "AIzaSyCYm9zNzLIAfNlgNdjQ_em89UUy_dMaXU4",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "foundrverse-71575.firebaseapp.com",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "foundrverse-71575",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET": "foundrverse-71575.firebasestorage.app",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "413817556532",
    "NEXT_PUBLIC_FIREBASE_APP_ID": "1:413817556532:web:bcb4edbfe1fde947f30461",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 shadow-xl mb-6">
            <Settings className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Firebase Setup Required
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your deployment needs Firebase environment variables configured in Vercel. 
            Follow the steps below to fix this.
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-indigo-500" />
              Configuration Status
            </h2>
            <button
              onClick={checkConfig}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? "Checking..." : "Refresh Status"}
            </button>
          </div>

          {error ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : config ? (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="relative">
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      config.status === 'configured' 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                        : 'bg-gradient-to-r from-orange-400 to-amber-500'
                    }`}
                    style={{ width: `${(config.summary.configured / config.summary.total) * 100}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                  {config.summary.configured} of {config.summary.total} required variables configured
                </p>
              </div>

              {/* Status Summary */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${config.clientReady ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                  <div className="flex items-center gap-3">
                    {config.clientReady ? <CheckCircle className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Client-side Config</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {config.clientReady ? "Ready for Google Sign-In" : "Required for authentication"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-xl border ${config.serverReady ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                  <div className="flex items-center gap-3">
                    {config.serverReady ? <CheckCircle className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Server-side Config</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {config.serverReady ? "Ready for session management" : "Required for sessions"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Missing Variables */}
              {config.summary.missing > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Missing Variables ({config.summary.missing})
                  </h3>
                  <div className="space-y-2">
                    {[...config.required.client, ...config.required.server]
                      .filter(v => !v.configured)
                      .map((v) => (
                        <div key={v.name} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900/50 rounded-lg">
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <code className="text-sm font-mono text-red-700 dark:text-red-300 break-all">{v.name}</code>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{v.hint}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Configured Variables */}
              {config.summary.configured > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Configured Variables ({config.summary.configured})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[...config.required.client, ...config.required.server]
                      .filter(v => v.configured)
                      .map((v) => (
                        <span key={v.name} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-900/50 rounded-lg text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <code className="font-mono text-green-700 dark:text-green-300">{v.name.replace("NEXT_PUBLIC_", "")}</code>
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Step by Step Guide */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Key className="w-6 h-6 text-amber-500" />
              Step-by-Step Setup Guide
            </h2>
          </div>

          {/* Steps Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
            {[1, 2, 3, 4].map((step) => (
              <button
                key={step}
                onClick={() => setActiveStep(step)}
                className={`flex-1 min-w-[120px] px-4 py-3 text-sm font-medium transition-colors ${
                  activeStep === step
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-b-2 border-indigo-600'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                Step {step}
              </button>
            ))}
          </div>

          {/* Step Content */}
          <div className="p-6">
            {activeStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Step 1: Get Firebase Config Values
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Open your Firebase project settings to get the configuration values.
                  </p>
                </div>

                <a
                  href="https://console.firebase.google.com/project/foundrverse-71575/settings/general"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.89 15.673L6.255.461A.542.542 0 017.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 00-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 001.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 00-.96 0L3.53 19.365z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Open Firebase Project Settings</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">console.firebase.google.com</p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                </a>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">📋 Instructions:</h4>
                  <ol className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      <span>Click the link above to open Firebase Console</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      <span>Scroll down to &quot;Your apps&quot; section</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      <span>Click on your web app (or create one if none exists)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                      <span>Copy the <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">firebaseConfig</code> object values</span>
                    </li>
                  </ol>
                </div>

                <button
                  onClick={() => setActiveStep(2)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
                >
                  Continue to Step 2
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Step 2: Get Service Account Key
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Generate a private key for server-side authentication.
                  </p>
                </div>

                <a
                  href="https://console.firebase.google.com/project/foundrverse-71575/settings/serviceaccounts/adminsdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center">
                      <Key className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Open Service Accounts</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Generate private key</p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform" />
                </a>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">📋 Instructions:</h4>
                  <ol className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      <span>Click &quot;Generate new private key&quot; button</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      <span>Confirm by clicking &quot;Generate key&quot;</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      <span>A JSON file will download automatically</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                      <span>Open the file and copy the <strong>entire content</strong></span>
                    </li>
                  </ol>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                  <p className="text-amber-800 dark:text-amber-200 text-sm">
                    <strong>⚠️ Important:</strong> Keep this file secure! Never commit it to git or share it publicly.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveStep(1)}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setActiveStep(3)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    Continue to Step 3
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Step 3: Add Variables to Vercel
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Add each environment variable in your Vercel project settings.
                  </p>
                </div>

                <a
                  href="https://vercel.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gray-900 dark:bg-white/10 border border-gray-700 dark:border-gray-600 rounded-xl hover:bg-gray-800 dark:hover:bg-white/20 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="black">
                        <path d="M12 2L2 19.5h20L12 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Open Vercel Dashboard</p>
                      <p className="text-sm text-gray-400">vercel.com/dashboard</p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </a>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">📋 In Vercel Dashboard:</h4>
                  <ol className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      <span>Select your <strong>FoundrVerse</strong> project</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      <span>Click <strong>Settings</strong> in the top navigation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      <span>Click <strong>Environment Variables</strong> in the sidebar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                      <span>Add each variable below (click &quot;Add New&quot; for each)</span>
                    </li>
                  </ol>
                </div>

                {/* Variables to Add */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Variables to Add:</h4>
                  
                  {Object.entries(envVarExamples).map(([name, example]) => (
                    <div key={name} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <code className="text-sm font-mono text-indigo-600 dark:text-indigo-400 break-all">{name}</code>
                      </div>
                      <button
                        onClick={() => copyToClipboard(name, name)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Copy variable name"
                      >
                        {copied === name ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <code className="text-sm font-mono text-purple-600 dark:text-purple-400">FIREBASE_SERVICE_ACCOUNT_KEY</code>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Paste the entire JSON file content</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard("FIREBASE_SERVICE_ACCOUNT_KEY", "service_key")}
                      className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
                      title="Copy variable name"
                    >
                      {copied === "service_key" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    <strong>💡 Tip:</strong> Make sure to check <strong>Production</strong> and <strong>Preview</strong> checkboxes for each variable!
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveStep(2)}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setActiveStep(4)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    Continue to Step 4
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Step 4: Redeploy Your Project
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    After adding all variables, you must redeploy for them to take effect.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Final Steps
                  </h4>
                  <ol className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      <span>Go to the <strong>Deployments</strong> tab in Vercel</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      <span>Click the <strong>⋯</strong> menu on the latest deployment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      <span>Select <strong>Redeploy</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                      <span>Wait 2-5 minutes for deployment to complete</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full flex items-center justify-center text-sm font-bold">5</span>
                      <span>Click &quot;Refresh Status&quot; above to verify configuration</span>
                    </li>
                  </ol>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={checkConfig}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Verify Configuration
                  </button>
                  <Link
                    href="/login"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    Try Logging In
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>

                {config?.status === 'configured' && (
                  <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-xl p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h4 className="text-lg font-bold text-green-800 dark:text-green-200 mb-2">
                      🎉 All Configured!
                    </h4>
                    <p className="text-green-700 dark:text-green-300 mb-4">
                      Your Firebase configuration is complete. You can now use Google Sign-In!
                    </p>
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors"
                    >
                      Go to Login Page
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Back to Login */}
        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
