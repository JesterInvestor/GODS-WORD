"use client";

import { useEffect, useState } from 'react';

export default function MenuButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onChange = (e: Event) => {
      try {
        const d = (e as CustomEvent).detail;
        setOpen(Boolean(d));
      } catch {
        // if no detail, just ignore
      }
    };
    window.addEventListener('tocChanged', onChange);
    return () => window.removeEventListener('tocChanged', onChange);
  }, []);

  const toggle = () => {
    try {
      window.dispatchEvent(new CustomEvent('toggleTOC'));
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      className={`control-button hover:scale-105 transition-transform mr-2 ${open ? 'active' : ''}`}
      aria-pressed={open}
      title={open ? 'Close menu' : 'Open menu'}
    >
      ☰
    </button>
  );
}
