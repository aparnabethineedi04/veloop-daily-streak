import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import icFlame from '../../assets/ic-flame.png';
import icGem from '../../assets/ic-gem.png';
import icCalendar from '../../assets/ic-calendar.png';
import styles from './Header.module.css';

export default function StreakHeader({ streak, gems, onBack }) {
  return (
    <header className={styles.header}>
      {/* Mobile / tablet (matches the mobile design) */}
      <div className={styles.mobile}>
        <button className={styles.back} onClick={onBack} aria-label="Go back">
          <ArrowLeft size={20} />
        </button>
        <h1 className={styles.mTitle}>
          Daily Streak <img className={styles.flame} src={icFlame} alt="" />
        </h1>
        <div className={styles.gems} aria-label="Gem balance">
          <img className={styles.gemIcon} src={icGem} alt="" />
          <motion.span key={gems} initial={{ scale: 1.4, color: '#ffd24a' }} animate={{ scale: 1, color: '#f6f3ff' }} transition={{ duration: 0.6 }}>
            {gems}
          </motion.span>
        </div>
      </div>

      {/* Desktop (matches the desktop design) */}
      <div className={styles.desktop}>
        <div className={styles.left}>
          <div className={styles.tile}><img src={icCalendar} alt="" /></div>
          <div>
            <h1 className={styles.title}>Daily Streak</h1>
            <p className={styles.sub}>Login daily, maintain your streak, and unlock bigger rewards every day!</p>
          </div>
        </div>
        <div className={styles.badge}>
          <img className={styles.badgeFlame} src={icFlame} alt="" />
          <div>
            <div className={styles.badgeTitle}><span className={styles.gold}>{streak.currentStreak} Day</span> Streak</div>
            <div className={styles.badgeSub}>Keep it going!</div>
          </div>
        </div>
      </div>
    </header>
  );
}
