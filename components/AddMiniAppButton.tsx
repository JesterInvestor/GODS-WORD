"use client";

import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function AddMiniAppButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const openModal = () => {
    setMessage(null);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setLoading(false);
    setMessage(null);
  };

  // Open the modal when the user presses the '+' key (global shortcut)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      try {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName;
        // ignore when typing in inputs/textareas or contenteditable
        if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;
        if (e.key === '+') {
          openModal();
        }
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleAdd = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // Call the Farcaster SDK action to prompt the user to add this Mini App
      if (!sdk.actions || !sdk.actions.addMiniApp) {
        throw new Error('addMiniApp action not available');
      }
      await sdk.actions.addMiniApp();
      setMessage('Mini App added (or prompt shown).');
    } catch (e: unknown) {
      const err = e as Error;
      setMessage('Failed to add Mini App: ' + (err.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={openModal}
        aria-haspopup="dialog"
        className="control-button hover:scale-105 transition-transform mr-2"
        title="Add Mini App"
      >
        ➕
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
        >
          <div className="fixed inset-0 bg-black/40" onClick={closeModal} />

          <div className="relative z-10 w-full max-w-md rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Add GOD&apos;S WORD Mini App</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              This will prompt your Farcaster client to add this Mini App to your collection and enable notifications.
            </p>

            {message && (
              <div className="mb-3 text-sm text-gray-700 dark:text-gray-200">{message}</div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleAdd}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-60"
              >
                {loading ? 'Adding…' : 'Add Mini App'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
