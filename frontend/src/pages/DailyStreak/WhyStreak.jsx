import { CalendarCheck, Gift, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import styles from './Info.module.css';

const ITEMS = [
  { icon: CalendarCheck, tone: '', title: 'Login Daily', text: 'Keep your streak alive to earn more!' },
  { icon: TrendingUp, tone: styles.iconGold, title: 'Bigger Streak', text: 'More consecutive logins, bigger rewards!' },
  { icon: Gift, tone: '', title: 'Exclusive Rewards', text: 'Get coins, gift cards & special bonuses!' },
  { icon: ShieldCheck, tone: styles.iconGreen, title: "Don't Miss Out", text: 'Come back every day & unlock all rewards!' },
];

export default function WhyStreak() {
  return (
    <section className={styles.why}>
      <h3 className={styles.whyTitle}>
        <Sparkles size={14} className={styles.spark} /> Why Maintain Your Streak? <Sparkles size={14} className={styles.spark} />
      </h3>
      <div className={styles.items}>
        {ITEMS.map(({ icon: Icon, tone, title, text }) => (
          <div className={styles.item} key={title}>
            <span className={`${styles.iconBox} ${tone}`}><Icon size={22} /></span>
            <div>
              <div className={styles.itemTitle}>{title}</div>
              <div className={styles.itemText}>{text}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
