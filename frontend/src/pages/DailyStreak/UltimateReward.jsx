<<<<<<< HEAD
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';
import crownPodium from '../../assets/crown-podium.png';
import { fadeUp } from '../../utils/motion.js';
=======
import { Check, Lock } from 'lucide-react';
import crownPodium from '../../assets/crown-podium.png';
>>>>>>> origin/main
import { rewardValue } from '../../utils/format.js';
import styles from './Hero.module.css';

export default function UltimateReward({ ultimate, unlocked }) {
<<<<<<< HEAD
  const reduce = useReducedMotion();
  return (
    <motion.section className={styles.ult} variants={fadeUp} aria-label="Ultimate reward">
      <motion.img
        className={styles.podium}
        src={crownPodium}
        alt="Crown"
        {...(reduce ? {} : { animate: { y: [0, -5, 0] }, transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' } })}
      />
=======
  return (
    <section className={styles.ultimate}>
      <img className={`${styles.podium} ${styles.glow}`} src={crownPodium} alt="Ultimate reward crown" />
>>>>>>> origin/main
      <div className={styles.uMeta}>
        <div className={styles.uLabel}>{ultimate.title}</div>
        <div className={styles.uValue}>{rewardValue(ultimate)}</div>
        <span className={styles.uPill}><span className={styles.aLogo}>a</span> {ultimate.subtitle}</span>
      </div>
      <div className={styles.unlock}>
<<<<<<< HEAD
        <span className={`${styles.lockCircle} ${unlocked ? styles.unlocked : ''}`}>
          {unlocked ? <Check size={22} /> : <Lock size={20} />}
        </span>
        <span className={styles.unlockText}>
          {unlocked ? 'Unlocked' : <>Unlock on <b>Day {ultimate.unlockDay}</b></>}
        </span>
      </div>
    </motion.section>
=======
        <span className={`${styles.lockCircle} ${unlocked ? styles.done : ''}`}>
          {unlocked ? <Check size={22} /> : <Lock size={20} />}
        </span>
        <span>{unlocked ? 'Unlocked' : 'Unlock on'} {!unlocked && <b>Day {ultimate.unlockDay}</b>}</span>
      </div>
    </section>
>>>>>>> origin/main
  );
}
