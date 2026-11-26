import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Lock, X } from 'lucide-react';
import { getHistory } from '../../services/streakApi.js';
import { assetFor } from '../../utils/assets.js';
import { rewardValue } from '../../utils/format.js';
import styles from './Overlay.module.css';

export default function CalendarSheet({ open, onClose, cards, streak }) {
  const [history, setHistory] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!open) return;
    setHistory(null);
    setFailed(false);
    getHistory(1).then((r) => setHistory(r.history)).catch(() => setFailed(true));
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className={styles.sheet}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Streak calendar"
          >
            <div className={styles.sheetHead}>
              <div>
                <h3 className={styles.sheetTitle}>Streak Calendar</h3>
                <p className={styles.sheetSub}>{streak.currentStreak} of {streak.totalRewards} days this cycle</p>
              </div>
              <button className={styles.close} onClick={onClose} aria-label="Close"><X size={18} /></button>
            </div>

            <div className={styles.calProgress}>
              <div className={styles.calBar}>
                <motion.div className={styles.calFill} initial={{ width: 0 }} animate={{ width: `${Math.round((streak.checkedIn / streak.totalRewards) * 100)}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
              </div>
              <span>{streak.checkedIn}/{streak.totalRewards} days</span>
            </div>

            <ul className={styles.calGrid}>
              {cards.map((c) => (
                <li key={c.day} className={`${styles.calDay} ${c.status === 'CLAIMED' ? styles.calDone : ''} ${c.isToday ? styles.calToday : ''} ${c.reward.isUltimate ? styles.calUlt : ''}`}>
                  <span className={styles.calNum}>Day {c.day}</span>
                  <img src={assetFor(c.reward.assetType)} alt="" />
                  <b>{rewardValue(c.reward)}</b>
                  <span className={styles.calState}>
                    {c.status === 'CLAIMED' ? <><Check size={12} strokeWidth={3} /> Claimed</> : c.isToday ? 'Today' : <><Lock size={11} /> Locked</>}
                  </span>
                </li>
              ))}
            </ul>

            <h4 className={styles.histTitle}>Recent claims</h4>
            {failed && <p className={styles.histEmpty}>Unable to load history right now.</p>}
            {!failed && history === null && <p className={styles.histEmpty}>Loading...</p>}
            {history && history.length === 0 && <p className={styles.histEmpty}>No claims yet. Claim today's reward to start!</p>}
            {history && history.length > 0 && (
              <ul className={styles.hist}>
                {history.slice(0, 6).map((h) => (
                  <li key={h.claimId}>
                    <span>Day {h.day} · {h.reward.currency === 'INR' ? `₹${h.reward.amount}` : `+${h.reward.amount} VEs`}</span>
                    <span>{new Date(h.claimedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
