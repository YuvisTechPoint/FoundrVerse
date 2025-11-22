import Link from "next/link";
import Image from "next/image";

interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-12 transition-colors duration-300 ${className}`}>
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/images/mewayz.jpeg"
                  alt="Mewayz FoundrVerse Logo"
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-charcoal dark:text-white transition-colors duration-300">Mewayz</span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">FoundrVerse</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
              India's First Practical Startup School for Students.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-charcoal dark:text-white mb-4 transition-colors duration-300">Quick Links</h4>
            <div className="space-y-2">
              <Link href="#what" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-charcoal dark:hover:text-white transition-colors">What You Get</Link>
              <Link href="#course" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-charcoal dark:hover:text-white transition-colors">Course</Link>
              <Link href="#pricing" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-charcoal dark:hover:text-white transition-colors">Pricing</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-charcoal dark:text-white mb-4 transition-colors duration-300">Account</h4>
            <div className="space-y-2">
              <Link href="/login" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-charcoal dark:hover:text-white transition-colors">Student Login</Link>
              <Link href="/admin/login" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-charcoal dark:hover:text-white transition-colors">Admin Login</Link>
              <Link href="/signup" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-charcoal dark:hover:text-white transition-colors">Sign Up</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">© {new Date().getFullYear()} Mewayz - FoundrVerse. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#pricing" className="hover:text-charcoal dark:hover:text-white transition-colors">Pricing</a>
            <a href="#what" className="hover:text-charcoal dark:hover:text-white transition-colors">What you get</a>
            <a href="#blindspot" className="hover:text-charcoal dark:hover:text-white transition-colors">About</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
