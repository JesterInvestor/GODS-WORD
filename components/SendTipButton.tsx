"use client";

import { useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function SendTipButton() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('0.01');
  const [token, setToken] = useState('ETH');
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

  const handleSend = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // Try to use the SDK sendToken action if available.
      if (sdk.actions && typeof sdk.actions.sendToken === 'function') {
        // The exact payload shape may vary by SDK version/host.
        // We'll attempt a reasonable payload and let the host prompt the user.
        await sdk.actions.sendToken({
          // token: token (symbol may be accepted by host),
          amount: amount,
          token: token,
          // target: username or profile; hosts may require address/fid. Use username as best-effort.
          to: 'jesterinvestor',
        } as any);
        setMessage('Send token prompt shown in host.');
      } else if (sdk.actions && typeof sdk.actions.openUrl === 'function') {
        // Fallback: open the Warpcast profile page so the user can tip manually
        await sdk.actions.openUrl({ url: 'https://warpcast.com/jesterinvestor' } as any);
        setMessage('Opened profile page for manual tip.');
      } else {
        // As final fallback, open external URL
        window.open('https://warpcast.com/jesterinvestor', '_blank');
        setMessage('Opened profile page for manual tip.');
      }
    } catch (e: unknown) {
      const err = e as Error;
      setMessage('Failed to initiate tip: ' + (err.message || String(err)));
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
        title="Send tip to @jesterinvestor"
      >
        💰
      </button>

      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div className="fixed inset-0 bg-black/40" onClick={closeModal} />

          <div className="relative z-10 w-full max-w-md rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Send a tip to @jesterinvestor</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Choose an amount and token to tip. Your Farcaster host will prompt you to confirm.</p>

            <div className="mb-3 flex gap-2">
              <input
                className="w-1/2 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                min="0"
                step="0.0001"
                aria-label="Amount"
              />

              <select
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-1/2 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                aria-label="Token"
              >
                <option>ETH</option>
                <option>USDC</option>
                <option>USDT</option>
              </select>
            </div>

            {message && <div className="mb-3 text-sm text-gray-700 dark:text-gray-200">{message}</div>}

            <div className="flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700">Cancel</button>
              <button onClick={handleSend} disabled={loading} className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm disabled:opacity-60">{loading ? 'Sending…' : 'Send Tip'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
