import { CloudOff } from 'lucide-react';
import styles from './States.module.css';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className={styles.error} role="alert">
      <CloudOff className={styles.errIcon} size={44} />
      <h2 className={styles.errTitle}>Something went wrong</h2>
      <p className={styles.errText}>{message || 'Unable to load your streak. Please try again.'}</p>
      <button className={styles.retry} onClick={onRetry}>Try again</button>
    </div>
  );
}
