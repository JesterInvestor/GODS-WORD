/**
 * Root Loading UI
 * Shows while pages are loading
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
        <p className="text-xl text-gray-600 dark:text-gray-400 font-semibold">Loading...</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">Preparing the Word of God</p>
      </div>
    </div>
  );
}
