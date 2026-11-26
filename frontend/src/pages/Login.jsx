import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import * as authApi from '../services/authApi.js';
import { toApiError } from '../services/api.js';
import logo from '../assets/logo-vr.png';
import styles from './Auth.module.css';

export default function Login() {
  const { token, signIn } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (token) return <Navigate to="/daily-streak" replace />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res =
        mode === 'login'
          ? await authApi.login(form.email, form.password)
          : await authApi.register(form.name, form.email, form.password);
      signIn(res.token);
      navigate('/daily-streak', { replace: true });
    } catch (err) {
      const apiErr = toApiError(err);
      setError(apiErr.code === 'VALIDATION_ERROR' ? 'Please check your details (password needs 8+ characters).' : apiErr.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <form className={styles.card} onSubmit={submit}>
        <img className={styles.logo} src={logo} alt="VELoop" />
        <h1 className={styles.title}>VELoop Rewards</h1>
        <p className={styles.sub}>{mode === 'login' ? 'Log in to claim your daily streak' : 'Create your account'}</p>
        {error && <div className={styles.err} role="alert">{error}</div>}
        {mode === 'register' && (
          <input className={`form-control mb-3 ${styles.input}`} placeholder="Name" value={form.name} onChange={set('name')} required />
        )}
        <input className={`form-control mb-3 ${styles.input}`} type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
        <input className={`form-control mb-3 ${styles.input}`} type="password" placeholder="Password" value={form.password} onChange={set('password')} required />
        <button className={styles.btn} disabled={busy}>{busy ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Sign up'}</button>
        <div className="text-center mt-3">
          <button type="button" className={styles.link} onClick={() => { setError(''); setMode(mode === 'login' ? 'register' : 'login'); }}>
            {mode === 'login' ? "New here? Create an account" : 'Have an account? Log in'}
          </button>
        </div>
        <div className={styles.demo}>Demo: demo@veloop.test / Demo@1234</div>
      </form>
    </div>
  );
}
