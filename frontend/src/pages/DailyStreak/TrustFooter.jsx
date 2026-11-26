<<<<<<< HEAD
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import logo from '../../assets/logo-vr.png';
import { fadeUp } from '../../utils/motion.js';
=======
import { ChevronRight } from 'lucide-react';
import logo from '../../assets/logo-vr.png';
>>>>>>> origin/main
import styles from './Info.module.css';

export default function TrustFooter() {
  return (
<<<<<<< HEAD
    <motion.footer className={styles.trust} variants={fadeUp}>
      <img className={styles.trustLogo} src={logo} alt="VELoop Rewards" />
      <div className={styles.trustText}>
        <span>Official rewards only on <b>VeloopRewards.in</b></span>
        <span className={styles.stay}>Stay active, stay rewarded!</span>
      </div>
      <ChevronRight className={styles.chev} size={20} />
    </motion.footer>
=======
    <footer className={styles.trust}>
      <img className={styles.trustLogo} src={logo} alt="VELoop" />
      <div className={styles.trustText}>
        Official rewards only on <b>VeloopRewards.in</b>
        <span className={styles.stay}> &nbsp;|&nbsp; Stay active, stay rewarded!</span>
      </div>
      <ChevronRight className={styles.chev} size={20} />
    </footer>
>>>>>>> origin/main
  );
}
