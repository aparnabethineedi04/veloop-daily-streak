import { ArrowLeft, CalendarCheck, Flame, Gem } from 'lucide-react';
import styles from './Header.module.css';

export default function StreakHeader({ streak, gems, onBack }) {
  return (
    <header>
      {/* Mobile / tablet */}
      <div className={styles.mobile}>
        <button className={styles.back} onClick={onBack} aria-label="Go back">
          <ArrowLeft size={22} />
        </button>
        <h1 className={styles.mTitle}>
          Daily Streak <Flame className={styles.flame} size={22} />
        </h1>
        <div className={styles.gems} aria-label="Gem balance">
          <Gem className={styles.gemIcon} size={20} /> {gems}
        </div>
      </div>

      {/* Desktop */}
      <div className={styles.desktop}>
        <div className={styles.left}>
          <div className={styles.tile}><CalendarCheck size={24} /></div>
          <div>
            <h1 className={styles.title}>Daily Streak</h1>
            <p className={styles.sub}>Login daily, maintain your streak, and unlock bigger rewards every day!</p>
          </div>
        </div>
        <div className={styles.badge}>
          <Flame className={styles.badgeFlame} size={38} />
          <div>
            <div className={styles.badgeTitle}>
              <span className={styles.gold}>{streak.currentStreak} Day</span> Streak
            </div>
            <div className={styles.badgeSub}>Keep it going!</div>
          </div>
        </div>
      </div>
    </header>
  );
}
