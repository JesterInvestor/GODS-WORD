"use client";

import { useEffect, useState } from "react";

export default function GlobalPanels() {
  const [showTOC, setShowTOC] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const onToggleTOC = () => setShowTOC(s => !s);
    const onToggleSettings = () => setShowSettings(s => !s);

    window.addEventListener('toggleTOC', onToggleTOC);
    window.addEventListener('toggleSettings', onToggleSettings);

    return () => {
      window.removeEventListener('toggleTOC', onToggleTOC);
      window.removeEventListener('toggleSettings', onToggleSettings);
    };
  }, []);

  // keep the control buttons in sync with these panels
  useEffect(() => {
    try {
      window.dispatchEvent(new CustomEvent('tocChanged', { detail: showTOC }));
    } catch {}
  }, [showTOC]);

  useEffect(() => {
    try {
      window.dispatchEvent(new CustomEvent('settingsChanged', { detail: showSettings }));
    } catch {}
  }, [showSettings]);

  if (!showTOC && !showSettings) return null;

  return (
    <>
      {showTOC && (
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
            <ul className="text-sm list-disc list-inside space-y-1">
              <li>Old Testament</li>
              <li>New Testament</li>
              <li>Strong&apos;s Concordance</li>
            </ul>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed right-4 top-20 z-40 w-80 max-w-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <strong className="text-sm">Settings</strong>
            <button
              aria-label="Close settings"
              onClick={() => setShowSettings(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-200 space-y-2">
            <div>Font size: (use reader page for full options)</div>
            <div>Sepia reading mode: enabled</div>
            <div>Strong&apos;s toggle: S#</div>
          </div>
        </div>
      )}
    </>
  );
}
