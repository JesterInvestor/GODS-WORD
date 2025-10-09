import Link from 'next/link';

/**
 * Custom 404 Not Found Page
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="bg-accent border border-border rounded-lg p-6">
          <p className="text-sm text-accent-foreground mb-4">
            Perhaps you were looking for:
          </p>
          <div className="space-y-2">
            <Link
              href="/"
              className="block text-primary hover:underline font-semibold"
            >
              Home
            </Link>
            <Link
              href="/bible?testament=old"
              className="block text-primary hover:underline font-semibold"
            >
              Old Testament
            </Link>
            <Link
              href="/bible?testament=new"
              className="block text-primary hover:underline font-semibold"
            >
              New Testament
            </Link>
            <Link
              href="/strongs"
              className="block text-primary hover:underline font-semibold"
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
