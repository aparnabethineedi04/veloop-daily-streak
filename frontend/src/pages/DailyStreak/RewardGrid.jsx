import RewardCard from './RewardCard.jsx';
import styles from './Cards.module.css';

export default function RewardGrid({ cards, countdown, onClaim, claiming }) {
  return (
    <section className={styles.grid} id="reward-grid">
      {cards.map((c) => (
        <RewardCard key={c.day} card={c} countdown={countdown} onClaim={onClaim} claiming={claiming} />
      ))}
    </section>
  );
}
