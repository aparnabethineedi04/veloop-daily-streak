# VELoop Rewards - Daily Streak System (MERN)

A secure, backend-driven Daily Streak & Rewards feature. **React controls the presentation. The backend controls the streak.**

- **Live frontend:** _add your Vercel/Netlify link_
- **Live backend:** _add your Render link_ (`/api/health`)
- **Demo login:** `demo@veloop.test` / `Demo@1234`

## 1. Architecture
```
React (Vite, Bootstrap, CSS Modules)  ->  Express REST API  ->  Node.js  ->  MongoDB (Mongoose)
                                              |                                  |
                                  JWT auth, validation, rate limit    Streak state | Reward config | Wallet ledger
```
Everything important (streak, day, reward, timer, claim status, reset, wallet) is calculated and stored by the backend. The UI only renders the response.

## 2. Folder structure
```
backend/   Express API (models, services, controllers, routes, seed, tests, scripts)
frontend/  React app (pages/DailyStreak components, hooks, services, assets)
docs/      API_DOCUMENTATION.md, DATABASE.md, SECURITY.md, TESTING.md, design-refs/
postman/   VELoop_Daily_Streak.postman_collection.json
SETUP_GUIDE.md  step-by-step beginner guide
```

## 3. Install & run (short version - see SETUP_GUIDE.md for details)
```bash
# backend
cd backend && npm install && cp .env.example .env   # fill MONGO_URI + JWT_SECRET
npm run seed && npm run dev                          # http://localhost:5000
# frontend (new terminal)
cd frontend && npm install && cp .env.example .env
npm run dev                                          # http://localhost:5173
```

## 4. Streak logic
- A **cycle** = one 7-day run (`StreakCycle`). Claimed days, last claim time and status (`ACTIVE`, `COMPLETED`, `RESET`) are stored per user.
- `claimIntervalHours` (default 24) = wait between claims. `claimWindowHours` (default 24) = grace period after the unlock. Both live in `StreakConfig`, not in code.
- Next day unlocks at `lastClaimAt + interval`. If the user does not claim by `lastClaimAt + interval + window`, the streak is **missed**: the cycle is marked `RESET` and Day 1 is available again.
- After Day 7 the cycle is `COMPLETED`; after the interval a new cycle (Day 1) starts.
- The pure calculator is `backend/src/utils/streakState.js` (unit-tested). Card states: `CLAIMED`, `AVAILABLE` (with `isToday`), `LOCKED` (with `isNext` + `nextClaimAt`).

## 5. Claim logic
`POST /api/daily-streak/claim` runs in a MongoDB transaction:
1. Identity from JWT; server time `now`; state recomputed from DB.
2. A client `day` is only an *intent*; it must equal the server's current day, otherwise `INVALID_DAY`.
3. Must be claimable (interval elapsed, not already claimed) else `NOT_AVAILABLE_YET`.
4. Atomic guard on the cycle document (`claimedCount == day-1` and unchanged `lastClaimAt`) - only one of two simultaneous requests passes.
5. Wallet `$inc` -> `WalletTransaction` (balanceBefore/After, `STREAK-XXXXXXXX`) -> `StreakClaim` (unique `userId+cycleId+day`).
6. Reward amount/currency are read from `StreakReward`; client values are ignored. An `Idempotency-Key` header makes retries return the original result.

## 6. Timer architecture
Backend returns `serverTime` + `nextClaimAt`. The frontend counts down with `performance.now()` anchored to `serverTime`, so changing the device clock does nothing. At zero it calls `GET /daily-streak/status`; only if the backend says `claimable` does the UI show **Claim Reward**.

## 7. Reward system / wallet
Rewards (Day 1-7) are rows in `StreakReward` (type, currency, amount, title, assetType, metadata). VES rewards credit `wallet.balances.VES`; gift-card rewards credit `wallet.balances.INR`. Changing a row changes the UI with no code change.

## 8. CPA demo
`CpaDemo.jsx` is a placeholder ("Preparing your reward...") shown while the claim request runs. It never grants anything. No real ad network/SDK is integrated.

## 9. UI
Mobile (<768), tablet (768-1099, 4+3 card grid with side-by-side panels) and desktop (>=1100, 7-card row) layouts; loader, skeleton, error, reset and claim states; supplied artwork cropped from the design PDF; subtle float/glow animations (CSS, `prefers-reduced-motion` respected).

## 10. Security summary
JWT auth on all streak APIs, identity only from token, server-side time, rate limiting, input validation (zod), Helmet, CORS allow-list, safe error messages, audit logs. Details in `docs/SECURITY.md`.

## 11. Testing
`cd backend && npm test` (unit), `npm run test:e2e` (API anti-cheat, needs running server), Postman collection. See `docs/TESTING.md`.

## 12. Deployment
Atlas (DB) -> Render (backend) -> Vercel/Netlify (frontend). Step-by-step in `SETUP_GUIDE.md`.

## 13. Known limitations
- Claim and reward grant happen in one backend call; the CPA step is a visual placeholder until the real integration is added.
- Gift-card rewards are credited as INR balance (no real voucher payout).
- Missed-day testing uses a dev-only rewind route (stored timestamps are shifted; server clock is unchanged).
- Render free tier sleeps when idle (first request can be slow).
