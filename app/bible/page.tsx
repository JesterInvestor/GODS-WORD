'use client';

import { useState, useEffect, Suspense, ReactElement } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BOOKS, BOOK_NAMES, loadBook, Book } from '@/lib/bible';
import StrongsModal from '@/components/StrongsModal';

function BibleContent() {
  const searchParams = useSearchParams();
  const testament = searchParams.get('testament');
  
  // Set initial book based on testament parameter
  const initialBook = testament === 'new' ? 'Matthew' : 'Genesis';
  const [selectedBook, setSelectedBook] = useState<string>(initialBook);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [bookData, setBookData] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTOC, setShowTOC] = useState(false);
  const [tocSection, setTocSection] = useState<'all' | 'old' | 'new'>('all');
  const [selectedWord, setSelectedWord] = useState<{ word: string; ref?: string } | null>(null);
  const [fontSize, setFontSize] = useState<number>(16);
  const [strongsEnabled, setStrongsEnabled] = useState<boolean>(true);

  useEffect(() => {
    loadBookData(selectedBook);
  }, [selectedBook]);

  useEffect(() => {
    // Load Strong's preference from localStorage
    const savedStrongsEnabled = localStorage.getItem('strongsEnabled');
    if (savedStrongsEnabled !== null) {
      setStrongsEnabled(savedStrongsEnabled === 'true');
    }
  }, []);

  useEffect(() => {
    // Save Strong's preference to localStorage
    localStorage.setItem('strongsEnabled', String(strongsEnabled));
  }, [strongsEnabled]);





  const loadBookData = async (book: string) => {
    setLoading(true);
    const data = await loadBook(book);
    setBookData(data);
    setLoading(false);
  };

  const bookDisplayName = BOOK_NAMES[BOOKS.indexOf(selectedBook)];
  const currentChapter = bookData?.chapters.find(ch => ch.chapter === String(selectedChapter));

  const handleFontSizeToggle = () => {
    setFontSize(fontSize === 16 ? 20 : 16);
  };

  // Function to render text with clickable Strong's words
  // Parses Strong's numbers embedded in the text like "God[H430]"
  const renderTextWithStrongsLinks = (text: string) => {
    // Pattern to match words with Strong's numbers: word[H1234] or word[G1234]
    // Supports multiple consecutive Strong's numbers like: word[H1234][H5678]
    const strongsPattern = /(\S+?)(\[(?:H|G)\d+\](?:\[(?:H|G)\d+\])*)|(\S+)|(\s+)/g;
    const parts: ReactElement[] = [];
    let match;
    let index = 0;

    while ((match = strongsPattern.exec(text)) !== null) {
      if (match[4]) {
        // Whitespace
        parts.push(<span key={`space-${index++}`}>{match[4]}</span>);
      } else if (match[1] && match[2]) {
        // Word with Strong's number(s)
        const word = match[1];
        const strongsRefs = match[2];
        // Extract all Strong's numbers from the brackets
        const refs = strongsRefs.match(/[HG]\d+/g) || [];
        const primaryRef = refs[0]; // Use the first reference as primary

        const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
          if (!strongsEnabled) return;
          console.log('[BiblePage] Word clicked:', word, 'primaryRef:', primaryRef);
          if (primaryRef) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[BiblePage] Setting selectedWord with ref:', primaryRef);
            setSelectedWord({ word, ref: primaryRef });
          } else {
            console.warn('[BiblePage] No primaryRef available for word:', word);
          }
        };

        const handleTouchEnd = (e: React.TouchEvent<HTMLSpanElement>) => {
          if (!strongsEnabled) return;
          console.log('[BiblePage] Word touched:', word, 'primaryRef:', primaryRef);
          if (primaryRef) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[BiblePage] Setting selectedWord with ref:', primaryRef);
            setSelectedWord({ word, ref: primaryRef });
          } else {
            console.warn('[BiblePage] No primaryRef available for word:', word);
          }
        };

        parts.push(
          <span
            key={`word-${index++}`}
            className={strongsEnabled 
              ? "text-blue-600 dark:text-blue-400 underline decoration-blue-400 decoration-1 hover:decoration-2 hover:decoration-blue-600 dark:hover:decoration-blue-300 cursor-pointer font-semibold transition-all active:bg-blue-100 dark:active:bg-blue-900 rounded px-0.5"
              : ""}
            onClick={handleClick}
            onTouchEnd={handleTouchEnd}
            title={strongsEnabled ? `${word} (${refs.join(', ')})` : undefined}
            style={strongsEnabled ? { WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' } : undefined}
          >
            {word}
          </span>
        );
      } else if (match[3]) {
        // Regular word without Strong's number
        parts.push(<span key={`text-${index++}`}>{match[3]}</span>);
      }
    }

    return <>{parts}</>;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 transition-all">
            ← Home
          </Link>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            {bookDisplayName} {selectedChapter}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleFontSizeToggle}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
              aria-label={fontSize === 16 ? 'Increase text size' : 'Reset text size'}
            >
              {fontSize === 16 ? 'A+' : 'A−'}
            </button>
            <button
              onClick={() => setStrongsEnabled(!strongsEnabled)}
              className={`${strongsEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 hover:bg-gray-500'} text-white px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all`}
              aria-label={strongsEnabled ? 'Disable Strong\'s references' : 'Enable Strong\'s references'}
              title={strongsEnabled ? 'Strong\'s references enabled' : 'Strong\'s references disabled'}
            >
              S#
            </button>
            <button
              onClick={() => setShowTOC(!showTOC)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              aria-label={showTOC ? 'Close table of contents' : 'Open table of contents'}
            >
              {showTOC ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Table of Contents Overlay */}
        {showTOC && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setShowTOC(false)}>
            <div className="bg-gray-100 dark:bg-gray-900 h-full w-80 overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Table of Contents
              </h2>
              
              {/* Quick Navigation */}
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => setTocSection('old')}
                  className="flex-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  aria-label="Jump to Old Testament"
                >
                  Old Testament
                </button>
                <button
                  onClick={() => setTocSection('new')}
                  className="flex-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  aria-label="Jump to New Testament"
                >
                  New Testament
                </button>
              </div>
              
              {/* Strong's Concordance Link */}
              <Link
                href="/strongs"
                className="block mb-4 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 px-3 py-2 rounded-lg text-xs font-semibold text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                Strong&apos;s Concordance
              </Link>
              
              {/* Conditionally render sections */}
              {(tocSection === 'all' || tocSection === 'old') && (
                <div className="mb-6" id="old-testament-section">
                  <div className="space-y-1">
                    {BOOKS.slice(0, 39).map((book, index) => (
                      <button
                        key={book}
                        onClick={() => {
                          setSelectedBook(book);
                          setSelectedChapter(1);
                          setShowTOC(false);
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          selectedBook === book
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        aria-label={`Select book ${BOOK_NAMES[index]}`}
                      >
                        {BOOK_NAMES[index]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(tocSection === 'all' || tocSection === 'new') && (
                <div id="new-testament-section">
                  <div className="space-y-1">
                    {BOOKS.slice(39).map((book, index) => (
                      <button
                        key={book}
                        onClick={() => {
                          setSelectedBook(book);
                          setSelectedChapter(1);
                          setShowTOC(false);
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          selectedBook === book
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        aria-label={`Select book ${BOOK_NAMES[39 + index]}`}
                      >
                        {BOOK_NAMES[39 + index]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chapter Navigation */}
        {bookData && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Select Chapter
            </h3>
            <div className="flex flex-wrap gap-2">
              {bookData.chapters.map((ch) => (
                <button
                  key={ch.chapter}
                  onClick={() => setSelectedChapter(Number(ch.chapter))}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedChapter === Number(ch.chapter)
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  aria-label={`Go to chapter ${ch.chapter}`}
                  aria-current={selectedChapter === Number(ch.chapter) ? 'true' : 'false'}
                >
                  {ch.chapter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bible Text */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          ) : currentChapter ? (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
                {bookDisplayName} Chapter {selectedChapter}
              </h2>
              <div className="space-y-4">
                {currentChapter.verses.map((verse) => (
                  <div key={verse.verse} className="flex group">
                    <span className="text-blue-600 font-bold mr-3 flex-shrink-0 select-none" style={{ fontSize: `${fontSize}px` }}>
                      {verse.verse}
                    </span>
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
                      {renderTextWithStrongsLinks(verse.text)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">Chapter not found</p>
          )}
        </div>

        {/* Navigation Buttons */}
        {bookData && (
          <div className="flex justify-between mt-6">
            <button
              onClick={() => {
                if (selectedChapter > 1) {
                  setSelectedChapter(selectedChapter - 1);
                  window.scrollTo(0, 0);
                } else {
                  const currentIndex = BOOKS.indexOf(selectedBook);
                  if (currentIndex > 0) {
                    const prevBook = BOOKS[currentIndex - 1];
                    setSelectedBook(prevBook);
                    loadBook(prevBook).then(data => {
                      if (data) setSelectedChapter(data.chapters.length);
                    });
                  }
                }
              }}
              disabled={selectedBook === BOOKS[0] && selectedChapter === 1}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              aria-label="Go to previous chapter"
            >
              ← Previous
            </button>
            <button
              onClick={() => {
                if (bookData && selectedChapter < bookData.chapters.length) {
                  setSelectedChapter(selectedChapter + 1);
                  window.scrollTo(0, 0);
                } else {
                  const currentIndex = BOOKS.indexOf(selectedBook);
                  if (currentIndex < BOOKS.length - 1) {
                    const nextBook = BOOKS[currentIndex + 1];
                    setSelectedBook(nextBook);
                    setSelectedChapter(1);
                  }
                }
              }}
              disabled={selectedBook === BOOKS[BOOKS.length - 1] && bookData && selectedChapter === bookData.chapters.length}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              aria-label="Go to next chapter"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Strong's Concordance Modal */}
      {selectedWord && (
        <>
          {console.log('[BiblePage] Rendering StrongsModal for:', selectedWord)}
          <StrongsModal
            word={selectedWord.word}
            strongsRef={selectedWord.ref}
            onClose={() => setSelectedWord(null)}
          />
        </>
      )}
    </div>
  );
}

export default function BiblePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <BibleContent />
    </Suspense>
  );
}
