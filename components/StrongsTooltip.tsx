'use client';

import { useEffect, useState, useRef } from 'react';
import { StrongsEntry, lookupStrongs } from '@/lib/strongs';

interface StrongsTooltipProps {
  word: string;
  strongsRef: string;
  anchorElement: HTMLElement;
  onClose: () => void;
}

export default function StrongsTooltip({ word, strongsRef, anchorElement, onClose }: StrongsTooltipProps) {
  const [hebrewEntry, setHebrewEntry] = useState<StrongsEntry | null>(null);
  const [greekEntry, setGreekEntry] = useState<StrongsEntry | null>(null);
  const [activeTab, setActiveTab] = useState<'hebrew' | 'greek'>('hebrew');
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Strong's data
    const loadData = async () => {
      setLoading(true);
      if (strongsRef) {
        const data = await lookupStrongs(strongsRef);
        setHebrewEntry(data.hebrew || null);
        setGreekEntry(data.greek || null);
        // Set active tab to whichever has data
        if (data.hebrew && !data.greek) {
          setActiveTab('hebrew');
        } else if (data.greek && !data.hebrew) {
          setActiveTab('greek');
        }
      }
      setLoading(false);
    };
    loadData();
  }, [strongsRef]);

  useEffect(() => {
    // Calculate position relative to anchor element
    const calculatePosition = () => {
      if (!anchorElement || !tooltipRef.current) return;

      const anchorRect = anchorElement.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Default: position below the word
      let top = anchorRect.bottom + window.scrollY + 8;
      let left = anchorRect.left + window.scrollX;

      // Adjust if tooltip would go off-screen horizontally
      if (left + tooltipRect.width > viewportWidth) {
        left = viewportWidth - tooltipRect.width - 16;
      }
      if (left < 16) {
        left = 16;
      }

      // If tooltip would go off-screen vertically, position above the word instead
      if (anchorRect.bottom + tooltipRect.height + 8 > viewportHeight) {
        top = anchorRect.top + window.scrollY - tooltipRect.height - 8;
      }

      setPosition({ top, left });
    };

    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition);

    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition);
    };
  }, [anchorElement, loading]);

  useEffect(() => {
    // Handle ESC key
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const currentEntry = activeTab === 'hebrew' ? hebrewEntry : greekEntry;

  return (
    <div
      ref={tooltipRef}
      className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 w-[400px] max-w-[90vw] max-h-[70vh] overflow-hidden"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          {word}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* Tabs */}
      {(hebrewEntry || greekEntry) && (
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {hebrewEntry && (
            <button
              onClick={() => setActiveTab('hebrew')}
              className={`flex-1 py-2 px-3 text-sm font-semibold ${
                activeTab === 'hebrew'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Hebrew {strongsRef && `(${strongsRef})`}
            </button>
          )}
          {greekEntry && (
            <button
              onClick={() => setActiveTab('greek')}
              className={`flex-1 py-2 px-3 text-sm font-semibold ${
                activeTab === 'greek'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Greek {strongsRef && `(${strongsRef})`}
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4 overflow-y-auto max-h-[calc(70vh-120px)]">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : currentEntry ? (
          <div className="space-y-3 text-sm">
            {currentEntry.lemma && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Original Word
                </h4>
                <p className="text-xl text-gray-800 dark:text-gray-200 mt-1">
                  {currentEntry.lemma}
                </p>
              </div>
            )}

            {(currentEntry.xlit || currentEntry.translit) && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Transliteration
                </h4>
                <p className="text-base text-gray-800 dark:text-gray-200 mt-1">
                  {currentEntry.xlit || currentEntry.translit}
                </p>
              </div>
            )}

            {currentEntry.pron && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Pronunciation
                </h4>
                <p className="text-base text-gray-800 dark:text-gray-200 mt-1">
                  {currentEntry.pron}
                </p>
              </div>
            )}

            {currentEntry.derivation && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Derivation
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {currentEntry.derivation}
                </p>
              </div>
            )}

            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Strong&apos;s Definition
              </h4>
              <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                {currentEntry.strongs_def}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                KJV Translation
              </h4>
              <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                {currentEntry.kjv_def}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400 text-sm">
            <p>No Strong&apos;s reference available for this word.</p>
          </div>
        )}
      </div>
    </div>
  );
}
