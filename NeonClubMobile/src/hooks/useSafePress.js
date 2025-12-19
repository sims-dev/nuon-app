import { useCallback, useRef } from 'react';

// Prevent double presses and allow debounce/throttle-ish behavior
export function useSafePress(callback, { cooldown = 600 } = {}) {
  const lastRef = useRef(0);
  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastRef.current < cooldown) return;
    lastRef.current = now;
    callback?.(...args);
  }, [callback, cooldown]);
}

export default useSafePress;
