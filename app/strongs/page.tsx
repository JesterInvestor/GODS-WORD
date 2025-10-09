'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { StrongsEntry, loadHebrewDictionary, loadGreekDictionary } from '@/lib/strongs';

function StrongsContent() {
  const searchParams = useSearchParams();
  const testament = searchParams.get('testament');

  const [hebrewDict, setHebrewDict] = useState<{ [key: string]: StrongsEntry }>({});
  const [greekDict, setGreekDict] = useState<{ [key: string]: StrongsEntry }>({});
  const [loading, setLoading] = useState(true);
  const [showTOC, setShowTOC] = useState(false);
  const [tocSection, setTocSection] = useState<'all' | 'hebrew' | 'greek'>('all');
  const [activeTab, setActiveTab] = useState<'hebrew' | 'greek'>(
    testament === 'greek' ? 'greek' : 'hebrew'
  );
  const [_selectedEntry, _setSelectedEntry] = useState<{ ref: string; entry: StrongsEntry } | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const readingMode = 'sepia'; // Fixed to sepia mode

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [hebrew, greek] = await Promise.all([loadHebrewDictionary(), loadGreekDictionary()]);
      setHebrewDict(hebrew);
      setGreekDict(greek);
      setLoading(false);
    };
    loadData();
  }, []);

  // Show TOC automatically when page loads with a testament parameter
  useEffect(() => {
    if (testament) {
      setShowTOC(true);
    }
  }, [testament]);

  const currentDict = activeTab === 'hebrew' ? hebrewDict : greekDict;
  const entries = Object.entries(currentDict).sort((a, b) => {
    const numA = parseInt(a[0].substring(1));
    const numB = parseInt(b[0].substring(1));
    return numA - numB;
  });

  // Filter entries based on search query
  const filteredEntries = searchQuery
    ? entries.filter(([ref, entry]) => {
        const query = searchQuery.toLowerCase();
        return (
          ref.toLowerCase().includes(query) ||
          entry.lemma?.toLowerCase().includes(query) ||
          entry.xlit?.toLowerCase().includes(query) ||
          entry.translit?.toLowerCase().includes(query) ||
          entry.strongs_def?.toLowerCase().includes(query) ||
          entry.kjv_def?.toLowerCase().includes(query)
        );
      })
    : entries;

  // Group entries by hundreds (H1-H100, H101-H200, etc.)
  const groupedEntries: { [key: string]: [string, StrongsEntry][] } = {};
  filteredEntries.forEach(([ref, entry]) => {
    const num = parseInt(ref.substring(1));
    const groupStart = Math.floor((num - 1) / 100) * 100 + 1;
    const groupEnd = groupStart + 99;
    const groupKey = `${ref[0]}${groupStart}-${ref[0]}${groupEnd}`;
    if (!groupedEntries[groupKey]) {
      groupedEntries[groupKey] = [];
    }
    groupedEntries[groupKey].push([ref, entry]);
  });

  // Create separate grouped entries for Hebrew and Greek for TOC (always available)
  const hebrewEntries = Object.entries(hebrewDict).sort((a, b) => {
    const numA = parseInt(a[0].substring(1));
    const numB = parseInt(b[0].substring(1));
    return numA - numB;
  });
  const hebrewGroupedEntries: { [key: string]: [string, StrongsEntry][] } = {};
  hebrewEntries.forEach(([ref, entry]) => {
    const num = parseInt(ref.substring(1));
    const groupStart = Math.floor((num - 1) / 100) * 100 + 1;
    const groupEnd = groupStart + 99;
    const groupKey = `${ref[0]}${groupStart}-${ref[0]}${groupEnd}`;
    if (!hebrewGroupedEntries[groupKey]) {
      hebrewGroupedEntries[groupKey] = [];
    }
    hebrewGroupedEntries[groupKey].push([ref, entry]);
  });

  const greekEntries = Object.entries(greekDict).sort((a, b) => {
    const numA = parseInt(a[0].substring(1));
    const numB = parseInt(b[0].substring(1));
    return numA - numB;
  });
  const greekGroupedEntries: { [key: string]: [string, StrongsEntry][] } = {};
  greekEntries.forEach(([ref, entry]) => {
    const num = parseInt(ref.substring(1));
    const groupStart = Math.floor((num - 1) / 100) * 100 + 1;
    const groupEnd = groupStart + 99;
    const groupKey = `${ref[0]}${groupStart}-${ref[0]}${groupEnd}`;
    if (!greekGroupedEntries[groupKey]) {
      greekGroupedEntries[groupKey] = [];
    }
    greekGroupedEntries[groupKey].push([ref, entry]);
  });

  const scrollToGroup = (groupKey: string) => {
    // Switch to the correct tab based on the group key prefix
    const isHebrew = groupKey.startsWith('H');
    setActiveTab(isHebrew ? 'hebrew' : 'greek');
    
    // Close TOC and scroll after a brief delay to allow tab switch
    setShowTOC(false);
    setTimeout(() => {
      const element = document.getElementById(groupKey);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const headerBgClass =
    readingMode === 'sepia'
      ? 'bg-[#faf8f3] shadow-sm'
      : readingMode === 'dark'
        ? 'bg-gray-800 shadow-sm'
        : 'bg-white dark:bg-gray-800 shadow-sm';

  const headerTextClass =
    readingMode === 'sepia'
      ? 'text-[#5c4f3a]'
      : readingMode === 'dark'
        ? 'text-white'
        : 'text-gray-800 dark:text-white';

  const bgClass =
    readingMode === 'sepia'
      ? 'bg-[#f4f1ea]'
      : readingMode === 'dark'
        ? 'bg-gray-900'
        : 'bg-gray-50 dark:bg-gray-900';

  const cardBgClass =
    readingMode === 'sepia'
      ? 'bg-[#faf8f3]'
      : readingMode === 'dark'
        ? 'bg-gray-800'
        : 'bg-white dark:bg-gray-800';

  const textClass =
    readingMode === 'sepia'
      ? 'text-[#5c4f3a]'
      : readingMode === 'dark'
        ? 'text-gray-200'
        : 'text-gray-800 dark:text-gray-200';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {/* Header */}
      <header className={`${headerBgClass} sticky top-0 z-10`}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 transition-all"
          >
            ← Home
          </Link>
          <h1 className={`text-xl font-bold ${headerTextClass}`}>
            Strong&apos;s Concordance
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
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center"
            onClick={() => setShowTOC(false)}
            onTouchEnd={() => setShowTOC(false)}
          >
            <div
              className={`${cardBgClass} max-h-[90vh] w-80 overflow-y-auto p-6 md:p-8 rounded-lg shadow-lg`}
              onClick={e => e.stopPropagation()}
              onTouchEnd={e => e.stopPropagation()}
            >
              <h2 className={`text-2xl font-bold ${headerTextClass} mb-4`}>
                Table of Contents
              </h2>

              {/* Quick Navigation */}
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => {
                    setTocSection('hebrew');
                    setActiveTab('hebrew');
                  }}
                  className="flex-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  aria-label="Jump to Hebrew"
                >
                  Hebrew
                </button>
                <button
                  onClick={() => {
                    setTocSection('greek');
                    setActiveTab('greek');
                  }}
                  className="flex-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  aria-label="Jump to Greek"
                >
                  Greek
                </button>
              </div>

              {/* Bible Link */}
              <Link
                href="/bible"
                className="block mb-4 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 px-3 py-2 rounded-lg text-xs font-semibold text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                Read Bible
              </Link>

              {/* Conditionally render sections */}
              {(tocSection === 'all' || tocSection === 'hebrew') && (
                <div className="mb-6" id="hebrew-section">
                  <h3 className={`text-lg font-semibold ${textClass} mb-2`}>
                    Hebrew Dictionary
                  </h3>
                  <p className={`text-sm ${textClass} opacity-75 mb-3`}>Jump to section:</p>
                  <div className="space-y-1">
                    {Object.keys(hebrewGroupedEntries).map(groupKey => (
                      <button
                        key={groupKey}
                        onClick={() => scrollToGroup(groupKey)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${textClass} hover:bg-gray-100 dark:hover:bg-gray-700`}
                      >
                        {groupKey} ({hebrewGroupedEntries[groupKey].length} entries)
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(tocSection === 'all' || tocSection === 'greek') && (
                <div id="greek-section">
                  <h3 className={`text-lg font-semibold ${textClass} mb-2`}>
                    Greek Dictionary
                  </h3>
                  <p className={`text-sm ${textClass} opacity-75 mb-3`}>Jump to section:</p>
                  <div className="space-y-1">
                    {Object.keys(greekGroupedEntries).map(groupKey => (
                      <button
                        key={groupKey}
                        onClick={() => scrollToGroup(groupKey)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${textClass} hover:bg-gray-100 dark:hover:bg-gray-700`}
                      >
                        {groupKey} ({greekGroupedEntries[groupKey].length} entries)
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className={`flex border-b ${readingMode === 'sepia' ? 'border-[#d4c5a3]' : 'border-gray-200 dark:border-gray-700'} mb-6`}>
          <button
            onClick={() => {
              setActiveTab('hebrew');
              setSearchQuery('');
            }}
            className={`flex-1 py-3 px-4 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400 ${
              activeTab === 'hebrew'
                ? 'bg-blue-600 text-white'
                : `${textClass} hover:bg-gray-100 dark:hover:bg-gray-700`
            }`}
          >
            Hebrew Dictionary ({Object.keys(hebrewDict).length} entries)
          </button>
          <button
            onClick={() => {
              setActiveTab('greek');
              setSearchQuery('');
            }}
            className={`flex-1 py-3 px-4 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400 ${
              activeTab === 'greek'
                ? 'bg-blue-600 text-white'
                : `${textClass} hover:bg-gray-100 dark:hover:bg-gray-700`
            }`}
          >
            Greek Dictionary ({Object.keys(greekDict).length} entries)
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by reference number, word, or definition..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-3 border ${readingMode === 'sepia' ? 'border-[#d4c5a3] bg-[#faf8f3]' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'} rounded-lg ${textClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {searchQuery && (
            <p className={`mt-2 text-sm ${textClass} opacity-75`}>
              Found {filteredEntries.length} entries
            </p>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedEntries).map(([groupKey, groupEntries]) => (
              <div key={groupKey} id={groupKey}>
                <h2 className={`text-2xl font-bold ${headerTextClass} mb-4 pb-2 border-b-2 border-blue-600`}>
                  {groupKey}
                </h2>
                <div className="space-y-4">
                  {groupEntries.map(([ref, entry]) => (
                    <div
                      key={ref}
                      className={`${cardBgClass} rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {ref}
                        </h3>
                        {entry.lemma && (
                          <span className={`text-2xl ${textClass}`}>
                            {entry.lemma}
                          </span>
                        )}
                      </div>

                      {(entry.xlit || entry.translit) && (
                        <p className={`text-sm ${textClass} opacity-75 mb-2`}>
                          <span className="font-semibold">Transliteration:</span>{' '}
                          {entry.xlit || entry.translit}
                        </p>
                      )}

                      {entry.pron && (
                        <p className={`text-sm ${textClass} opacity-75 mb-2`}>
                          <span className="font-semibold">Pronunciation:</span> {entry.pron}
                        </p>
                      )}

                      {entry.derivation && (
                        <p className={`text-sm ${textClass} mb-2`}>
                          <span className="font-semibold">Derivation:</span> {entry.derivation}
                        </p>
                      )}

                      <div className={`mt-3 pt-3 border-t ${readingMode === 'sepia' ? 'border-[#d4c5a3]' : 'border-gray-200 dark:border-gray-700'}`}>
                        <p className={`text-base ${textClass} mb-2`}>
                          <span className={`font-semibold ${textClass} opacity-75`}>
                            Strong&apos;s Definition:
                          </span>
                          <br />
                          {entry.strongs_def}
                        </p>
                      </div>

                      <div className="mt-2">
                        <p className={`text-base ${textClass}`}>
                          <span className={`font-semibold ${textClass} opacity-75`}>
                            KJV Translation:
                          </span>
                          <br />
                          {entry.kjv_def}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <p className={`${textClass} text-lg`}>
              No entries found matching &quot;{searchQuery}&quot;
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StrongsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f4f1ea] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <StrongsContent />
    </Suspense>
  );
}
