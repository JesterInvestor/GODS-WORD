"use client";

import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function AddMiniAppButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAdd = async () => {
    setLoading(true);
    setMessage(null);
    try {
      if (!sdk.actions || !sdk.actions.addMiniApp) {
        throw new Error('addMiniApp action not available');
      }
      await sdk.actions.addMiniApp();
      setMessage('Mini App prompt shown.');
      // Clear message after a short delay
      setTimeout(() => setMessage(null), 3000);
    } catch (e: unknown) {
      const err = e as Error;
      setMessage('Failed to add Mini App: ' + (err.message || String(err)));
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Also trigger add when user presses the '+' key (global shortcut)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      try {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;
        if (e.key === '+') {
          handleAdd();
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={handleAdd}
        aria-label="Add Mini App"
        className="control-button hover:scale-105 transition-transform mr-2"
        title="Add Mini App"
        disabled={loading}
      >
        ➕
      </button>

      {/* Accessible live region for brief feedback */}
      <div aria-live="polite" className="sr-only">
        {message}
      </div>
    </div>
  );
}
