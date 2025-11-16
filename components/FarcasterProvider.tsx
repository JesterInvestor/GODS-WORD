'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function FarcasterProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Farcaster SDK and call ready() immediately
    const initSDK = async () => {
      try {
        // Obtain context for optional behaviors (do NOT call ready() here;
        // we'll call ready() here once when the provider mounts to ensure
        // the host knows the mini app is ready.
        const context = await sdk.context;
        console.log('[Farcaster] SDK context available:', context);

        if (sdk.actions && typeof sdk.actions.ready === 'function') {
          try {
            await sdk.actions.ready();
            console.log('[Farcaster] sdk.actions.ready() called successfully');
            try { window.dispatchEvent(new CustomEvent('farcaster-ready', { detail: { ready: true } })); } catch {}
          } catch (err) {
            console.warn('[Farcaster] sdk.actions.ready() failed:', err);
            try { window.dispatchEvent(new CustomEvent('farcaster-ready', { detail: { ready: false, error: String(err) } })); } catch {}
          }
        } else {
          console.log('[Farcaster] sdk.actions.ready() not available in this environment');
          try { window.dispatchEvent(new CustomEvent('farcaster-ready', { detail: { ready: false } })); } catch {}
        }
      } catch (error) {
        // It's fine if context isn't available when running outside a host.
        console.log('[Farcaster] Error obtaining context (not running in host?):', error);
      }
    };

    initSDK();
  }, []);

  return <>{children}</>;
}
