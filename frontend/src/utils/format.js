export function rewardValue(r) {
  return r.currency === 'INR' ? `₹${r.amount}` : `+${r.amount}`;
}
export function rewardShort(r) {
<<<<<<< HEAD
  return r.currency === 'INR' ? `₹${r.amount} Gift Card` : `+${r.amount} VEs`;
=======
  return r.currency === 'INR' ? `₹${r.amount}` : `+${r.amount} VEs`;
>>>>>>> origin/main
}
export function pad(n) {
  return String(n).padStart(2, '0');
}
export function formatCountdown(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
