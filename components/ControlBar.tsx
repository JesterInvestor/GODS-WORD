"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import AddMiniAppButton from '@/components/AddMiniAppButton';
import StrongsToggle from '@/components/StrongsToggle';
import JesusToggle from '@/components/JesusToggle';
import MenuButton from '@/components/MenuButton';
import SettingsButton from '@/components/SettingsButton';

export default function ControlBar() {
  const pathname = usePathname() || '/';
  const isAllowed = pathname.startsWith('/bible') || pathname.startsWith('/strongs');

  return (
    <div className="fixed bottom-4 right-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 z-50 flex items-center space-x-2">
      <AddMiniAppButton />
      <StrongsToggle />
      <JesusToggle />
      {isAllowed && <MenuButton />}
      {isAllowed && <SettingsButton />}
    </div>
  );
}
