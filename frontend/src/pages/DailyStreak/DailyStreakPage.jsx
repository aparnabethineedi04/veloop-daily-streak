<<<<<<< HEAD
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, RotateCcw, Sparkle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import useStreak from '../../hooks/useStreak.js';
import useCountdown from '../../hooks/useCountdown.js';
import { fadeUp, stagger } from '../../utils/motion.js';
=======
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, RotateCcw, Sparkles, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import useStreak from '../../hooks/useStreak.js';
import useCountdown from '../../hooks/useCountdown.js';
>>>>>>> origin/main
import StreakHeader from './StreakHeader.jsx';
import HeroBanner from './HeroBanner.jsx';
import StreakStats from './StreakStats.jsx';
import UltimateReward from './UltimateReward.jsx';
import RewardGrid from './RewardGrid.jsx';
import WhyStreak from './WhyStreak.jsx';
import TrustFooter from './TrustFooter.jsx';
import CpaDemo from './CpaDemo.jsx';
<<<<<<< HEAD
import CalendarSheet from './CalendarSheet.jsx';
import StreakLoader from './StreakLoader.jsx';
import StreakSkeleton from './StreakSkeleton.jsx';
import ErrorState from './ErrorState.jsx';
import styles from './Page.module.css';
=======
import StreakLoader from './StreakLoader.jsx';
import StreakSkeleton from './StreakSkeleton.jsx';
import ErrorState from './ErrorState.jsx';
import styles from './DailyStreak.module.css';
>>>>>>> origin/main

const CLAIM_MESSAGES = {
  ALREADY_CLAIMED: 'This reward has already been claimed.',
  NOT_AVAILABLE_YET: 'Your next reward is not available yet.',
  INVALID_DAY: 'Your streak has been updated. Please try again.',
  UNAUTHENTICATED: 'Please log in to continue.',
  RATE_LIMITED: 'Too many attempts. Please wait a moment.',
};

export default function DailyStreakPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const s = useStreak();
  const [loaderDone, setLoaderDone] = useState(false);
<<<<<<< HEAD
  const [calendarOpen, setCalendarOpen] = useState(false);
=======
>>>>>>> origin/main

  useEffect(() => {
    const t = setTimeout(() => setLoaderDone(true), 1000); // branded loader, minimum 1s
    return () => clearTimeout(t);
  }, []);

  const data = s.data;
  const streak = data?.streak;
  const countdown = useCountdown(streak?.nextClaimAt, data?.serverTime, s.refreshStatus);
<<<<<<< HEAD
  const expires = useCountdown(streak?.expiresAt, data?.serverTime, s.refreshStatus);
  const closeCalendar = useCallback(() => setCalendarOpen(false), []);
  const goBack = () => (window.history.length > 1 ? navigate(-1) : window.scrollTo({ top: 0, behavior: 'smooth' }));
=======
>>>>>>> origin/main

  if (!loaderDone) return <StreakLoader />;
  if (s.error && !data) return <ErrorState message={s.error.message} onRetry={s.reload} />;
  if (!data) return <StreakSkeleton />;

<<<<<<< HEAD
  const cards = data.rewards;
  const ultimateCard = cards.find((c) => c.reward.isUltimate) || cards[cards.length - 1];
  const claiming = s.claimPhase !== 'idle';
  const justReset = streak.lastReset && streak.currentStreak === 0;
  const revealCard = s.lastClaim ? cards.find((c) => c.day === s.lastClaim.day) : null;
  const atRisk = streak.claimable && streak.expiresAt;

  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.frame}>
          <StreakHeader streak={streak} gems={data.wallet.VES} onBack={goBack} />

          <motion.main className={styles.content} variants={stagger} initial="hidden" animate="show">
            {justReset && (
              <motion.div className={styles.banner} variants={fadeUp} role="status">
                <RotateCcw size={18} /> Your streak has been reset. Start again from Day 1.
              </motion.div>
            )}

            <div className={styles.top}>
              <HeroBanner />
              <div className={styles.panel}>
                <StreakStats streak={streak} stats={data.stats} cards={cards} onCalendar={() => setCalendarOpen(true)} />
                <UltimateReward ultimate={data.ultimateReward} unlocked={ultimateCard.status === 'CLAIMED'} />
              </div>
            </div>

            <motion.div className={styles.divider} variants={fadeUp} role="status">
              <span>
                <Sparkle size={13} fill="currentColor" />
                {atRisk ? (
                  <span className={styles.urgent}>Claim within {expires.text} to keep your {streak.currentStreak}-day streak</span>
                ) : (
                  'Come back tomorrow for more rewards!'
                )}
                <Sparkle size={13} fill="currentColor" />
              </span>
            </motion.div>

            <RewardGrid cards={cards} countdown={countdown.text} onClaim={s.claim} claiming={claiming} />
            <WhyStreak />
            <TrustFooter />
            <button className={styles.logout} onClick={signOut}><LogOut size={14} /> Log out</button>
          </motion.main>
        </div>
      </div>

      <CpaDemo
        phase={s.claimPhase}
        claim={s.lastClaim}
        assetType={revealCard?.reward.assetType}
        isUltimate={!!revealCard?.reward.isUltimate}
        streak={streak}
        onClose={s.dismissReveal}
      />
      <CalendarSheet open={calendarOpen} onClose={closeCalendar} cards={cards} streak={streak} />
=======
  const ultimateCard = data.rewards.find((c) => c.reward.isUltimate) || data.rewards[data.rewards.length - 1];
  const claiming = s.claimPhase !== 'idle';
  const justReset = streak.lastReset && streak.currentStreak === 0;
  const waiting = !streak.claimable && streak.nextClaimAt;
  const dividerText = waiting || streak.status === 'COMPLETE_WAITING'
    ? 'Come back tomorrow for more rewards!'
    : 'Your reward is ready - claim it now!';

  return (
    <>
      <main className={styles.page}>
        <div className={styles.frame}>
          <StreakHeader streak={streak} gems={data.wallet.VES} onBack={() => navigate(-1)} />

          {justReset && (
            <div className={styles.banner} role="status">
              <RotateCcw size={18} /> Your streak has been reset. Start again from Day 1.
            </div>
          )}

          <div className={styles.top}>
            <HeroBanner />
            <div className={styles.body}>
              <StreakStats
                streak={streak}
                stats={data.stats}
                onCalendar={() => document.getElementById('reward-grid')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              />
              <UltimateReward ultimate={data.ultimateReward} unlocked={ultimateCard.status === 'CLAIMED'} />
            </div>
          </div>

          <div className={styles.divider}>
            <span><Sparkles size={14} color="#8b5cf6" /> {dividerText} <Sparkles size={14} color="#8b5cf6" /></span>
          </div>

          <RewardGrid cards={data.rewards} countdown={countdown.text} onClaim={s.claim} claiming={claiming} />
          <WhyStreak />
          <TrustFooter />
          <button className={styles.logout} onClick={signOut}><LogOut size={14} /> Log out</button>
        </div>
      </main>

      <CpaDemo phase={s.claimPhase} />
>>>>>>> origin/main

      {s.claimError && (
        <div className={styles.toast} role="alert">
          <span>{CLAIM_MESSAGES[s.claimError.code] || s.claimError.message}</span>
          <button onClick={s.dismissClaimError} aria-label="Dismiss"><X size={16} /></button>
        </div>
      )}
    </>
  );
}
