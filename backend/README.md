# VELoop Daily Streak - Backend (Express + MongoDB)

Backend-driven streak, reward and wallet system. The frontend only renders what this API returns.

## Setup
```bash
cd backend
npm install
cp .env.example .env      # fill MONGO_URI (your own Atlas free cluster) and JWT_SECRET
npm run seed              # rewards, streak rules, demo user
npm run dev               # http://localhost:5000
npm test                  # streak-logic unit tests (no database needed)
```
Demo login (after seed): `demo@veloop.test` / `Demo@1234`

## Endpoints
| Method | Path | Purpose |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | JWT auth |
| GET | /api/daily-streak | Full page state (cards, stats, ultimate reward, wallet, serverTime, nextClaimAt) |
| GET | /api/daily-streak/status | Light state for the timer refresh |
| POST | /api/daily-streak/claim | Claim (server derives the day; body `day` is only an intent) |
| GET | /api/daily-streak/history | Claim history |
| GET | /api/wallet | Balances |

## Key rules
- Streak, day, reward, timer, reset and wallet are all computed/stored on the server (`src/utils/streakState.js`, `src/services/streak.service.js`).
- Claim runs in a MongoDB transaction with an atomic guard on the cycle document and unique indexes (`userId+cycleId+day`) -> no duplicates, no double credit under concurrency.
- Interval/grace window/reward values live in `StreakConfig` and `StreakReward` (no hardcoded 24h).
- Missed day: claim not made within `claimIntervalHours + claimWindowHours` after the last claim -> cycle becomes `RESET`, Day 1 again.
- Client-supplied `reward`, `amount`, `streak`, `userId` are ignored; identity comes from the JWT.
- Set `USE_TRANSACTIONS=false` only for a plain local mongod (Atlas supports transactions).
- Missed-day testing: set `ALLOW_DEV_ROUTES=true` locally and call `POST /api/dev/rewind {"hours":60}` after a claim.
