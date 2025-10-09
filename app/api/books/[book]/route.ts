import { NextRequest, NextResponse } from 'next/server';
import { BOOKS } from '@/lib/bible';
import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * GET /api/books/[book]
 * Returns data for a specific Bible book
 * Implements ISR with revalidation
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ book: string }> }
) {
  try {
    const params = await context.params;
    const bookName = params.book;
    
    // Validate book name
    if (!BOOKS.includes(bookName)) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    // Read the book data from file system
    const filePath = join(process.cwd(), 'public', 'data', `${bookName}.json`);
    const fileContent = await readFile(filePath, 'utf-8');
    const bookData = JSON.parse(fileContent);

    return NextResponse.json(bookData, {
      status: 200,
      headers: {
        // Cache for 1 hour, revalidate in background
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[API /books/[book]] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book data' },
      { status: 500 }
    );
  }
}

// Enable ISR revalidation every hour
export const revalidate = 3600;
