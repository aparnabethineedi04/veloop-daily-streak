import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import logo from '../../assets/logo-vr.png';
import styles from './States.module.css';

/**
 * PLACEHOLDER for the future CPA / ad step. It never grants anything:
 * the reward is granted only by the backend claim endpoint.
 * The VELoop team will replace this component with the real integration.
 */
export default function CpaDemo({ phase }) {
  return (
    <AnimatePresence>
      {phase !== 'idle' && (
        <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className={styles.modal} initial={{ scale: 0.92, y: 12 }} animate={{ scale: 1, y: 0 }} role="dialog" aria-live="polite">
            {phase === 'processing' ? (
              <>
                <span className={styles.adTag}>Advertisement / Reward Verification</span>
                <div className={styles.logoWrap} style={{ margin: '0 auto' }}>
                  <span className={styles.ring} />
                  <img className={styles.logo} src={logo} alt="" />
                </div>
                <h3 className={styles.mTitle}>Preparing your reward...</h3>
                <p className={styles.mText}>Please wait...</p>
                <div className={styles.progress}><i /></div>
              </>
            ) : (
              <>
                <div className={styles.okIcon}><Check size={34} strokeWidth={3} /></div>
                <h3 className={styles.mTitle}>Reward claimed!</h3>
                <p className={styles.mText}>Updating your streak...</p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
