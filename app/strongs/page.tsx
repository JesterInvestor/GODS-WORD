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
  const [activeTab, setActiveTab] = useState<'hebrew' | 'greek'>(testament === 'greek' ? 'greek' : 'hebrew');
  const [selectedEntry, setSelectedEntry] = useState<{ ref: string; entry: StrongsEntry } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [hebrew, greek] = await Promise.all([
        loadHebrewDictionary(),
        loadGreekDictionary()
      ]);
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

  const scrollToGroup = (groupKey: string) => {
    const element = document.getElementById(groupKey);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setShowTOC(false);
    }
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
          <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center" onClick={() => setShowTOC(false)} onTouchEnd={() => setShowTOC(false)}>
            <div className="bg-gray-100 dark:bg-gray-900 max-h-[90vh] w-80 overflow-y-auto p-6 md:p-8 rounded-lg shadow-lg" onClick={e => e.stopPropagation()} onTouchEnd={e => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Table of Contents
              </h2>
              
              {/* Quick Navigation */}
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => {
                    setActiveTab('hebrew');
                    setSearchQuery('');
                  }}
                  className="flex-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  aria-label="Switch to Hebrew"
                >
                  Hebrew
                </button>
                <button
                  onClick={() => {
                    setActiveTab('greek');
                    setSearchQuery('');
                  }}
                  className="flex-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  aria-label="Switch to Greek"
                >
                  Greek
                </button>
              </div>
              
              {/* Bible Link */}
              <Link
                href="/bible"
                className="block mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                Read Bible
              </Link>
              
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {activeTab === 'hebrew' ? 'Hebrew Dictionary' : 'Greek Dictionary'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Jump to section:
              </p>
              <div className="space-y-1">
                {Object.keys(groupedEntries).map(groupKey => (
                  <button
                    key={groupKey}
                    onClick={() => scrollToGroup(groupKey)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                  >
                    {groupKey} ({groupedEntries[groupKey].length} entries)
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => {
              setActiveTab('hebrew');
              setSearchQuery('');
            }}
            className={`flex-1 py-3 px-4 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400 ${
              activeTab === 'hebrew'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
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
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b-2 border-blue-600">
                  {groupKey}
                </h2>
                <div className="space-y-4">
                  {groupEntries.map(([ref, entry]) => (
                    <div
                      key={ref}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {ref}
                        </h3>
                        {entry.lemma && (
                          <span className="text-2xl text-gray-800 dark:text-gray-200">
                            {entry.lemma}
                          </span>
                        )}
                      </div>

                      {(entry.xlit || entry.translit) && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span className="font-semibold">Transliteration:</span> {entry.xlit || entry.translit}
                        </p>
                      )}

                      {entry.pron && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span className="font-semibold">Pronunciation:</span> {entry.pron}
                        </p>
                      )}

                      {entry.derivation && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          <span className="font-semibold">Derivation:</span> {entry.derivation}
                        </p>
                      )}

                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-base text-gray-800 dark:text-gray-200 mb-2">
                          <span className="font-semibold text-gray-700 dark:text-gray-400">Strong&apos;s Definition:</span><br />
                          {entry.strongs_def}
                        </p>
                      </div>

                      <div className="mt-2">
                        <p className="text-base text-gray-800 dark:text-gray-200">
                          <span className="font-semibold text-gray-700 dark:text-gray-400">KJV Translation:</span><br />
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
            <p className="text-gray-600 dark:text-gray-400 text-lg">
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
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <StrongsContent />
    </Suspense>
  );
}
