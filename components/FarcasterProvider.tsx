'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function FarcasterProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Farcaster SDK
    const initSDK = async () => {
      try {
        // Check if running in Farcaster context
        const context = await sdk.context;
        console.log('[Farcaster] SDK initialized', context);
        
        // Signal that the app is ready - CRITICAL for hiding splash screen
        await sdk.actions.ready();
      } catch (error) {
        // Not in Farcaster context - that's okay, app works standalone too
        console.log('[Farcaster] Not running in Mini App context', error);
      }
    };

    initSDK();
  }, []);

  return <>{children}</>;
}
