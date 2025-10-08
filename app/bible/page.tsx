'use client';

import { useState, useEffect, Suspense, ReactElement } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BOOKS, BOOK_NAMES, loadBook, Book } from '@/lib/bible';
import StrongsModal from '@/components/StrongsModal';
import SearchModal from '@/components/SearchModal';
import { shouldHighlightAsJesusWords } from '@/lib/jesusWords';
import { useSwipe } from '@/lib/useSwipe';

function BibleContent() {
  const searchParams = useSearchParams();
  const testament = searchParams.get('testament');
  const bookParam = searchParams.get('book');
  const chapterParam = searchParams.get('chapter');
  
  // Set initial book based on parameters
  const initialBook = bookParam || (testament === 'new' ? 'Matthew' : 'Genesis');
  const initialChapter = chapterParam ? parseInt(chapterParam, 10) : 1;
  
  const [selectedBook, setSelectedBook] = useState<string>(initialBook);
  const [selectedChapter, setSelectedChapter] = useState<number>(initialChapter);
  const [bookData, setBookData] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTOC, setShowTOC] = useState(false);
  const [tocSection, setTocSection] = useState<'all' | 'old' | 'new'>('all');
  const [selectedWord, setSelectedWord] = useState<{ word: string; ref?: string } | null>(null);
  const [fontSize, setFontSize] = useState<number>(18);
  const [strongsEnabled, setStrongsEnabled] = useState<boolean>(true);
  const [jesusWordsEnabled, setJesusWordsEnabled] = useState<boolean>(true);
  const readingMode = 'sepia'; // Fixed to sepia mode
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'crimson'>('serif');
  const [lineHeight, setLineHeight] = useState<'compact' | 'normal' | 'relaxed'>('normal');
  const [textWidth, setTextWidth] = useState<'narrow' | 'normal' | 'wide'>('normal');
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadBookData(selectedBook);
  }, [selectedBook]);

  useEffect(() => {
    // Load Strong's preference from localStorage
    const savedStrongsEnabled = localStorage.getItem('strongsEnabled');
    if (savedStrongsEnabled !== null) {
      setStrongsEnabled(savedStrongsEnabled === 'true');
    }
    
    // Load Jesus's words preference from localStorage
    const savedJesusWordsEnabled = localStorage.getItem('jesusWordsEnabled');
    if (savedJesusWordsEnabled !== null) {
      setJesusWordsEnabled(savedJesusWordsEnabled === 'true');
    }
  }, []);

  useEffect(() => {
    // Save Strong's preference to localStorage
    localStorage.setItem('strongsEnabled', String(strongsEnabled));
  }, [strongsEnabled]);

  useEffect(() => {
    // Save Jesus's words preference to localStorage
    localStorage.setItem('jesusWordsEnabled', String(jesusWordsEnabled));
  }, [jesusWordsEnabled]);

  useEffect(() => {
    // Load reading preferences from localStorage
    const savedFontSize = localStorage.getItem('fontSize');
    const savedFontFamily = localStorage.getItem('fontFamily');
    const savedLineHeight = localStorage.getItem('lineHeight');
    const savedTextWidth = localStorage.getItem('textWidth');
    
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedFontFamily) setFontFamily(savedFontFamily as 'sans' | 'serif' | 'crimson');
    if (savedLineHeight) setLineHeight(savedLineHeight as 'compact' | 'normal' | 'relaxed');
    if (savedTextWidth) setTextWidth(savedTextWidth as 'narrow' | 'normal' | 'wide');
  }, []);

  useEffect(() => {
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);

  useEffect(() => {
    // Save and apply dark mode
    localStorage.setItem('darkMode', String(darkMode));
    if (typeof document !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode]);

  useEffect(() => {
    // Save reading preferences to localStorage
    localStorage.setItem('fontSize', String(fontSize));
    localStorage.setItem('fontFamily', fontFamily);
    localStorage.setItem('lineHeight', lineHeight);
    localStorage.setItem('textWidth', textWidth);
    
    // Apply sepia mode to body (always enabled)
    if (typeof document !== 'undefined') {
      document.body.classList.add('sepia-mode');
    }
  }, [fontSize, fontFamily, lineHeight, textWidth]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs or modals are open
      if (showTOC || showSettings || selectedWord || showSearch) return;
      
      // Search shortcut (Ctrl+K or Cmd+K)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
        return;
      }
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          // Previous chapter
          if (selectedChapter > 1) {
            setSelectedChapter(selectedChapter - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const currentIndex = BOOKS.indexOf(selectedBook);
            if (currentIndex > 0) {
              const prevBook = BOOKS[currentIndex - 1];
              setSelectedBook(prevBook);
              loadBook(prevBook).then(data => {
                if (data) setSelectedChapter(data.chapters.length);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              });
            }
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          // Next chapter
          if (bookData && selectedChapter < bookData.chapters.length) {
            setSelectedChapter(selectedChapter + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const currentIndex = BOOKS.indexOf(selectedBook);
            if (currentIndex < BOOKS.length - 1) {
              const nextBook = BOOKS[currentIndex + 1];
              setSelectedBook(nextBook);
              setSelectedChapter(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          setShowTOC(!showTOC);
          break;
        case 's':
        case 'S':
          e.preventDefault();
          setShowSettings(!showSettings);
          break;
        case 'Escape':
          if (showTOC) setShowTOC(false);
          if (showSettings) setShowSettings(false);
          if (showSearch) setShowSearch(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBook, selectedChapter, bookData, showTOC, showSettings, selectedWord, showSearch]);





  const loadBookData = async (book: string) => {
    setLoading(true);
    const data = await loadBook(book);
    setBookData(data);
    setLoading(false);
  };

  const bookDisplayName = BOOK_NAMES[BOOKS.indexOf(selectedBook)];
  const currentChapter = bookData?.chapters.find(ch => ch.chapter === String(selectedChapter));

  // Navigation helpers
  const goToPreviousChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const currentIndex = BOOKS.indexOf(selectedBook);
      if (currentIndex > 0) {
        const prevBook = BOOKS[currentIndex - 1];
        setSelectedBook(prevBook);
        loadBook(prevBook).then(data => {
          if (data) setSelectedChapter(data.chapters.length);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    }
  };

  const goToNextChapter = () => {
    if (bookData && selectedChapter < bookData.chapters.length) {
      setSelectedChapter(selectedChapter + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const currentIndex = BOOKS.indexOf(selectedBook);
      if (currentIndex < BOOKS.length - 1) {
        const nextBook = BOOKS[currentIndex + 1];
        setSelectedBook(nextBook);
        setSelectedChapter(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Swipe handlers for touch navigation
  const swipeRef = useSwipe({
    onSwipeLeft: () => {
      if (!showTOC && !showSettings && !selectedWord && !showSearch) {
        goToNextChapter();
      }
    },
    onSwipeRight: () => {
      if (!showTOC && !showSettings && !selectedWord && !showSearch) {
        goToPreviousChapter();
      }
    }
  }, { minSwipeDistance: 100 });

  const fontSizes = [14, 16, 18, 20, 24, 28];
  const handleFontSizeIncrease = () => {
    const currentIndex = fontSizes.indexOf(fontSize);
    if (currentIndex < fontSizes.length - 1) {
      setFontSize(fontSizes[currentIndex + 1]);
    }
  };
  const handleFontSizeDecrease = () => {
    const currentIndex = fontSizes.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(fontSizes[currentIndex - 1]);
    }
  };

  const getLineHeightValue = () => {
    switch (lineHeight) {
      case 'compact': return '1.5';
      case 'normal': return '1.8';
      case 'relaxed': return '2.2';
      default: return '1.8';
    }
  };

  const getTextWidthClass = () => {
    switch (textWidth) {
      case 'narrow': return 'max-w-2xl';
      case 'normal': return 'max-w-4xl';
      case 'wide': return 'max-w-6xl';
      default: return 'max-w-4xl';
    }
  };

  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'serif': return 'font-reading-serif';
      case 'crimson': return 'font-reading-crimson';
      case 'sans': return '';
      default: return 'font-reading-serif';
    }
  };

  // Function to render text with clickable Strong's words
  // Parses Strong's numbers embedded in the text like "God[H430]"
  const renderTextWithStrongsLinks = (text: string, verseInfo?: { book: string; chapter: string; verse: string }) => {
    // Check if this verse contains Jesus's words
    const isJesusVerse = verseInfo && jesusWordsEnabled && shouldHighlightAsJesusWords(verseInfo.book, verseInfo.chapter, verseInfo.verse);
    
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

        // Build className with Jesus's words border styling
        let className = strongsEnabled 
          ? "text-blue-600 dark:text-blue-400 underline decoration-blue-400 decoration-1 hover:decoration-2 hover:decoration-blue-600 dark:hover:decoration-blue-300 cursor-pointer font-semibold transition-all active:bg-blue-100 dark:active:bg-blue-900 rounded px-0.5"
          : "";
        
        if (isJesusVerse) {
          className += " jesus-words";
        }

        parts.push(
          <span
            key={`word-${index++}`}
            className={className}
            onClick={handleClick}
            onTouchEnd={handleTouchEnd}
            title={strongsEnabled ? `${word} (${refs.join(', ')})` : undefined}
            style={strongsEnabled ? { WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' } : undefined}
          >
            {word}
          </span>
        );
      } else if (match[3]) {
        // Regular word without Strong's number - also apply Jesus's words styling if applicable
        const className = isJesusVerse ? "jesus-words" : "";
        parts.push(<span key={`text-${index++}`} className={className}>{match[3]}</span>);
      }
    }

    return <>{parts}</>;
  };

  const headerBgClass = readingMode === 'sepia' 
    ? 'bg-[#faf8f3] shadow-sm' 
    : readingMode === 'dark' 
    ? 'bg-gray-800 shadow-sm' 
    : 'bg-white dark:bg-gray-800 shadow-sm';

  const headerTextClass = readingMode === 'sepia' 
    ? 'text-[#5c4f3a]' 
    : readingMode === 'dark' 
    ? 'text-white' 
    : 'text-gray-800 dark:text-white';

  const bgClass = readingMode === 'sepia' 
    ? 'bg-[#f4f1ea]' 
    : readingMode === 'dark' 
    ? 'bg-gray-900' 
    : 'bg-gray-50 dark:bg-gray-900';

  const cardBgClass = readingMode === 'sepia' 
    ? 'bg-[#faf8f3]' 
    : readingMode === 'dark' 
    ? 'bg-gray-800' 
    : 'bg-white dark:bg-gray-800';

  const textClass = readingMode === 'sepia' 
    ? 'text-[#5c4f3a]' 
    : readingMode === 'dark' 
    ? 'text-gray-200' 
    : 'text-gray-800 dark:text-gray-200';

  return (
    <div className={`min-h-screen ${bgClass}`} ref={swipeRef}>
      {/* Header */}
      <header className={`${headerBgClass} sticky top-0 z-10`} role="banner">
        <div className={`${getTextWidthClass()} mx-auto px-4 py-4 flex items-center justify-between`}>
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 transition-all"
            aria-label="Go to home page"
          >
            ← Home
          </Link>
          <h1 className={`text-xl font-bold ${headerTextClass}`}>
            {bookDisplayName} {selectedChapter}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSearch(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              aria-label="Search books (Ctrl+K or Cmd+K)"
              title="Search (Ctrl+K)"
            >
              🔍
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={darkMode ? "Light Mode" : "Dark Mode"}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
              aria-label={showSettings ? "Close reading settings" : "Open reading settings"}
              title="Reading Settings"
            >
              ⚙️
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
              onClick={() => setJesusWordsEnabled(!jesusWordsEnabled)}
              className={`${jesusWordsEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 hover:bg-gray-500'} text-white px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all`}
              aria-label={jesusWordsEnabled ? 'Disable Jesus\'s words highlighting' : 'Enable Jesus\'s words highlighting'}
              title={jesusWordsEnabled ? 'Jesus\'s words highlighting enabled' : 'Jesus\'s words highlighting disabled'}
            >
              J
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

      <div className={`${getTextWidthClass()} mx-auto px-4 py-6`}>
        {/* Reading Settings Panel */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setShowSettings(false)} onTouchEnd={() => setShowSettings(false)}>
            <div className={`${cardBgClass} h-full w-96 overflow-y-auto p-6 shadow-2xl`} onClick={e => e.stopPropagation()} onTouchEnd={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${headerTextClass}`}>
                  Reading Settings
                </h2>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  aria-label="Close settings"
                >
                  ×
                </button>
              </div>

              {/* Font Size */}
              <div className="mb-6">
                <h3 className={`text-sm font-semibold ${textClass} mb-3`}>Font Size</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleFontSizeDecrease}
                    disabled={fontSize === fontSizes[0]}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    aria-label="Decrease font size"
                  >
                    A−
                  </button>
                  <span className={`${textClass} font-semibold min-w-[60px] text-center`}>{fontSize}px</span>
                  <button
                    onClick={handleFontSizeIncrease}
                    disabled={fontSize === fontSizes[fontSizes.length - 1]}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    aria-label="Increase font size"
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* Font Family */}
              <div className="mb-6">
                <h3 className={`text-sm font-semibold ${textClass} mb-3`}>Font Family</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setFontFamily('serif')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-reading-serif transition-all ${
                      fontFamily === 'serif' 
                        ? 'bg-blue-600 text-white font-semibold' 
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Georgia (Serif)
                  </button>
                  <button
                    onClick={() => setFontFamily('crimson')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-reading-crimson transition-all ${
                      fontFamily === 'crimson' 
                        ? 'bg-blue-600 text-white font-semibold' 
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Crimson Text (Serif)
                  </button>
                  <button
                    onClick={() => setFontFamily('sans')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      fontFamily === 'sans' 
                        ? 'bg-blue-600 text-white font-semibold' 
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Arial (Sans-serif)
                  </button>
                </div>
              </div>

              {/* Line Height */}
              <div className="mb-6">
                <h3 className={`text-sm font-semibold ${textClass} mb-3`}>Line Spacing</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setLineHeight('compact')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      lineHeight === 'compact' 
                        ? 'bg-blue-600 text-white font-semibold' 
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Compact (1.5)
                  </button>
                  <button
                    onClick={() => setLineHeight('normal')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      lineHeight === 'normal' 
                        ? 'bg-blue-600 text-white font-semibold' 
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Normal (1.8)
                  </button>
                  <button
                    onClick={() => setLineHeight('relaxed')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      lineHeight === 'relaxed' 
                        ? 'bg-blue-600 text-white font-semibold' 
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Relaxed (2.2)
                  </button>
                </div>
              </div>

              {/* Text Width */}
              <div className="mb-6">
                <h3 className={`text-sm font-semibold ${textClass} mb-3`}>Text Width</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setTextWidth('narrow')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      textWidth === 'narrow' 
                        ? 'bg-blue-600 text-white font-semibold' 
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Narrow (672px)
                  </button>
                  <button
                    onClick={() => setTextWidth('normal')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      textWidth === 'normal' 
                        ? 'bg-blue-600 text-white font-semibold' 
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Normal (896px)
                  </button>
                  <button
                    onClick={() => setTextWidth('wide')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      textWidth === 'wide' 
                        ? 'bg-blue-600 text-white font-semibold' 
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Wide (1152px)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table of Contents Overlay */}
        {showTOC && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20" 
            onClick={() => setShowTOC(false)} 
            onTouchEnd={() => setShowTOC(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Table of Contents"
          >
            <nav 
              className={`${cardBgClass} h-full max-h-screen w-80 overflow-y-auto p-6`} 
              onClick={e => e.stopPropagation()} 
              onTouchEnd={e => e.stopPropagation()}
              aria-label="Bible books navigation"
            >
              <h2 className={`text-2xl font-bold ${headerTextClass} mb-4`} id="toc-title">
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
            </nav>
          </div>
        )}

        {/* Chapter Navigation */}
        {bookData && (
          <div className={`${cardBgClass} rounded-lg shadow-sm p-4 mb-6`}>
            <h3 className={`text-sm font-semibold ${textClass} mb-3`}>
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
        <article className={`${cardBgClass} rounded-lg shadow-sm p-6 md:p-8 ${getFontFamilyClass()}`} role="main" aria-label="Bible chapter content">
          {loading ? (
            <div className="text-center py-12" role="status" aria-live="polite">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" aria-hidden="true"></div>
              <p className={`mt-4 ${textClass}`}>Loading the Word of God...</p>
            </div>
          ) : currentChapter ? (
            <div>
              {/* Chapter Header with decorative divider */}
              <header className="mb-8 pb-6 border-b-2 border-blue-200 dark:border-blue-800">
                <h2 className={`text-3xl md:text-4xl font-bold ${headerTextClass} text-center`}>
                  {bookDisplayName}
                </h2>
                <p className={`text-xl md:text-2xl ${textClass} text-center mt-2 opacity-70`}>
                  Chapter {selectedChapter}
                </p>
              </header>
              <div className="space-y-3" role="list" aria-label="Verses">
                {currentChapter.verses.map((verse) => (
                  <div 
                    key={verse.verse} 
                    className="flex group hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded px-2 py-1 transition-colors"
                    role="listitem"
                  >
                    <span 
                      className="text-blue-600 font-bold mr-4 flex-shrink-0 select-none bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded min-w-[2rem] text-center" 
                      style={{ fontSize: `${Math.max(fontSize - 2, 12)}px` }}
                      aria-label={`Verse ${verse.verse}`}
                    >
                      {verse.verse}
                    </span>
                    <p 
                      className={`${textClass}`} 
                      style={{ 
                        fontSize: `${fontSize}px`,
                        lineHeight: getLineHeightValue()
                      }}
                    >
                      {renderTextWithStrongsLinks(verse.text, { 
                        book: selectedBook, 
                        chapter: String(selectedChapter), 
                        verse: verse.verse 
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className={`text-center ${textClass}`} role="status">Chapter not found</p>
          )}
        </article>

        {/* Navigation Buttons */}
        {bookData && (
          <nav className="flex justify-between mt-6" aria-label="Chapter navigation">
            <button
              onClick={goToPreviousChapter}
              disabled={selectedBook === BOOKS[0] && selectedChapter === 1}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              aria-label="Go to previous chapter"
            >
              ← Previous
            </button>
            <button
              onClick={goToNextChapter}
              disabled={selectedBook === BOOKS[BOOKS.length - 1] && bookData && selectedChapter === bookData.chapters.length}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              aria-label="Go to next chapter"
            >
              Next →
            </button>
          </nav>
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

      {/* Search Modal */}
      {showSearch && (
        <SearchModal
          onClose={() => setShowSearch(false)}
          onNavigate={(book, chapter) => {
            setSelectedBook(book);
            setSelectedChapter(chapter);
            setShowSearch(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
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
