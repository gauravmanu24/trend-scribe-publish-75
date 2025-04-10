
import { useEffect, useRef } from 'react';

/**
 * Custom hook that runs a callback function at specified intervals
 * @param callback Function to run at each interval
 * @param delay Delay in milliseconds, or null to pause the interval
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(() => {});

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    // Only set up the interval if delay is not null
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    
    // Return undefined if delay is null (no interval)
    return undefined;
  }, [delay]);
}
