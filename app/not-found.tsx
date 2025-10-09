import Link from 'next/link';

/**
 * Custom 404 Not Found Page
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
            Perhaps you were looking for:
          </p>
          <div className="space-y-2">
            <Link
              href="/"
              className="block text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Home
            </Link>
            <Link
              href="/bible?testament=old"
              className="block text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Old Testament
            </Link>
            <Link
              href="/bible?testament=new"
              className="block text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              New Testament
            </Link>
            <Link
              href="/strongs"
              className="block text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Strong&apos;s Concordance
            </Link>
          </div>
        </div>

        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
