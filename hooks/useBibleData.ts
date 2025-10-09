import { useState, useEffect } from 'react';
import { Book, loadBook } from '@/lib/bible';

/**
 * Custom hook for loading Bible book data with caching
 * @param bookName - The name of the book to load
 * @returns { data, loading, error }
 */
export function useBibleData(bookName: string) {
  const [data, setData] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const bookData = await loadBook(bookName);
        
        if (isMounted) {
          setData(bookData);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load book'));
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [bookName]);

  return { data, loading, error };
}
