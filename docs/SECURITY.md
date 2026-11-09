# Security
| Threat | Protection |
|---|---|
| Edit streak/day/reward in DevTools | Frontend never stores or sends them; backend recomputes from MongoDB |
| Fake `reward`/`amount`/`currency`/`streak` in request | Ignored (zod passthrough, only `day` read); reward read from `StreakReward` |
| Jump to Day 7 | `day` must equal server-computed current day, else `INVALID_DAY` |
| Change device clock | All decisions use server time; frontend countdown uses `performance.now()` anchored to `serverTime` and re-asks the backend at zero |
| Double click / duplicate request | Atomic guard + unique index `userId+cycleId+day` + optional `Idempotency-Key` |
| Simultaneous requests | MongoDB transaction + guarded `findOneAndUpdate` + unique indexes (tested in `scripts/e2e.js`) |
| Another user's identity | userId only from verified JWT; body `userId` ignored |
| Brute force / abuse | express-rate-limit (global, auth, claim) |
| Information leakage | Central error handler returns safe messages only; Helmet; CORS allow-list |
| Secrets | `.env` git-ignored; `.env.example` has placeholders; no production credentials |
| Investigation | `AuditLog` records requests, successes, rejections, duplicates, invalid days, resets, failed logins |
Passwords: bcrypt (12 rounds). JWT secret from env. The dev rewind route is disabled unless `ALLOW_DEV_ROUTES=true` and `NODE_ENV!=production`.
