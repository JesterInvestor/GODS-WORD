'use client';

import { useState, useEffect, useRef } from 'react';
import { BOOKS, BOOK_NAMES } from '@/lib/bible';

interface SearchModalProps {
  onClose: () => void;
  onNavigate: (book: string, chapter: number) => void;
}

export default function SearchModal({ onClose, onNavigate }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Array<{ book: string; bookName: string; index: number }>>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();

    // Close on Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = BOOKS.map((book, index) => ({
      book,
      bookName: BOOK_NAMES[index],
      index
    })).filter(item => 
      item.bookName.toLowerCase().includes(query) ||
      item.book.toLowerCase().includes(query)
    );

    setResults(filtered);
  }, [searchQuery]);

  const handleBookSelect = (book: string) => {
    onNavigate(book, 1);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <label htmlFor="search-input" className="sr-only">Search books</label>
          <input
            id="search-input"
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a book... (e.g., Genesis, John, Romans)"
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            aria-label="Search books"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Esc</kbd> to close
          </p>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2">
          {searchQuery && results.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No books found matching &quot;{searchQuery}&quot;
            </div>
          ) : searchQuery ? (
            <div className="space-y-1" role="list" aria-label="Search results">
              {results.map((result) => (
                <button
                  key={result.book}
                  onClick={() => handleBookSelect(result.book)}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  role="listitem"
                >
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    {result.bookName}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                    ({result.index < 39 ? 'Old Testament' : 'New Testament'})
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Start typing to search for a book
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
