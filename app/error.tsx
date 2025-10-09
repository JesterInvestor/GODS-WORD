'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Root Error Boundary
 * Handles errors that occur in the app
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-red-600 dark:text-red-400">Error</h1>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We apologize for the inconvenience. An error occurred while loading this page.
          </p>
        </div>

        {error.message && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-200 font-mono">{error.message}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 inline-block"
          >
            Go Home
          </Link>
        </div>

        {error.digest && (
          <p className="text-xs text-gray-500 dark:text-gray-600">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
