import { motion } from 'framer-motion';
import RewardCard from './RewardCard.jsx';
import { stagger } from '../../utils/motion.js';
import styles from './Cards.module.css';

export default function RewardGrid({ cards, countdown, onClaim, claiming }) {
  return (
    <motion.section id="reward-grid" className={styles.grid} variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.08 }}>
      {cards.map((c) => (
        <RewardCard key={c.day} card={c} countdown={countdown} onClaim={onClaim} claiming={claiming} />
      ))}
    </motion.section>
  );
}
