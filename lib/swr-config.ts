import { SWRConfiguration } from 'swr';

/**
 * Global SWR configuration with custom caching and revalidation
 */
export const swrConfig: SWRConfiguration = {
  // Revalidation options
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  revalidateIfStale: false,
  
  // Cache will be considered fresh for 1 hour
  dedupingInterval: 3600000,
  
  // Retry configuration
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  
  // Load data from cache immediately and revalidate in background
  suspense: false,
  

};

/**
 * Default fetcher for SWR
 */
const fetcher = async (url: string) => {
  const res = await fetch(url);
  
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    throw error;
  }
  
  return res.json();
};

/**
 * Hook for fetching Bible data with SWR
 */
export function useBibleBook(bookName: string) {
  return useSWR(`/data/${bookName}.json`, fetcher, {
    ...swrConfig,
    // Bible data is static, so we can cache it for a long time
    revalidateOnMount: false,
  });
}

/**
 * Hook for fetching Strong's dictionary data with SWR
 */
export function useStrongsDictionary(type: 'hebrew' | 'greek') {
  return useSWR(
    `/data/strongs-${type}-dictionary.json`,
    fetcher,
    {
      ...swrConfig,
      // Dictionary data is static
      revalidateOnMount: false,
    }
  );
}

// Import at the top for the hooks
import useSWR from 'swr';
