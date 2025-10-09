'use server';

import { Book } from '@/lib/bible';
import { revalidatePath } from 'next/cache';

/**
 * Server action to fetch Bible book data
 * Demonstrates Next.js 14 Server Actions pattern
 */
export async function getBibleBook(bookName: string): Promise<Book | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/data/${bookName}.json`,
      {
        // Use ISR with 1 hour revalidation
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch book: ${bookName}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error loading book ${bookName}:`, error);
    return null;
  }
}

/**
 * Server action to search Bible verses
 * Demonstrates data mutation pattern with revalidation
 */
export async function searchVerses(query: string, testament?: 'old' | 'new') {
  // This is a placeholder - in a real app, you might:
  // 1. Query a database
  // 2. Use a search index
  // 3. Cache results

  console.info(`[Server Action] Searching for: "${query}" in ${testament || 'all'} testament(s)`);

  // Revalidate the search page cache
  revalidatePath('/bible');

  return {
    query,
    testament,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Server action to log Bible reading progress
 * Demonstrates async mutations without returning to client
 */
export async function logReadingProgress(book: string, chapter: number, timestamp: string) {
  // In a real app, you might save this to a database
  console.info(`[Server Action] Reading progress logged: ${book} ${chapter} at ${timestamp}`);

  // No need to revalidate since this doesn't affect the UI
  return { success: true };
}
