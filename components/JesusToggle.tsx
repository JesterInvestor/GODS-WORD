"use client";

import { useEffect, useState } from 'react';

export default function JesusToggle() {
  const KEY = 'jesusWordsEnabled';
  const [enabled, setEnabled] = useState<boolean>(true);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v !== null) setEnabled(v === 'true');
      else setEnabled(true);
    } catch (e) {
      setEnabled(true);
    }
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    try {
      localStorage.setItem(KEY, String(next));
    } catch {}
    try {
      window.dispatchEvent(new CustomEvent('jesusWordsEnabledChanged', { detail: next }));
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      className="control-button hover:scale-105 transition-transform mr-2"
      title={enabled ? "Jesus's words highlighting enabled" : "Jesus's words highlighting disabled"}
      aria-pressed={enabled}
    >
      J
    </button>
  );
}
