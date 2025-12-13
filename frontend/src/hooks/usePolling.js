import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for polling data at regular intervals
 * @param {Function} fetchFn - Function to fetch data
 * @param {number} intervalMs - Polling interval in milliseconds (default: 7000ms = 7 seconds)
 * @param {boolean} enabled - Whether polling is enabled (default: true)
 * @returns {Function} - Manual refresh function
 */
export function usePolling(fetchFn, intervalMs = 7000, enabled = true) {
  const intervalRef = useRef(null);
  const isFetchingRef = useRef(false);
  const fetchFnRef = useRef(fetchFn);

  // Keep fetchFn ref updated
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    // Prevent overlapping requests
    if (isFetchingRef.current) {
      return;
    }

    try {
      isFetchingRef.current = true;
      await fetchFnRef.current();
    } catch (error) {
      console.error('Polling fetch error:', error);
      // Don't throw - let component handle errors
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Set up polling interval (don't fetch immediately - let component handle initial fetch)
    intervalRef.current = setInterval(() => {
      // Only fetch if not already fetching
      if (!isFetchingRef.current) {
        refresh();
      }
    }, intervalMs);

    // Cleanup on unmount or when disabled
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, intervalMs, refresh]);

  return refresh;
}

