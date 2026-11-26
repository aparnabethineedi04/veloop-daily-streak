import { motion } from 'framer-motion';
import { Sparkle } from 'lucide-react';
import icCal from '../../assets/ic-why-calendar.png';
import icChart from '../../assets/ic-why-chart.png';
import icGift from '../../assets/ic-why-gift.png';
import icShield from '../../assets/ic-why-shield.png';
import { fadeUp } from '../../utils/motion.js';
import styles from './Info.module.css';

export default function WhyStreak() {
  return (
    <motion.section className={styles.why} variants={fadeUp}>
      <h3 className={styles.whyTitle}>
        <Sparkle size={11} className={styles.spark} fill="currentColor" /> Why Maintain Your Streak? <Sparkle size={11} className={styles.spark} fill="currentColor" />
      </h3>
      <div className={styles.items}>
        <div className={styles.item}>
          <span className={styles.iconBox}><img src={icCal} alt="" /></span>
          <div>
            <div className={styles.itemTitle}><span className={styles.onlyM}>Stay Active</span><span className={styles.onlyD}>Login Daily</span></div>
            <div className={styles.itemText}>Keep your streak alive <span className={styles.onlyD}>to</span><span className={styles.onlyM}>&amp;</span> earn more!</div>
          </div>
        </div>
        <div className={styles.item}>
          <span className={styles.iconBox}><img src={icChart} alt="" /></span>
          <div><div className={styles.itemTitle}>Bigger Streak</div><div className={styles.itemText}>More consecutive logins, bigger rewards!</div></div>
        </div>
        <div className={styles.item}>
          <span className={styles.iconBox}><img src={icGift} alt="" /></span>
          <div><div className={styles.itemTitle}>Exclusive Rewards</div><div className={styles.itemText}>Get coins, gift cards &amp; special bonuses!</div></div>
        </div>
        <div className={styles.item}>
          <span className={styles.iconBox}><img src={icShield} alt="" /></span>
          <div><div className={styles.itemTitle}>Don&apos;t Miss Out</div><div className={styles.itemText}>Come back every day &amp; unlock all rewards!</div></div>
        </div>
      </div>
    </motion.section>
  );
}
