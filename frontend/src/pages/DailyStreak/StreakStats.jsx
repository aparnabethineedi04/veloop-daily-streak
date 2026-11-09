import { CalendarCheck, CalendarDays, ChevronRight, Flame, Star, SquareCheck } from 'lucide-react';
import { rewardShort } from '../../utils/format.js';
import styles from './Hero.module.css';

export default function StreakStats({ streak, stats, onCalendar }) {
  const next = stats.nextReward;
  return (
    <section className={styles.stats}>
      <div className={styles.chipRow}>
        <span className={styles.chip}><Flame className={styles.chipFlame} size={18} /> {streak.currentStreak} Day Streak</span>
        <button className={styles.calLink} onClick={onCalendar}>
          <CalendarDays size={16} /> Streak Calendar <ChevronRight size={14} />
        </button>
      </div>
      <div className={styles.tiles}>
        <div className={styles.tile}>
          <span className={`${styles.ico} ${styles.icoPurple}`}><CalendarCheck size={20} /></span>
          <div><div className={styles.tileLabel}>Total Rewards</div><div className={styles.tileValue}>{stats.totalRewards}</div></div>
        </div>
        <div className={styles.tile}>
          <span className={`${styles.ico} ${styles.icoGreen}`}><SquareCheck size={20} /></span>
          <div><div className={styles.tileLabel}>Checked In</div><div className={styles.tileValue}>{stats.checkedIn}</div></div>
        </div>
        <div className={styles.tile}>
          <span className={`${styles.ico} ${styles.icoGold}`}><Star size={20} /></span>
          <div>
            <div className={styles.tileLabel}>Next Reward</div>
            <div className={`${styles.tileValue} ${styles.goldText}`}>{next ? rewardShort(next) : '-'}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
