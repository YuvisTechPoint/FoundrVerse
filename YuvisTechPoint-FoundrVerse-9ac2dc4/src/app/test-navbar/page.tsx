export default function TestNavbarPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Navbar Test Page</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          If you can see the Navbar at the top and this message, the global layout is working.
        </p>
        {/* TODO: Remove this debug page once navbar behavior is fully verified. */}
      </div>
    </div>
  );
}
