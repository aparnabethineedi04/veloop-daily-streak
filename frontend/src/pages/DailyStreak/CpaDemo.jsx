import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import logo from '../../assets/logo-vr.png';
import CountUp from '../../components/CountUp.jsx';
import { assetFor } from '../../utils/assets.js';
import styles from './Overlay.module.css';

const SPARKS = Array.from({ length: 14 }, (_, i) => i);

/**
 * Step 1 (processing) is a PLACEHOLDER for the future CPA / ad step. It never grants anything:
 * the reward is granted only by the backend claim endpoint.
 * Step 2 (reveal) shows what the backend confirmed (claim result + fresh streak state).
 */
export default function CpaDemo({ phase, claim, assetType, isUltimate, streak, onClose }) {
  useEffect(() => {
    if (phase !== 'reveal') return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, onClose]);

  return (
    <AnimatePresence>
      {phase !== 'idle' && (
        <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            key={phase}
            className={styles.modal}
            initial={{ scale: 0.92, y: 14, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-live="polite"
          >
            {phase === 'processing' && (
              <>
                <span className={styles.adTag}>Advertisement / Reward Verification</span>
                <div className={styles.logoWrap}>
                  <span className={styles.ring} />
                  <img className={styles.logo} src={logo} alt="" />
                </div>
                <h3 className={styles.mTitle}>Preparing your reward...</h3>
                <p className={styles.mText}>Please wait...</p>
                <div className={styles.progress}><i /></div>
              </>
            )}

            {phase === 'reveal' && claim && (
              <>
                <div className={styles.sparks} aria-hidden="true">
                  {SPARKS.map((i) => <i key={i} style={{ '--i': i }} />)}
                </div>
                <span className={styles.okTag}><Check size={14} strokeWidth={3} /> {isUltimate ? 'Ultimate Reward unlocked!' : `Day ${claim.day} claimed`}</span>
                <motion.img
                  className={styles.revealImg}
                  src={assetFor(assetType)}
                  alt=""
                  initial={{ scale: 0.4, rotate: -8, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.1 }}
                />
                <div className={styles.revealValue}>
                  {claim.reward.currency === 'INR' ? '₹' : '+'}<CountUp value={claim.reward.amount} duration={0.8} />
                </div>
                <div className={styles.revealSub}>
                  {claim.reward.currency === 'INR' ? 'Amazon Gift Card added to your wallet' : 'VEs added to your wallet'}
                </div>
                <div className={styles.revealStreak}><Sparkles size={14} /> {isUltimate ? 'Perfect week completed!' : `${streak.currentStreak} Day Streak`}</div>
                <button className={styles.cta} onClick={onClose}>Awesome!</button>
                <div className={styles.ref}>Ref: {claim.referenceId}</div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

