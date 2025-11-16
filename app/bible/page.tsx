'use client';

import { useState, useEffect, Suspense, ReactElement } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BOOKS, BOOK_NAMES, loadBook, Book } from '@/lib/bible';
import StrongsModal from '@/components/StrongsModal';
import { shouldHighlightAsJesusWords } from '@/lib/jesusWords';

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

  const loadBookData = async (book: string) => {
    setLoading(true);
    const data = await loadBook(book);
    setBookData(data);
    setLoading(false);
  };

  const bookDisplayName = BOOK_NAMES[BOOKS.indexOf(selectedBook)];
  const currentChapter = bookData?.chapters.find(ch => ch.chapter === String(selectedChapter));

  const getLineHeightValue = () => {
    switch (lineHeight) {
      case 'compact':
        return '1.5';
      case 'normal':
        return '1.8';
      case 'relaxed':
        return '2.2';
      default:
        return '1.8';
    }
  };

  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'serif':
        return 'font-reading-serif';
      case 'crimson':
        return 'font-reading-crimson';
      case 'sans':
        return '';
      default:
        return 'font-reading-serif';
    }
  };

  return (
    <div>
      <div className="bg-gray-200 h-1 mb-4"></div> {/* Divider above chapter title */}
      <div className="bg-gray-300 h-1 mb-4"></div> {/* Divider above chapter title */}
      <div className="bg-gray-400 h-1 mb-4"></div> {/* Divider above chapter title */}
      {loading ? (
        <div>Loading...</div>
      ) : currentChapter ? (
        <div>
          <h1 className="text-3xl font-bold">{bookDisplayName}</h1>
          <h2 className="text-2xl">Chapter {selectedChapter}</h2>
          <div className={getFontFamilyClass()}>
            {currentChapter.verses.map(verse => (
              <p
                key={verse.verse}
                style={{
                  lineHeight: getLineHeightValue(),
                }}
              >
                <span className="font-bold mr-2">{verse.verse}</span>
                {verse.text}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div>Chapter not found</div>
      )}
    </div>
  );
}

export default function BiblePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BibleContent />
    </Suspense>
  );
}