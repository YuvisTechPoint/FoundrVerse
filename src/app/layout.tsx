import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ConditionalLayout from "@/components/ConditionalLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// This script runs before React hydration to prevent flash of incorrect theme
const themeScript = `
  (function() {
    function getInitialTheme() {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') return stored;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
      return 'light';
    }
    const theme = getInitialTheme();
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.style.colorScheme = theme;
  })();
`;

export const metadata: Metadata = {
  title: "Mewayz - FoundrVerse | India's First Practical Startup School for Students",
  description: "Learn how real founders build. Do it yourself. Get certified. Get internships. Pitch to investors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} light`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-all duration-500 flex flex-col">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <Toaster />
      </body>
    </html>
  );
}
