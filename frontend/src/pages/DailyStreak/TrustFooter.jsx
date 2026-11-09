import { ChevronRight } from 'lucide-react';
import logo from '../../assets/logo-vr.png';
import styles from './Info.module.css';

export default function TrustFooter() {
  return (
    <footer className={styles.trust}>
      <img className={styles.trustLogo} src={logo} alt="VELoop" />
      <div className={styles.trustText}>
        Official rewards only on <b>VeloopRewards.in</b>
        <span className={styles.stay}> &nbsp;|&nbsp; Stay active, stay rewarded!</span>
      </div>
      <ChevronRight className={styles.chev} size={20} />
    </footer>
  );
}
