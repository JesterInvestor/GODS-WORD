"use client";

import { useEffect, useState } from 'react';

export default function StrongsToggle() {
  const KEY = 'strongsEnabled';
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
    // Notify other components in the same window
    try {
      window.dispatchEvent(new CustomEvent('strongsEnabledChanged', { detail: next }));
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      className="control-button hover:scale-105 transition-transform mr-2"
      title={enabled ? "Strong's references enabled" : "Strong's references disabled"}
      aria-pressed={enabled}
    >
      S#
    </button>
  );
}
