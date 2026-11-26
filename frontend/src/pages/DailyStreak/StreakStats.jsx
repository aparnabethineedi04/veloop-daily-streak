<<<<<<< HEAD
import { motion } from 'framer-motion';
import { CalendarDays, ChevronRight } from 'lucide-react';
import CountUp from '../../components/CountUp.jsx';
import icFlame from '../../assets/ic-flame.png';
import icStatCal from '../../assets/ic-stat-calendar.png';
import icStatCheck from '../../assets/ic-stat-check.png';
import icStatStar from '../../assets/ic-stat-star.png';
import { fadeUp } from '../../utils/motion.js';
import { rewardShort } from '../../utils/format.js';
import StreakTrack from './StreakTrack.jsx';
import styles from './Hero.module.css';

export default function StreakStats({ streak, stats, cards, onCalendar }) {
  const next = stats.nextReward;
  return (
    <motion.section className={styles.stats} variants={fadeUp}>
      <div className={styles.chipRow}>
        <span className={styles.chip}><img className={styles.chipFlame} src={icFlame} alt="" /> {streak.currentStreak} Day Streak</span>
        <button className={styles.calBtn} onClick={onCalendar}>
          <CalendarDays size={16} /> Streak Calendar <ChevronRight size={14} />
        </button>
      </div>

      <div className={styles.tiles}>
        <div className={styles.tile}>
          <img className={styles.icoImg} src={icStatCal} alt="" />
          <div><div className={styles.tLabel}>Total Rewards</div><div className={styles.tValue}><CountUp value={stats.totalRewards} /></div></div>
        </div>
        <div className={styles.tile}>
          <img className={styles.icoImg} src={icStatCheck} alt="" />
          <div><div className={styles.tLabel}>Checked In</div><div className={styles.tValue}><CountUp value={stats.checkedIn} /></div></div>
        </div>
        <div className={styles.tile}>
          <img className={styles.icoImg} src={icStatStar} alt="" />
          <div>
            <div className={styles.tLabel}>Next Reward</div>
            <div className={`${styles.tValue} ${styles.goldText}`}>{next ? rewardShort(next) : '-'}</div>
          </div>
        </div>
      </div>

      <StreakTrack cards={cards} />
    </motion.section>
=======
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
>>>>>>> origin/main
  );
}
