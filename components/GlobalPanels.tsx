"use client";

import { useEffect, useState } from "react";

export default function GlobalPanels() {
  const [showTOC, setShowTOC] = useState(false);

  useEffect(() => {
    const isAllowedRoute = () => {
      try {
        const p = window.location.pathname || '/';
        return p.startsWith('/bible') || p.startsWith('/strongs');
      } catch {
        return false;
      }
    };

    const onToggleTOC = () => {
      if (isAllowedRoute()) setShowTOC(s => !s);
    };

    window.addEventListener('toggleTOC', onToggleTOC);

    return () => {
      window.removeEventListener('toggleTOC', onToggleTOC);
    };
  }, []);

  // keep the control buttons in sync with this panel
  useEffect(() => {
    try {
      window.dispatchEvent(new CustomEvent('tocChanged', { detail: showTOC }));
    } catch {}
  }, [showTOC]);

  if (!showTOC) return null;

  return (
    <div className="fixed right-4 top-20 z-40 w-80 max-w-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <strong className="text-sm">Menu</strong>
        <button
          aria-label="Close menu"
          onClick={() => setShowTOC(false)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-200">
        <p className="mb-2">Quick links</p>
        <ul className="text-sm list-disc list-inside space-y-1 mb-3">
          <li>Old Testament</li>
          <li>New Testament</li>
          <li>Strong&apos;s Concordance</li>
        </ul>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-1">
          <div className="text-xs text-gray-600 dark:text-gray-300">Sepia reading mode: <span className="font-semibold">enabled</span></div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Strong&apos;s toggle: <span className="font-semibold">S#</span></div>
        </div>
      </div>
    </div>
  );
}
