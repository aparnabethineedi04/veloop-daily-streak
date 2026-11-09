import api from './api.js';

export const getStreak = () => api.get('/daily-streak').then((r) => r.data);
export const getStatus = () => api.get('/daily-streak/status').then((r) => r.data);
export const getHistory = (page = 1) => api.get('/daily-streak/history', { params: { page } }).then((r) => r.data);
export const getWallet = () => api.get('/wallet').then((r) => r.data);

/**
 * The backend derives the day itself; nothing about reward/streak/user is sent.
 * The Idempotency-Key makes an accidental double submit return the same result.
 */
export const claimStreak = () =>
  api
    .post('/daily-streak/claim', {}, { headers: { 'Idempotency-Key': crypto.randomUUID() } })
    .then((r) => r.data);
