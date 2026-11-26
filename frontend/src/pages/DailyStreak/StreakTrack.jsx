import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import icFlame from '../../assets/ic-flame.png';
import { assetFor } from '../../utils/assets.js';
import styles from './Hero.module.css';

/** 7-day journey: completed days, today's reward and upcoming rewards, driven by the backend card states. */
export default function StreakTrack({ cards }) {
  const total = cards.length;
  const claimed = cards.filter((c) => c.status === 'CLAIMED').length;
  const ultimate = cards.find((c) => c.reward.isUltimate) || cards[total - 1];
  const toGo = Math.max(0, ultimate.day - claimed);
  const fill = total > 1 ? (Math.max(0, claimed - 1) / (total - 1)) * 100 : 0;

  const note = claimed >= ultimate.day
    ? <b>Perfect week completed!</b>
    : <><b>{toGo} {toGo === 1 ? 'day' : 'days'}</b> to the Ultimate Reward</>;

  const jump = (day) => {
    const el = document.getElementById(`day-card-${day}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.05)' }, { transform: 'scale(1)' }], { duration: 600, easing: 'ease-out' });
  };

  return (
    <div className={styles.journey}>
      <div className={styles.jHead}>
        <span className={styles.jTitle}><img src={icFlame} alt="" /> Streak Journey</span>
        <span className={styles.jNote}>{note}</span>
      </div>
      <div className={styles.track}>
        <div className={styles.rail}>
          <motion.div className={styles.railFill} initial={{ width: 0 }} animate={{ width: `${fill}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }} />
        </div>
        <ol className={styles.nodes}>
          {cards.map((c) => {
            const st = c.status === 'CLAIMED' ? styles.done : c.isToday ? styles.now : c.isNext ? styles.nextN : styles.lockedN;
            return (
              <li key={c.day}>
                <button className={`${styles.node} ${st}`} onClick={() => jump(c.day)} aria-label={`Go to Day ${c.day} reward`}>
                  <span className={styles.disc}>
                    <img src={assetFor(c.reward.assetType)} alt="" />
                    {c.status === 'CLAIMED' && <span className={styles.tick}><Check size={10} strokeWidth={4} /></span>}
                  </span>
                  <span className={styles.lbl}>Day {c.day}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
