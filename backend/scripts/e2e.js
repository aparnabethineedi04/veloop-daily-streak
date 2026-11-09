/**
 * End-to-end API test. Run against a RUNNING backend (seeded):
 *   BASE_URL=http://localhost:5000/api node scripts/e2e.js
 * For the missed-day part start the backend with ALLOW_DEV_ROUTES=true.
 * Needs Node 18+ (built-in fetch). No extra packages.
 */
const BASE = process.env.BASE_URL || 'http://localhost:5000/api';
let pass = 0, fail = 0;
const ok = (cond, name, extra = '') => {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name} ${extra}`); }
};
async function call(method, path, token, body, headers = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = {};
  try { json = await res.json(); } catch { /* empty */ }
  return { status: res.status, json };
}
async function newUser(tag) {
  const email = `${tag}_${Date.now()}_${Math.floor(Math.random() * 1e4)}@test.dev`;
  const r = await call('POST', '/auth/register', null, { name: 'Test User', email, password: 'Passw0rd!' });
  return { token: r.json.token, id: r.json.user.id };
}

(async () => {
  console.log('1. Auth');
  const noAuth = await call('GET', '/daily-streak');
  ok(noAuth.status === 401, 'unauthorized request rejected (401)');

  console.log('2. New user sees Day 1 claimable (state from backend)');
  const A = await newUser('a');
  const s0 = await call('GET', '/daily-streak', A.token);
  ok(s0.json.streak.currentDay === 1 && s0.json.streak.claimable === true, 'Day 1 available');
  ok(s0.json.rewards.length === 7 && s0.json.rewards[1].reward.amount === 10, 'reward config comes from DB (Day 2 = 10)');

  console.log('3. Concurrent claim: only ONE reward granted');
  const [c1, c2] = await Promise.all([
    call('POST', '/daily-streak/claim', A.token, {}, { 'Idempotency-Key': 'k1' + Date.now() }),
    call('POST', '/daily-streak/claim', A.token, {}, { 'Idempotency-Key': 'k2' + Date.now() }),
  ]);
  const wins = [c1, c2].filter((r) => r.status === 200).length;
  ok(wins === 1, 'exactly one concurrent request succeeded', `statuses ${c1.status}/${c2.status}`);
  const w1 = await call('GET', '/wallet', A.token);
  ok(w1.json.wallet.VES === 5, 'wallet credited +5 only once', `VES=${w1.json.wallet.VES}`);

  console.log('4. Duplicate / locked claim');
  const dup = await call('POST', '/daily-streak/claim', A.token, {});
  ok(dup.status === 403 && dup.json.code === 'NOT_AVAILABLE_YET', 'Day 2 locked right after Day 1', JSON.stringify(dup.json));
  const st = await call('GET', '/daily-streak/status', A.token);
  ok(!!st.json.streak.nextClaimAt && !!st.json.serverTime, 'server provides nextClaimAt + serverTime');

  console.log('5. Fake day / fake reward / fake user / fake streak');
  const fakeDay = await call('POST', '/daily-streak/claim', A.token, { day: 7 });
  ok(fakeDay.status === 400 && fakeDay.json.code === 'INVALID_DAY', 'jumping to Day 7 rejected');
  const B = await newUser('b');
  const fakeUser = await call('POST', '/daily-streak/claim', B.token, { userId: A.id, reward: 999999, amount: 999999, streak: 7, currency: 'INR' });
  ok(fakeUser.status === 200, 'claim works for the authenticated user');
  const wB = await call('GET', '/wallet', B.token);
  ok(wB.json.wallet.VES === 5 && wB.json.wallet.INR === 0, 'fake reward/currency ignored (B got +5 VES)');
  const wA = await call('GET', '/wallet', A.token);
  ok(wA.json.wallet.VES === 5, 'other user (A) untouched by fake userId');

  console.log('6. Next day unlock + missed-day reset (needs ALLOW_DEV_ROUTES=true)');
  const rew = await call('POST', '/dev/rewind', A.token, { hours: 25 });
  if (rew.status === 404) {
    console.log('  SKIP  dev routes disabled - start backend with ALLOW_DEV_ROUTES=true to test these');
  } else {
    const s1 = await call('GET', '/daily-streak', A.token);
    ok(s1.json.streak.currentDay === 2 && s1.json.streak.claimable === true, 'after 25h Day 2 becomes claimable');
    const c3 = await call('POST', '/daily-streak/claim', A.token, { day: 2, reward: 1000000 });
    ok(c3.status === 200 && c3.json.claim.reward.amount === 10, 'Day 2 claim pays configured +10 (fake 1,000,000 ignored)');
    const w2 = await call('GET', '/wallet', A.token);
    ok(w2.json.wallet.VES === 15, 'wallet = 15 VES', `VES=${w2.json.wallet.VES}`);

    await call('POST', '/dev/rewind', A.token, { hours: 60 });
    const s2 = await call('GET', '/daily-streak', A.token);
    ok(s2.json.streak.currentDay === 1 && s2.json.streak.currentStreak === 0, 'missed day -> streak reset to Day 1');
    ok(s2.json.streak.lastReset && s2.json.streak.lastReset.previousStreak === 2, 'reset info reports previous streak 2');
    const c4 = await call('POST', '/daily-streak/claim', A.token, {});
    ok(c4.status === 200 && c4.json.claim.day === 1, 'user can start again from Day 1');
  }

  console.log('7. History');
  const h = await call('GET', '/daily-streak/history', A.token);
  ok(Array.isArray(h.json.history) && h.json.history.length >= 1, 'claim history stored');

  console.log(`\nResult: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
