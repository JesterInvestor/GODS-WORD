'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function FarcasterProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Farcaster SDK and call ready() immediately
    const initSDK = async () => {
      try {
        // CRITICAL: Always call ready() to hide splash screen
        await sdk.actions.ready();
        
        // Then check context for additional info (optional)
        const context = await sdk.context;
        console.log('[Farcaster] Mini App ready, context:', context);
      } catch (error) {
        // Call ready() even if not in Farcaster context
        console.log('[Farcaster] Error during init, ensuring ready() was called:', error);
        try {
          await sdk.actions.ready();
        } catch (e) {
          console.log('[Farcaster] Not in Mini App context - running standalone');
        }
      }
    };

    initSDK();
  }, []);

  return <>{children}</>;
}
