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
  const [activeTab, setActiveTab] = useState<'hebrew' | 'greek'>(
    testament === 'greek' ? 'greek' : 'hebrew'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [tocFilter, setTocFilter] = useState('');
  const [activeSection, setActiveSection] = useState<string>('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const readingMode = 'sepia'; // Fixed to sepia mode to match Bible page

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

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Show back to top button when scrolled down
      setShowBackToTop(window.scrollY > 500);

      // Find which section is currently in view
      const sections = document.querySelectorAll('[data-section]');
      let currentSection = '';
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // Check if section is in viewport (with some offset for header)
        if (rect.top <= 150 && rect.bottom >= 150) {
          currentSection = section.getAttribute('data-section') || '';
        }
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setShowTOC(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter TOC groups based on filter input
  const filteredTocGroups = Object.keys(groupedEntries).filter(groupKey =>
    groupKey.toLowerCase().includes(tocFilter.toLowerCase())
  );

  // Dynamic styling based on reading mode (matching Bible page)
  const bgClass =
    readingMode === 'sepia'
      ? 'bg-[#f4f1ea]'
      : readingMode === 'dark'
        ? 'bg-gray-900'
        : 'bg-gray-50 dark:bg-gray-900';

  const headerBgClass =
    readingMode === 'sepia'
      ? 'bg-[#faf8f3] shadow-sm'
      : readingMode === 'dark'
        ? 'bg-gray-800 shadow-sm'
        : 'bg-white dark:bg-gray-800 shadow-sm';

  const cardBgClass =
    readingMode === 'sepia'
      ? 'bg-[#faf8f3]'
      : readingMode === 'dark'
        ? 'bg-gray-800'
        : 'bg-white dark:bg-gray-800';

  const headerTextClass =
    readingMode === 'sepia'
      ? 'text-[#5c4f3a]'
      : readingMode === 'dark'
        ? 'text-white'
        : 'text-gray-800 dark:text-white';

  const textClass =
    readingMode === 'sepia'
      ? 'text-[#5c4f3a]'
      : readingMode === 'dark'
        ? 'text-gray-200'
        : 'text-gray-800 dark:text-gray-200';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {/* Header */}
      <header className={`${headerBgClass} sticky top-0 z-30`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 transition-all"
            aria-label="Go to home page"
          >
            ← Home
          </Link>
          <h1 className={`text-xl md:text-2xl font-bold ${headerTextClass}`}>
            Strong&apos;s Concordance
          </h1>
          <button
            onClick={() => setShowTOC(!showTOC)}
            className="md:hidden bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            aria-label={showTOC ? 'Close table of contents' : 'Open table of contents'}
            aria-expanded={showTOC}
          >
            {showTOC ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex relative">
        {/* Desktop Sidebar TOC */}
        <aside 
          className={`hidden md:block w-72 ${cardBgClass} border-r border-gray-200 dark:border-gray-700 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto`}
          role="navigation"
          aria-label="Table of contents navigation"
        >
          <div className="p-4 space-y-4">
            <h2 className={`text-xl font-bold ${headerTextClass} mb-2`}>
              Table of Contents
            </h2>

            {/* Quick Navigation */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveTab('hebrew');
                  setSearchQuery('');
                  setTocFilter('');
                }}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  activeTab === 'hebrew'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200'
                }`}
                aria-label="Switch to Hebrew dictionary"
                aria-pressed={activeTab === 'hebrew'}
              >
                Hebrew
              </button>
              <button
                onClick={() => {
                  setActiveTab('greek');
                  setSearchQuery('');
                  setTocFilter('');
                }}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  activeTab === 'greek'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200'
                }`}
                aria-label="Switch to Greek dictionary"
                aria-pressed={activeTab === 'greek'}
              >
                Greek
              </button>
            </div>

            {/* TOC Filter */}
            <div>
              <label htmlFor="toc-filter" className="sr-only">
                Filter table of contents
              </label>
              <input
                id="toc-filter"
                type="text"
                placeholder="Filter sections..."
                value={tocFilter}
                onChange={e => setTocFilter(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg ${cardBgClass} ${textClass} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-label="Filter table of contents sections"
              />
            </div>

            {/* Bible Link */}
            <Link
              href="/bible"
              className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              aria-label="Go to Bible reader"
            >
              Read Bible
            </Link>

            {/* Section List */}
            <div>
              <h3 className={`text-sm font-semibold ${textClass} mb-2`}>
                {activeTab === 'hebrew' ? 'Hebrew Dictionary' : 'Greek Dictionary'}
              </h3>
              <nav aria-label="Dictionary sections">
                <ul className="space-y-1">
                  {filteredTocGroups.map(groupKey => (
                    <li key={groupKey}>
                      <button
                        onClick={() => scrollToGroup(groupKey)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          activeSection === groupKey
                            ? 'bg-blue-600 text-white font-semibold'
                            : `${textClass} hover:bg-gray-100 dark:hover:bg-gray-700`
                        }`}
                        aria-label={`Jump to section ${groupKey}`}
                        aria-current={activeSection === groupKey ? 'true' : 'false'}
                      >
                        {groupKey}
                        <span className="text-xs ml-1 opacity-75">
                          ({groupedEntries[groupKey].length})
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              {tocFilter && filteredTocGroups.length === 0 && (
                <p className={`text-sm ${textClass} opacity-75 mt-2`}>
                  No matching sections
                </p>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Overlay TOC */}
        {showTOC && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
            onClick={() => setShowTOC(false)}
            onTouchEnd={() => setShowTOC(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Table of contents"
          >
            <div
              className={`${cardBgClass} max-h-[90vh] w-80 overflow-y-auto p-6 rounded-lg shadow-lg`}
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
                    setActiveTab('hebrew');
                    setSearchQuery('');
                    setTocFilter('');
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    activeTab === 'hebrew'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200'
                  }`}
                  aria-label="Switch to Hebrew dictionary"
                  aria-pressed={activeTab === 'hebrew'}
                >
                  Hebrew
                </button>
                <button
                  onClick={() => {
                    setActiveTab('greek');
                    setSearchQuery('');
                    setTocFilter('');
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    activeTab === 'greek'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200'
                  }`}
                  aria-label="Switch to Greek dictionary"
                  aria-pressed={activeTab === 'greek'}
                >
                  Greek
                </button>
              </div>

              {/* TOC Filter */}
              <div className="mb-4">
                <label htmlFor="toc-filter-mobile" className="sr-only">
                  Filter table of contents
                </label>
                <input
                  id="toc-filter-mobile"
                  type="text"
                  placeholder="Filter sections..."
                  value={tocFilter}
                  onChange={e => setTocFilter(e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg ${cardBgClass} ${textClass} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  aria-label="Filter table of contents sections"
                />
              </div>

              {/* Bible Link */}
              <Link
                href="/bible"
                className="block mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                aria-label="Go to Bible reader"
              >
                Read Bible
              </Link>

              <h3 className={`text-lg font-semibold ${textClass} mb-2`}>
                {activeTab === 'hebrew' ? 'Hebrew Dictionary' : 'Greek Dictionary'}
              </h3>
              <nav aria-label="Dictionary sections">
                <ul className="space-y-1">
                  {filteredTocGroups.map(groupKey => (
                    <li key={groupKey}>
                      <button
                        onClick={() => scrollToGroup(groupKey)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          activeSection === groupKey
                            ? 'bg-blue-600 text-white font-semibold'
                            : `${textClass} hover:bg-gray-100 dark:hover:bg-gray-700`
                        }`}
                        aria-label={`Jump to section ${groupKey}`}
                        aria-current={activeSection === groupKey ? 'true' : 'false'}
                      >
                        {groupKey}
                        <span className="text-xs ml-1 opacity-75">
                          ({groupedEntries[groupKey].length})
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              {tocFilter && filteredTocGroups.length === 0 && (
                <p className={`text-sm ${textClass} opacity-75 mt-2`}>
                  No matching sections
                </p>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-6 py-6 max-w-4xl">
          {/* Tabs - Mobile Only */}
          <div className="md:hidden flex border-b border-gray-200 dark:border-gray-700 mb-6">
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
              aria-label="Switch to Hebrew dictionary"
              aria-pressed={activeTab === 'hebrew'}
            >
              Hebrew ({Object.keys(hebrewDict).length})
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
              aria-label="Switch to Greek dictionary"
              aria-pressed={activeTab === 'greek'}
            >
              Greek ({Object.keys(greekDict).length})
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <label htmlFor="entry-search" className="sr-only">
              Search dictionary entries
            </label>
            <input
              id="entry-search"
              type="text"
              placeholder="Search by reference number, word, or definition..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg ${cardBgClass} ${textClass} focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm`}
              aria-label="Search dictionary entries by reference, word, or definition"
            />
            {searchQuery && (
              <p className={`mt-2 text-sm ${textClass} opacity-75`} role="status">
                Found {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
              </p>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center py-12" role="status" aria-live="polite">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="sr-only">Loading dictionary entries...</span>
            </div>
          ) : (
            <div className="space-y-10">
              {Object.entries(groupedEntries).map(([groupKey, groupEntries]) => (
                <section key={groupKey} id={groupKey} data-section={groupKey} className="scroll-mt-20">
                  <h2 className={`text-3xl font-bold ${headerTextClass} mb-6 pb-3 border-b-2 border-blue-600`}>
                    {groupKey}
                  </h2>
                  <div className="space-y-6">
                    {groupEntries.map(([ref, entry]) => (
                      <article
                        key={ref}
                        className={`${cardBgClass} rounded-lg p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {ref}
                          </h3>
                          {entry.lemma && (
                            <span className={`text-3xl ${textClass} font-serif`}>
                              {entry.lemma}
                            </span>
                          )}
                        </div>

                        {(entry.xlit || entry.translit) && (
                          <div className="mb-3">
                            <span className={`text-xs font-semibold ${textClass} opacity-75 uppercase tracking-wide`}>
                              Transliteration
                            </span>
                            <p className={`text-base ${textClass} mt-1`}>
                              {entry.xlit || entry.translit}
                            </p>
                          </div>
                        )}

                        {entry.pron && (
                          <div className="mb-3">
                            <span className={`text-xs font-semibold ${textClass} opacity-75 uppercase tracking-wide`}>
                              Pronunciation
                            </span>
                            <p className={`text-base ${textClass} mt-1`}>
                              {entry.pron}
                            </p>
                          </div>
                        )}

                        {entry.derivation && (
                          <div className="mb-4">
                            <span className={`text-xs font-semibold ${textClass} opacity-75 uppercase tracking-wide`}>
                              Derivation
                            </span>
                            <p className={`text-base ${textClass} mt-1 leading-relaxed`}>
                              {entry.derivation}
                            </p>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                          <div>
                            <span className={`text-xs font-semibold ${textClass} opacity-75 uppercase tracking-wide`}>
                              Strong&apos;s Definition
                            </span>
                            <p className={`text-base ${textClass} mt-1 leading-relaxed`}>
                              {entry.strongs_def}
                            </p>
                          </div>

                          <div>
                            <span className={`text-xs font-semibold ${textClass} opacity-75 uppercase tracking-wide`}>
                              KJV Translation
                            </span>
                            <p className={`text-base ${textClass} mt-1 leading-relaxed`}>
                              {entry.kjv_def}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {!loading && filteredEntries.length === 0 && (
            <div className="text-center py-12" role="status">
              <p className={`${textClass} text-lg mb-4`}>
                No entries found matching &quot;{searchQuery}&quot;
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-4 py-2"
                aria-label="Clear search query"
              >
                Clear search
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all z-20"
          aria-label="Back to top"
          title="Back to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function StrongsPage() {
  // Match the sepia theme for consistency
  const readingMode = 'sepia';
  const bgClass =
    readingMode === 'sepia'
      ? 'bg-[#f4f1ea]'
      : readingMode === 'dark'
        ? 'bg-gray-900'
        : 'bg-gray-50 dark:bg-gray-900';

  return (
    <Suspense
      fallback={
        <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <StrongsContent />
    </Suspense>
  );
}
