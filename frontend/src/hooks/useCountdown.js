import { useEffect, useRef, useState } from 'react';
import { formatCountdown } from '../utils/format.js';

/**
 * Visual countdown driven by SERVER timestamps.
 * We store (serverTime, performance.now()) when data arrives and advance with the
 * monotonic performance clock, so changing the device clock has no effect.
 * When it reaches zero it only calls onZero() -> the page asks the backend; it never unlocks itself.
 */
export default function useCountdown(nextClaimAt, serverTime, onZero) {
  const anchor = useRef({ server: 0, perf: 0 });
  const fired = useRef(null);
  const [remaining, setRemaining] = useState(0);
  const onZeroRef = useRef(onZero);
  onZeroRef.current = onZero;

  useEffect(() => {
    if (serverTime) anchor.current = { server: Date.parse(serverTime), perf: performance.now() };
  }, [serverTime]);

  useEffect(() => {
    if (!nextClaimAt) {
      setRemaining(0);
      return undefined;
    }
    const target = Date.parse(nextClaimAt);
    const tick = () => {
      const nowServer = anchor.current.server + (performance.now() - anchor.current.perf);
      const left = target - nowServer;
      setRemaining(Math.max(0, left));
      if (left <= 0 && fired.current !== nextClaimAt) {
        fired.current = nextClaimAt;
        onZeroRef.current && onZeroRef.current();
      }
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [nextClaimAt, serverTime]);

  return { remainingMs: remaining, text: formatCountdown(remaining) };
}
