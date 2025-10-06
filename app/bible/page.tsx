'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BOOKS, BOOK_NAMES, loadBook, Book } from '@/lib/bible';
import StrongsModal from '@/components/StrongsModal';

export default function BiblePage() {
  const [selectedBook, setSelectedBook] = useState<string>('Genesis');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [bookData, setBookData] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTOC, setShowTOC] = useState(false);
  const [selectedWord, setSelectedWord] = useState<{ word: string; ref?: string } | null>(null);

  useEffect(() => {
    loadBookData(selectedBook);
  }, [selectedBook]);

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
        return (
          <span
            key={index}
            className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-semibold transition-colors"
            onClick={() => setSelectedWord({ word: part, ref: wordToStrongsMap[part] })}
            title="Click to see Strong's Concordance"
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
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Home
          </Link>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            {bookDisplayName} {selectedChapter}
          </h1>
          <button
            onClick={() => setShowTOC(!showTOC)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
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
                  onClick={() => {
                    const element = document.getElementById('old-testament-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 px-3 py-2 rounded-lg text-xs font-semibold"
                >
                  Old Testament
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById('new-testament-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 px-3 py-2 rounded-lg text-xs font-semibold"
                >
                  New Testament
                </button>
              </div>
              
              {/* Old Testament */}
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
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                        selectedBook === book
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {BOOK_NAMES[index]}
                    </button>
                  ))}
                </div>
              </div>

              {/* New Testament */}
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
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                        selectedBook === book
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {BOOK_NAMES[39 + index]}
                    </button>
                  ))}
                </div>
              </div>
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
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    selectedChapter === Number(ch.chapter)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
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
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold"
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
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Strong's Concordance Modal */}
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
