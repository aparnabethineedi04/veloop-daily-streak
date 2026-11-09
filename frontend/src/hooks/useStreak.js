import { useCallback, useEffect, useRef, useState } from 'react';
import * as streakApi from '../services/streakApi.js';
import { toApiError } from '../services/api.js';

const MIN_CPA_MS = 2600; // length of the demo "Preparing your reward..." state

export default function useStreak() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claimPhase, setClaimPhase] = useState('idle'); // idle | processing | success
  const [claimError, setClaimError] = useState(null);
  const [lastClaim, setLastClaim] = useState(null);
  const busy = useRef(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      setData(await streakApi.getStreak());
      setError(null);
    } catch (e) {
      if (!silent) setError(toApiError(e));
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Another tab may have claimed: always re-sync from the backend when the tab is focused again.
  useEffect(() => {
    const onVisible = () => document.visibilityState === 'visible' && load(true);
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [load]);

  /** Countdown reached ~0: ask the backend, never assume. */
  const refreshStatus = useCallback(async () => {
    try {
      const st = await streakApi.getStatus();
      if (st.streak.claimable) await load(true);
      else setData((d) => (d ? { ...d, serverTime: st.serverTime, streak: st.streak, wallet: st.wallet } : d));
    } catch {
      /* ignore; the next focus/refresh will retry */
    }
  }, [load]);

  const claim = useCallback(async () => {
    if (busy.current) return; // UX guard only - the backend is the real protection
    busy.current = true;
    setClaimError(null);
    setClaimPhase('processing');
    try {
      const [result] = await Promise.all([
        streakApi.claimStreak(),
        new Promise((r) => setTimeout(r, MIN_CPA_MS)),
      ]);
      setLastClaim(result.claim);
      setClaimPhase('success');
      await new Promise((r) => setTimeout(r, 1200));
      await load(true); // refresh everything from the backend
    } catch (e) {
      setClaimError(toApiError(e));
      await load(true);
    } finally {
      setClaimPhase('idle');
      busy.current = false;
    }
  }, [load]);

  return {
    data, loading, error, claimPhase, claimError, lastClaim,
    reload: () => load(false), claim, refreshStatus,
    dismissClaimError: () => setClaimError(null),
  };
}
