import { CalendarCheck } from 'lucide-react';
import heroGift from '../../assets/hero-gift.png';
import styles from './Hero.module.css';

export default function HeroBanner() {
  return (
    <section className={styles.hero}>
      <div className={styles.calendar} aria-hidden="true"><CalendarCheck size={38} /></div>

      <div className={styles.mobileCopy}>
        <h2>Login Daily &amp; Earn <span className={styles.gold}>Bigger Rewards!</span></h2>
        <p>Maintain your streak and unlock <span className={styles.hl}>exciting rewards</span> every day.</p>
      </div>
      <div className={styles.desktopCopy}>
        <h2>Daily Check-In <span className={styles.gold}>Rewards</span></h2>
        <p>Check in every day and earn <span className={styles.hl}>exciting rewards!</span></p>
      </div>

      <img className={`${styles.art} ${styles.float}`} src={heroGift} alt="" />
    </section>
  );
}
