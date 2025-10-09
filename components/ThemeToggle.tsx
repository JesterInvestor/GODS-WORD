'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all opacity-50"
        disabled
        aria-label="Loading theme"
      >
        🌓
      </button>
    );
  }

  const themes = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'sepia', label: 'Sepia', icon: '📖' },
  ];

  const currentThemeIndex = themes.findIndex(t => t.value === theme);
  const nextTheme = themes[(currentThemeIndex + 1) % themes.length];

  return (
    <button
      onClick={() => setTheme(nextTheme.value)}
      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
      aria-label={`Switch to ${nextTheme.label} mode`}
      title={`Current: ${themes[currentThemeIndex]?.label || 'System'} - Click for ${nextTheme.label}`}
    >
      {nextTheme.icon}
    </button>
  );
}
