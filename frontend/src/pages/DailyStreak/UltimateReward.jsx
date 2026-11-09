import { Check, Lock } from 'lucide-react';
import crownPodium from '../../assets/crown-podium.png';
import { rewardValue } from '../../utils/format.js';
import styles from './Hero.module.css';

export default function UltimateReward({ ultimate, unlocked }) {
  return (
    <section className={styles.ultimate}>
      <img className={`${styles.podium} ${styles.glow}`} src={crownPodium} alt="Ultimate reward crown" />
      <div className={styles.uMeta}>
        <div className={styles.uLabel}>{ultimate.title}</div>
        <div className={styles.uValue}>{rewardValue(ultimate)}</div>
        <span className={styles.uPill}><span className={styles.aLogo}>a</span> {ultimate.subtitle}</span>
      </div>
      <div className={styles.unlock}>
        <span className={`${styles.lockCircle} ${unlocked ? styles.done : ''}`}>
          {unlocked ? <Check size={22} /> : <Lock size={20} />}
        </span>
        <span>{unlocked ? 'Unlocked' : 'Unlock on'} {!unlocked && <b>Day {ultimate.unlockDay}</b>}</span>
      </div>
    </section>
  );
}
