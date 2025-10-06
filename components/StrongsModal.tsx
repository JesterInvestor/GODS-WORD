'use client';

import { useEffect, useState, useRef } from 'react';
import { StrongsEntry, lookupStrongs } from '@/lib/strongs';

interface StrongsModalProps {
  word: string;
  strongsRef?: string;
  onClose: () => void;
}

export default function StrongsModal({ word, strongsRef, onClose }: StrongsModalProps) {
  const [hebrewEntry, setHebrewEntry] = useState<StrongsEntry | null>(null);
  const [greekEntry, setGreekEntry] = useState<StrongsEntry | null>(null);
  const [activeTab, setActiveTab] = useState<'hebrew' | 'greek'>('hebrew');
  const [loading, setLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Log modal opening
    console.log('[StrongsModal] Modal opened for word:', word, 'ref:', strongsRef);
    
    // Store the previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement;
    
    // Prevent body scroll when modal is open (iOS Safari fix)
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    // Load Strong's data
    const loadData = async () => {
      setLoading(true);
      console.log('[StrongsModal] Loading data for:', strongsRef);
      if (strongsRef) {
        const data = await lookupStrongs(strongsRef);
        setHebrewEntry(data.hebrew || null);
        setGreekEntry(data.greek || null);
        console.log('[StrongsModal] Data loaded:', { hasHebrew: !!data.hebrew, hasGreek: !!data.greek });
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

    // Cleanup function
    return () => {
      console.log('[StrongsModal] Modal closed');
      // Restore body scroll
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = '';
      
      // Restore focus to the previously focused element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [strongsRef, word]);

  useEffect(() => {
    // Handle ESC key
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('[StrongsModal] ESC key pressed, closing modal');
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    // Focus the modal when it opens for accessibility
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  const currentEntry = activeTab === 'hebrew' ? hebrewEntry : greekEntry;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('[StrongsModal] Backdrop clicked');
    onClose();
  };

  const handleBackdropTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    console.log('[StrongsModal] Backdrop touched');
    e.preventDefault();
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleModalTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 z-[60] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onTouchEnd={handleBackdropTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-live="polite"
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={handleModalClick}
        onTouchEnd={handleModalTouchEnd}
        tabIndex={-1}
        style={{ touchAction: 'pan-y' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-800 dark:text-white">
            {word}
          </h2>
          <button
            onClick={(e) => {
              console.log('[StrongsModal] Close button clicked');
              e.stopPropagation();
              onClose();
            }}
            onTouchEnd={(e) => {
              console.log('[StrongsModal] Close button touched');
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded transition-all"
            aria-label="Close modal"
            style={{ touchAction: 'manipulation' }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('hebrew')}
            className={`flex-1 py-3 px-4 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400 ${
              activeTab === 'hebrew'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
            disabled={!hebrewEntry}
            aria-label="Show Hebrew translation"
          >
            Hebrew {hebrewEntry && `(${strongsRef})`}
          </button>
          <button
            onClick={() => setActiveTab('greek')}
            className={`flex-1 py-3 px-4 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400 ${
              activeTab === 'greek'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
            disabled={!greekEntry}
            aria-label="Show Greek translation"
          >
            Greek {greekEntry && `(${strongsRef})`}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : currentEntry ? (
            <div className="space-y-4">
              {currentEntry.lemma && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Original Word
                  </h3>
                  <p className="text-2xl text-gray-800 dark:text-gray-200 mt-1">
                    {currentEntry.lemma}
                  </p>
                </div>
              )}

              {(currentEntry.xlit || currentEntry.translit) && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Transliteration
                  </h3>
                  <p className="text-lg text-gray-800 dark:text-gray-200 mt-1">
                    {currentEntry.xlit || currentEntry.translit}
                  </p>
                </div>
              )}

              {currentEntry.pron && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Pronunciation
                  </h3>
                  <p className="text-lg text-gray-800 dark:text-gray-200 mt-1">
                    {currentEntry.pron}
                  </p>
                </div>
              )}

              {currentEntry.derivation && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Derivation
                  </h3>
                  <p className="text-base text-gray-700 dark:text-gray-300 mt-1">
                    {currentEntry.derivation}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Strong&apos;s Definition
                </h3>
                <p className="text-base text-gray-800 dark:text-gray-200 mt-1">
                  {currentEntry.strongs_def}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  KJV Translation
                </h3>
                <p className="text-base text-gray-800 dark:text-gray-200 mt-1">
                  {currentEntry.kjv_def}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">
              <p>No Strong&apos;s reference available for this word.</p>
              <p className="text-sm mt-2">Strong&apos;s references are available for original Hebrew and Greek words.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="mb-3 text-xs text-gray-600 dark:text-gray-400">
            <p className="font-semibold mb-1">Tap these words in the Bible text to see Strong&apos;s references:</p>
            <p className="flex flex-wrap gap-1">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">God</span>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">LORD</span>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">Jesus</span>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">Christ</span>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">love</span>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">grace</span>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">faith</span>
              <span className="text-gray-500">and more...</span>
            </p>
          </div>
          <button
            onClick={(e) => {
              console.log('[StrongsModal] Close button (footer) clicked');
              e.stopPropagation();
              onClose();
            }}
            onTouchEnd={(e) => {
              console.log('[StrongsModal] Close button (footer) touched');
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all"
            aria-label="Close modal"
            style={{ touchAction: 'manipulation' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
