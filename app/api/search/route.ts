import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/search?q=query&testament=old|new
 * Search Bible verses
 * Demonstrates query parameter handling
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const testament = searchParams.get('testament');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    // This is a placeholder - in production, you would:
    // 1. Search through a database or search index
    // 2. Implement full-text search
    // 3. Return matching verses with context

    console.info(`[API /search] Query: "${query}", Testament: ${testament || 'all'}`);

    return NextResponse.json(
      {
        query,
        testament: testament || 'all',
        results: [],
        total: 0,
        message: 'Search functionality placeholder - implement with database or search index',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('[API /search] Error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

// Enable edge runtime for faster response
export const runtime = 'edge';
