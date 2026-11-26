import { motion, useReducedMotion } from 'framer-motion';
import { Check, ChevronRight, Lock } from 'lucide-react';
import { assetFor } from '../../utils/assets.js';
import { fadeUp } from '../../utils/motion.js';
import { rewardValue } from '../../utils/format.js';
import styles from './Cards.module.css';

export default function RewardCard({ card, countdown, onClaim, claiming }) {
  const reduce = useReducedMotion();

  const { day, status, isToday, isNext, reward } = card;

  const claimed = status === 'CLAIMED';

  // DAY 2 GOLD FIX
  const cls = [
    styles.card,
    claimed && styles.claimed,
    (isToday || isNext) && styles.today,
    reward.isUltimate && styles.ultimate
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.article
      id={`day-card-${day}`}
      className={cls}
      variants={fadeUp}
      aria-label={`Day ${day} reward`}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      {isToday && (
        <span className={styles.tab}>
          Today
        </span>
      )}

      <div className={styles.top}>
        <span className={styles.day}>
          Day {day}
        </span>

        {claimed ? (
          <span className={styles.check}>
            <Check size={12} strokeWidth={3.5} />
          </span>
        ) : !isToday && reward.badge ? (
          <span
            className={`${styles.tag} ${reward.isUltimate ? styles.tagGold : ''
              }`}
          >
            {reward.badge}
          </span>
        ) : null}
      </div>

      <div className={styles.imgBox}>
        <img
          className={`${styles.img} ${reward.assetType === 'gift-card' ? styles.imgCard : ''
            }`}
          src={assetFor(reward.assetType)}
          alt=""
        />
      </div>

      <div className={styles.name}>
        {reward.title}
      </div>

      <div className={styles.value}>
        {rewardValue(reward)}
      </div>

      <div className={styles.sub}>
        {reward.subtitle}
      </div>

      {status === 'AVAILABLE' && (
        <motion.button
          className={styles.btnClaim}
          onClick={onClaim}
          disabled={claiming}
          whileTap={reduce ? undefined : { scale: 0.96 }}
        >
          <span className={styles.onlyD}>
            Claim Reward
          </span>

          <span className={styles.onlyM}>
            Claim Now
          </span>

          <ChevronRight size={14} />
        </motion.button>
      )}

      {claimed && (
        <div className={`${styles.btn} ${styles.btnClaimed}`}>
          <span className={styles.okDot}>
            <Check size={10} strokeWidth={4} />
          </span>
          Claimed
        </div>
      )}

      {status === 'LOCKED' && (
        <div className={`${styles.btn} ${styles.btnLocked}`}>
          <Lock size={12} />
          {isNext && countdown ? countdown : 'Locked'}
        </div>
      )}
    </motion.article>
  );
}