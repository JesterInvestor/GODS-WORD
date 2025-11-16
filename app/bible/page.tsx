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

  useEffect(() => {
    const onStr = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail;
        setStrongsEnabled(Boolean(detail));
      } catch (err) {}
    };
    const onJes = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail;
        setJesusWordsEnabled(Boolean(detail));
      } catch (err) {}
    };

    const onToggleTOC = () => setShowTOC(s => !s);
    const onToggleSettings = () => setShowSettings(s => !s);

    window.addEventListener('strongsEnabledChanged', onStr);
    window.addEventListener('jesusWordsEnabledChanged', onJes);
    window.addEventListener('sync-str', onStr);
    window.addEventListener('sync-jesus', onJes);
    window.addEventListener('toggleTOC', onToggleTOC);
    window.addEventListener('toggleSettings', onToggleSettings);

    return () => {
      window.removeEventListener('strongsEnabledChanged', onStr);
      window.removeEventListener('jesusWordsEnabledChanged', onJes);
      window.removeEventListener('sync-str', onStr);
      window.removeEventListener('sync-jesus', onJes);
      window.removeEventListener('toggleTOC', onToggleTOC);
      window.removeEventListener('toggleSettings', onToggleSettings);
    };
  }, []);

  useEffect(() => {
    try {
      window.dispatchEvent(new CustomEvent('tocChanged', { detail: showTOC }));
    } catch {}
  }, [showTOC]);

  useEffect(() => {
    try {
      window.dispatchEvent(new CustomEvent('settingsChanged', { detail: showSettings }));
    } catch {}
  }, [showSettings]);

  const loadBookData = async (book: string) => {
    setLoading(true);
    const data = await loadBook(book);
    setBookData(data);
    setLoading(false);
  };

  const bookDisplayName = BOOK_NAMES[BOOKS.indexOf(selectedBook)];
  const currentChapter = bookData?.chapters.find(ch => ch.chapter === String(selectedChapter));

  return (
    <div>{loading ? <div>Loading...</div> : <div>Render Bible Content Here</div>}</div>
  );
}

export default function BiblePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BibleContent />
    </Suspense>
  );
}