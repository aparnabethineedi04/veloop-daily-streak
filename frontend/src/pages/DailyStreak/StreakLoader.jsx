import logo from '../../assets/logo-vr.png';
import styles from './States.module.css';

export default function StreakLoader() {
  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <div className={styles.logoWrap}>
        <span className={styles.ring} />
        <img className={styles.logo} src={logo} alt="VELoop" />
      </div>
      <div className={styles.loadText}>Loading your streak...</div>
    </div>
  );
}
