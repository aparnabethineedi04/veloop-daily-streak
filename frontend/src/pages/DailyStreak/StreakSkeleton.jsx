import styles from './States.module.css';
import page from './DailyStreak.module.css';

const sk = (extra = '') => `${styles.sk} ${extra}`;

export default function StreakSkeleton() {
  return (
    <div className={page.page} aria-busy="true" aria-label="Loading">
      <div className={styles.skWrap}>
        <div className={sk(styles.skHeader)} />
        <div className={styles.skTop}>
          <div className={styles.skWrap}>
            <div className={sk(styles.skHero)} />
            <div className={sk(styles.skStats)} />
          </div>
          <div className={sk(styles.skUlt)} />
        </div>
        <div className={styles.skGrid}>
          {Array.from({ length: 7 }, (_, i) => <div key={i} className={sk(styles.skCard)} />)}
        </div>
        <div className={sk(styles.skInfo)} />
        <div className={sk(styles.skStats)} />
      </div>
    </div>
  );
}
