'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function FarcasterProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Farcaster SDK and call ready() immediately
    const initSDK = async () => {
      try {
        // Obtain context for optional behaviors (do NOT call ready() here;
        // ready() is called directly from the page to avoid duplicate calls)
        const context = await sdk.context;
        console.log('[Farcaster] SDK context available:', context);
      } catch (error) {
        // It's fine if context isn't available when running outside a host.
        console.log('[Farcaster] Error obtaining context (not running in host?):', error);
      }
    };

    initSDK();
  }, []);

  return <>{children}</>;
}
