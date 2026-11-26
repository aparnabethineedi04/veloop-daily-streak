<<<<<<< HEAD
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
=======
import { Check, ChevronRight, Lock } from 'lucide-react';
import coins from '../../assets/coins.png';
import giftSmall from '../../assets/gift-small.png';
import amazonCard from '../../assets/amazon-card.png';
import crownSmall from '../../assets/crown-small.png';
import { rewardValue } from '../../utils/format.js';
import styles from './Cards.module.css';

// Backend returns an asset *identifier*; the static image lives in the frontend.
const ASSETS = { coin: coins, gift: giftSmall, 'gift-card': amazonCard, crown: crownSmall };

export default function RewardCard({ card, countdown, onClaim, claiming }) {
  const { day, status, isToday, isNext, reward } = card;
  const claimed = status === 'CLAIMED';
  const classes = [
    styles.card,
    claimed && styles.claimed,
    isToday && styles.today,
    reward.isUltimate && !claimed && styles.ultimate,
  ].filter(Boolean).join(' ');

  const motion = reward.assetType === 'crown' ? styles.shine : reward.assetType === 'gift' ? styles.float : '';

  return (
    <article className={classes} aria-label={`Day ${day} reward`}>
      <div className={styles.top}>
        <span className={styles.day}>Day {day}</span>
        {claimed ? (
          <span className={styles.check}><Check size={13} strokeWidth={3} /></span>
        ) : isToday ? (
          <span className={`${styles.tag} ${styles.tagGold}`}>Today</span>
        ) : reward.badge ? (
          <span className={styles.tag}>{reward.badge}</span>
>>>>>>> origin/main
        ) : null}
      </div>

      <div className={styles.imgBox}>
        <img
<<<<<<< HEAD
          className={`${styles.img} ${reward.assetType === 'gift-card' ? styles.imgCard : ''
            }`}
          src={assetFor(reward.assetType)}
=======
          className={`${styles.img} ${reward.assetType === 'gift-card' ? styles.imgSolid : ''} ${motion}`}
          src={ASSETS[reward.assetType] || coins}
>>>>>>> origin/main
          alt=""
        />
      </div>

<<<<<<< HEAD
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
=======
      <div className={styles.title}>{reward.title}</div>
      <div className={styles.value}>{rewardValue(reward)}</div>
      <div className={styles.sub}>{reward.subtitle}</div>

      {status === 'AVAILABLE' && (
        <button className={`${styles.btn} ${styles.btnClaim}`} onClick={onClaim} disabled={claiming}>
          Claim Reward <ChevronRight size={14} />
        </button>
      )}
      {status === 'CLAIMED' && (
        <div className={`${styles.btn} ${styles.btnClaimed}`}><Check size={14} /> Claimed</div>
      )}
      {status === 'LOCKED' && (
        <div className={`${styles.btn} ${isNext ? styles.btnNext : styles.btnLocked}`}>
          <Lock size={13} /> {isNext && countdown ? countdown : 'Locked'}
        </div>
      )}
    </article>
  );
}
>>>>>>> origin/main
