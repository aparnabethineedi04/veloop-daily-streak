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
        ) : null}
      </div>

      <div className={styles.imgBox}>
        <img
          className={`${styles.img} ${reward.assetType === 'gift-card' ? styles.imgSolid : ''} ${motion}`}
          src={ASSETS[reward.assetType] || coins}
          alt=""
        />
      </div>

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
