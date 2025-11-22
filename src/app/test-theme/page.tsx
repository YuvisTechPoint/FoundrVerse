"use client";

import { useEffect, useState } from "react";
import { getTheme, setTheme, getInitialTheme } from "@/lib/useTheme";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function TestThemePage() {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");
  const [storedTheme, setStoredTheme] = useState<string | null>(null);

  useEffect(() => {
    setCurrentTheme(getTheme());
    setStoredTheme(localStorage.getItem("theme"));

    const handleThemeChange = () => {
      setCurrentTheme(getTheme());
      setStoredTheme(localStorage.getItem("theme"));
    };

    window.addEventListener("theme-change", handleThemeChange);
    return () => window.removeEventListener("theme-change", handleThemeChange);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8 transition-colors duration-300">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Theme Test Page
        </h1>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Theme (DOM):</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentTheme}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Stored in localStorage:</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {storedTheme || "null (using default)"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Initial Theme (from hook):</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {getInitialTheme()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">HTML Element Classes:</p>
            <code className="block bg-gray-100 dark:bg-gray-900 p-2 rounded text-sm text-gray-900 dark:text-gray-100">
              {typeof document !== "undefined"
                ? document.documentElement.className
                : "N/A (SSR)"}
            </code>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <ThemeToggle />
            <button
              onClick={() => {
                const newTheme = currentTheme === "dark" ? "light" : "dark";
                setTheme(newTheme);
                setCurrentTheme(newTheme);
                setStoredTheme(newTheme);
              }}
              className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Toggle via Utility
            </button>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            ✓ If theme persists after refresh, localStorage is working
            <br />
            ✓ If no flash on page load, SSR script is working
            <br />
            ✓ If all pages respect theme, global system is working
          </p>
        </div>
      </div>
    </div>
  );
}

