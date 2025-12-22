"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import AddMiniAppButton from '@/components/AddMiniAppButton';
import StrongsToggle from '@/components/StrongsToggle';
import JesusToggle from '@/components/JesusToggle';
import MenuButton from '@/components/MenuButton';
import SettingsButton from '@/components/SettingsButton';
import ShareButton from '@/components/ShareButton';

export default function ControlBar() {
  const pathname = usePathname() || '/';
  const isAllowed = pathname.startsWith('/bible') || pathname.startsWith('/strongs');

  return (
    <div
      className="fixed right-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 z-50 flex items-center space-x-2"
      style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
    >
      <AddMiniAppButton />
      <ShareButton />
      <StrongsToggle />
      <JesusToggle />
      {isAllowed && <MenuButton />}
      {isAllowed && <SettingsButton />}
    </div>
  );
}
