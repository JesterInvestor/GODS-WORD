'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BOOKS, BOOK_NAMES, loadBook, Book } from '@/lib/bible';
import StrongsModal from '@/components/StrongsModal';
import StrongsTooltip from '@/components/StrongsTooltip';
import { isTouchDevice } from '@/lib/deviceDetection';

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
  const [hoveredWord, setHoveredWord] = useState<{ word: string; ref: string; element: HTMLElement } | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadBookData(selectedBook);
  }, [selectedBook]);

  useEffect(() => {
    // Detect if device supports touch
    setIsTouch(isTouchDevice());
  }, []);

  // Show TOC automatically when page loads with a testament parameter
  useEffect(() => {
    if (testament) {
      setShowTOC(true);
    }
  }, [testament]);

  const loadBookData = async (book: string) => {
    setLoading(true);
    const data = await loadBook(book);
    setBookData(data);
    setLoading(false);
  };

  const bookDisplayName = BOOK_NAMES[BOOKS.indexOf(selectedBook)];
  const currentChapter = bookData?.chapters.find(ch => ch.chapter === String(selectedChapter));

  // Function to render text with clickable Strong's words
  // Maps important theological words to their Strong's references
  const renderTextWithStrongsLinks = (text: string) => {
    // Comprehensive mapping of English words to Strong's references
    const wordToStrongsMap: { [key: string]: string } = {
      // Hebrew words (Old Testament)
      'God': 'H430',
      'LORD': 'H3068',
      'Spirit': 'H7307',
      'spirit': 'H7307',
      'Heaven': 'H8064',
      'heaven': 'H8064',
      'Earth': 'H776',
      'earth': 'H776',
      'Israel': 'H3478',
      'Jerusalem': 'H3389',
      'Moses': 'H4872',
      'Abraham': 'H85',
      'David': 'H1732',
      'prophet': 'H5030',
      'Prophet': 'H5030',
      'angel': 'H4397',
      'Angel': 'H4397',
      'holy': 'H6944',
      'Holy': 'H6944',
      'blessed': 'H1288',
      'Blessed': 'H1288',
      'covenant': 'H1285',
      'Covenant': 'H1285',
      'mercy': 'H2617',
      'Mercy': 'H2617',
      'righteousness': 'H6663',
      'Righteousness': 'H6663',
      'righteous': 'H6662',
      'Righteous': 'H6662',
      'truth': 'H571',
      'Truth': 'H571',
      'faith': 'H530',
      'Faith': 'H530',
      'faithful': 'H539',
      'Faithful': 'H539',
      'wisdom': 'H2451',
      'Wisdom': 'H2451',
      'peace': 'H7965',
      'Peace': 'H7965',
      
      // Greek words (New Testament)
      'Jesus': 'G2424',
      'Christ': 'G5547',
      'love': 'G26',
      'Love': 'G26',
      'grace': 'G5485',
      'Grace': 'G5485',
      'glory': 'G1391',
      'Glory': 'G1391',
      'salvation': 'G4991',
      'Salvation': 'G4991',
      'church': 'G1577',
      'Church': 'G1577',
      'kingdom': 'G932',
      'Kingdom': 'G932',
      'gospel': 'G2098',
      'Gospel': 'G2098',
      'apostle': 'G652',
      'Apostle': 'G652',
      'disciple': 'G3101',
      'Disciple': 'G3101',
      'cross': 'G4716',
      'Cross': 'G4716',
      'resurrection': 'G386',
      'Resurrection': 'G386',
      'eternal': 'G166',
      'Eternal': 'G166',
      'prayer': 'G4335',
      'Prayer': 'G4335',
      'hope': 'G1680',
      'Hope': 'G1680',
    };

    // Create a pattern that matches any of the words
    const words = Object.keys(wordToStrongsMap);
    const pattern = new RegExp(`\\b(${words.join('|')})\\b`, 'g');
    const parts = text.split(pattern);
    
    return parts.map((part, index) => {
      if (wordToStrongsMap[part]) {
        const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
          if (!isTouch) {
            // Clear any existing timeout
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
            }
            // Set a small delay before showing tooltip to avoid flickering
            hoverTimeoutRef.current = setTimeout(() => {
              setHoveredWord({
                word: part,
                ref: wordToStrongsMap[part],
                element: e.currentTarget
              });
            }, 200);
          }
        };

        const handleMouseLeave = () => {
          if (!isTouch) {
            // Clear timeout if mouse leaves before delay completes
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = null;
            }
            // Delay hiding to allow moving to tooltip
            setTimeout(() => {
              // Only close if not hovering over tooltip
              if (tooltipRef.current && !tooltipRef.current.matches(':hover')) {
                setHoveredWord(null);
              }
            }, 100);
          }
        };

        const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
          // Allow clicks on all devices (including hybrid touchscreen desktops)
          console.log('Clicked', part);
          e.preventDefault();
          e.stopPropagation();
          setSelectedWord({ word: part, ref: wordToStrongsMap[part] });
        };

        const handleTouchStart = (e: React.TouchEvent<HTMLSpanElement>) => {
          // Mark that a touch started (no action needed)
          e.stopPropagation();
        };

        const handleTouchEnd = (e: React.TouchEvent<HTMLSpanElement>) => {
          // For mobile devices, handle the tap here
          // preventDefault stops the subsequent click event from firing
          e.preventDefault();
          e.stopPropagation();
          console.log('Touch ended', part);
          setSelectedWord({ word: part, ref: wordToStrongsMap[part] });
        };

        return (
          <span
            key={index}
            className="text-blue-600 dark:text-blue-400 underline decoration-blue-400 decoration-1 hover:decoration-2 hover:decoration-blue-600 dark:hover:decoration-blue-300 cursor-pointer font-semibold transition-all active:bg-blue-100 dark:active:bg-blue-900 rounded px-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            title={isTouch ? "Tap to see Strong's Concordance" : "Hover to see Strong's Concordance"}
            style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            tabIndex={0}
            role="button"
            aria-label={`View Strong's Concordance for ${part}`}
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
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
          <button
            onClick={() => setShowTOC(!showTOC)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            aria-label={showTOC ? 'Close table of contents' : 'Open table of contents'}
          >
            {showTOC ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Table of Contents Overlay */}
        {showTOC && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setShowTOC(false)}>
            <div className="bg-white dark:bg-gray-800 h-full w-80 overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
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
              
              {/* Conditionally render sections */}
              {(tocSection === 'all' || tocSection === 'old') && (
                <div className="mb-6" id="old-testament-section">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Old Testament
                  </h3>
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
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    New Testament
                  </h3>
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
                    <span className="text-blue-600 font-bold text-lg md:text-xl mr-3 flex-shrink-0 select-none">
                      {verse.verse}
                    </span>
                    <p className="text-gray-800 dark:text-gray-200 text-lg md:text-xl leading-relaxed">
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

      {/* Strong's Concordance Hover Tooltip (Desktop) */}
      {hoveredWord && !isTouch && (
        <div
          ref={tooltipRef}
          onMouseEnter={() => {
            // Keep tooltip open when hovering over it
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
            }
          }}
          onMouseLeave={() => {
            // Close tooltip when mouse leaves
            setHoveredWord(null);
          }}
        >
          <StrongsTooltip
            word={hoveredWord.word}
            strongsRef={hoveredWord.ref}
            anchorElement={hoveredWord.element}
            onClose={() => setHoveredWord(null)}
          />
        </div>
      )}

      {/* Strong's Concordance Modal (Mobile/Touch) */}
      {selectedWord && (
        <StrongsModal
          word={selectedWord.word}
          strongsRef={selectedWord.ref}
          onClose={() => setSelectedWord(null)}
        />
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
