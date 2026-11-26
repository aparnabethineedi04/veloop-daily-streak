import { motion, useReducedMotion } from 'framer-motion';
import calendar from '../../assets/calendar.png';
import giftSmall from '../../assets/gift-small.png';
import heroGift from '../../assets/hero-gift.png';
import { fadeUp } from '../../utils/motion.js';
import styles from './Hero.module.css';

export default function HeroBanner() {
  const reduce = useReducedMotion();
  const float = (dur, d = 0) => (reduce ? {} : { animate: { y: [0, -6, 0] }, transition: { duration: dur, repeat: Infinity, ease: 'easeInOut', delay: d } });
  return (
    <motion.section className={styles.hero} variants={fadeUp}>
      <span className={styles.sparks} aria-hidden="true">{[0, 1, 2, 3, 4, 5].map((n) => <i key={n} />)}</span>
      <motion.img className={styles.cal} src={calendar} alt="" {...float(5)} />
      <div className={styles.mCopy}>
        <h2>Login Daily &amp; Earn <span className={styles.gold}>Bigger Rewards!</span></h2>
        <p>Maintain your streak and unlock <span className={styles.hl}>exciting rewards</span> every day.</p>
      </div>
      <motion.img className={styles.giftSm} src={giftSmall} alt="" {...float(4.2, 0.5)} />

      <motion.img className={styles.art} src={heroGift} alt="" {...float(5.5)} />
      <div className={styles.dCopy}>
        <h2>Daily Check-In <span className={styles.gold}>Rewards</span></h2>
        <p>Check in every day and earn <span className={styles.hl}>exciting rewards!</span></p>
      </div>
    </motion.section>
  );
}
