'use client';

import { useEffect, useState } from 'react';
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Strong's data
    const loadData = async () => {
      console.log('[StrongsModal] Loading data for word:', word, 'ref:', strongsRef);
      setLoading(true);
      setError(null);
      if (strongsRef) {
        try {
          const data = await lookupStrongs(strongsRef);
          console.log('[StrongsModal] Lookup result:', data);
          setHebrewEntry(data.hebrew || null);
          setGreekEntry(data.greek || null);
          if (data.error) {
            setError(data.error);
          }
          // Set active tab to whichever has data
          if (data.hebrew && !data.greek) {
            setActiveTab('hebrew');
          } else if (data.greek && !data.hebrew) {
            setActiveTab('greek');
          }
        } catch (err) {
          const errorMsg = `Failed to load Strong's data: ${err}`;
          console.error('[StrongsModal]', errorMsg);
          setError(errorMsg);
        }
      } else {
        setError('No Strong\'s reference provided');
      }
      setLoading(false);
    };
    loadData();
  }, [strongsRef, word]);

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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 60,
        padding: '16px',
      }}
      onClick={onClose}
      onTouchEnd={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        style={{
          background: 'var(--background)',
          padding: '20px',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '400px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        className="shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid rgba(128, 128, 128, 0.3)' }}>
          <h2 id="modal-title" style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'var(--foreground)' }}>
            {word}
          </h2>
          <button
            onClick={onClose}
            style={{ 
              background: 'none',
              border: 'none',
              fontSize: '28px',
              fontWeight: 'bold',
              cursor: 'pointer',
              padding: '0 8px',
              color: 'var(--foreground)',
              opacity: 0.6,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(128, 128, 128, 0.3)', marginTop: '16px' }}>
          <button
            onClick={() => setActiveTab('hebrew')}
            style={{
              flex: 1,
              padding: '12px 16px',
              fontWeight: '600',
              border: 'none',
              background: activeTab === 'hebrew' ? '#2563eb' : 'transparent',
              color: activeTab === 'hebrew' ? 'white' : 'var(--foreground)',
              cursor: hebrewEntry ? 'pointer' : 'not-allowed',
              opacity: hebrewEntry ? 1 : 0.5,
              transition: 'all 0.2s',
            }}
            disabled={!hebrewEntry}
            aria-label="Show Hebrew translation"
          >
            Hebrew {hebrewEntry && `(${strongsRef})`}
          </button>
          <button
            onClick={() => setActiveTab('greek')}
            style={{
              flex: 1,
              padding: '12px 16px',
              fontWeight: '600',
              border: 'none',
              background: activeTab === 'greek' ? '#2563eb' : 'transparent',
              color: activeTab === 'greek' ? 'white' : 'var(--foreground)',
              cursor: greekEntry ? 'pointer' : 'not-allowed',
              opacity: greekEntry ? 1 : 0.5,
              transition: 'all 0.2s',
            }}
            disabled={!greekEntry}
            aria-label="Show Greek translation"
          >
            Greek {greekEntry && `(${strongsRef})`}
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 0', overflowY: 'auto', flex: 1, minHeight: 0 }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '48px 0', textAlign: 'center' }}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '2px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '24px' }}>
                <p style={{ color: '#dc2626', fontWeight: '600', marginBottom: '8px', fontSize: '16px' }}>Error Loading Strong&apos;s Reference</p>
                <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px' }}>{error}</p>
                <p style={{ color: 'var(--foreground)', opacity: 0.6, fontSize: '12px' }}>
                  Check the browser console (F12) for more details.
                </p>
              </div>
            </div>
          ) : currentEntry ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {currentEntry.lemma && (
                <div>
                  <h3 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--foreground)', opacity: 0.6, textTransform: 'uppercase', marginBottom: '4px' }}>
                    Original Word
                  </h3>
                  <p style={{ fontSize: '24px', color: 'var(--foreground)', textAlign: 'center' }}>
                    {currentEntry.lemma}
                  </p>
                </div>
              )}

              {(currentEntry.xlit || currentEntry.translit) && (
                <div>
                  <h3 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--foreground)', opacity: 0.6, textTransform: 'uppercase', marginBottom: '4px' }}>
                    Transliteration
                  </h3>
                  <p style={{ fontSize: '18px', color: 'var(--foreground)', textAlign: 'center' }}>
                    {currentEntry.xlit || currentEntry.translit}
                  </p>
                </div>
              )}

              {currentEntry.pron && (
                <div>
                  <h3 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--foreground)', opacity: 0.6, textTransform: 'uppercase', marginBottom: '4px' }}>
                    Pronunciation
                  </h3>
                  <p style={{ fontSize: '18px', color: 'var(--foreground)', textAlign: 'center' }}>
                    {currentEntry.pron}
                  </p>
                </div>
              )}

              {currentEntry.derivation && (
                <div>
                  <h3 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--foreground)', opacity: 0.6, textTransform: 'uppercase', marginBottom: '4px' }}>
                    Derivation
                  </h3>
                  <p style={{ fontSize: '16px', color: 'var(--foreground)' }}>
                    {currentEntry.derivation}
                  </p>
                </div>
              )}

              <div>
                <h3 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--foreground)', opacity: 0.6, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Strong&apos;s Definition
                </h3>
                <p style={{ fontSize: '16px', color: 'var(--foreground)' }}>
                  {currentEntry.strongs_def}
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--foreground)', opacity: 0.6, textTransform: 'uppercase', marginBottom: '4px' }}>
                  KJV Translation
                </h3>
                <p style={{ fontSize: '16px', color: 'var(--foreground)' }}>
                  {currentEntry.kjv_def}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--foreground)', opacity: 0.6 }}>
              <p style={{ marginBottom: '8px' }}>No Strong&apos;s reference available for this word.</p>
              <p style={{ fontSize: '14px' }}>Strong&apos;s references are available for original Hebrew and Greek words.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(128, 128, 128, 0.3)', marginTop: '16px' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              background: '#2563eb',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#2563eb'}
            aria-label="Close modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
