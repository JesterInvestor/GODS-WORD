"use client";

import { useEffect, useState } from 'react';

export default function SettingsButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onChange = (e: Event) => {
      try {
        const d = (e as CustomEvent).detail;
        setOpen(Boolean(d));
      } catch {
        // ignore
      }
    };
    window.addEventListener('settingsChanged', onChange);
    return () => window.removeEventListener('settingsChanged', onChange);
  }, []);

  const toggle = () => {
    try {
      window.dispatchEvent(new CustomEvent('toggleSettings'));
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      className={`control-button hover:scale-105 transition-transform mr-2 ${open ? 'active' : ''}`}
      aria-pressed={open}
      title={open ? 'Close settings' : 'Open settings'}
    >
      ⚙️
    </button>
  );
}
