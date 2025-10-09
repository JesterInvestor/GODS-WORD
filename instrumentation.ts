/**
 * Next.js Instrumentation Hook
 * Used for performance monitoring and observability
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side instrumentation
    console.info('[Instrumentation] Server runtime initialized');

    // You can add APM tools here like:
    // - New Relic
    // - Datadog
    // - Sentry
    // - OpenTelemetry
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime instrumentation
    console.info('[Instrumentation] Edge runtime initialized');
  }
}

export async function onRequestError(
  err: Error,
  request: {
    path: string;
    method: string;
    headers: Headers;
  }
) {
  // Log errors with context
  console.error('[Request Error]', {
    error: err.message,
    stack: err.stack,
    path: request.path,
    method: request.method,
    timestamp: new Date().toISOString(),
  });

  // Send to error tracking service
  // e.g., Sentry.captureException(err)
}
