import { NextRequest, NextResponse } from 'next/server';
import { BOOKS, BOOK_NAMES } from '@/lib/bible';

/**
 * GET /api/books
 * Returns list of all Bible books
 * Demonstrates Next.js API Routes pattern
 */
export async function GET(_request: NextRequest) {
  try {
    const books = BOOKS.map((book, index) => ({
      id: book,
      name: BOOK_NAMES[index],
      testament: index < 39 ? 'old' : 'new',
    }));

    return NextResponse.json(
      { 
        books,
        total: books.length,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      }
    );
  } catch (error) {
    console.error('[API /books] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

// Enable edge runtime for faster response
export const runtime = 'edge';
