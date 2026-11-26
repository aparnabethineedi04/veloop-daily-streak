# Testing
## Automated
1. `cd backend && npm test` - 10 unit tests of the pure streak logic (no database).
2. With the backend running and seeded (and `ALLOW_DEV_ROUTES=true` in `.env`): `npm run test:e2e`.
   Covers: unauthorized, normal claim, concurrent claim (+5 only once), locked day, fake day, fake reward, fake streak, fake user, next-day unlock, missed day -> reset, restart at Day 1, history.

## Manual checklist (browser)
| Case | How | Expected |
|---|---|---|
| Normal claim | Log in, click Claim Reward on Day 1 | CPA demo, then Day 1 Claimed, Day 2 shows countdown, gem balance +5 |
| Already claimed | Refresh / click again | Day 1 stays Claimed; no second reward |
| Locked reward | Try Day 2 early (Postman) | 403 NOT_AVAILABLE_YET |
| Timer | Watch Day 2 countdown | Counts down from server `nextClaimAt` |
| Changed device time | Change PC/phone clock forward 24h | Countdown/claim unchanged; backend refuses early claim |
| Missed day + reset | Claim Day 1, then `POST /dev/rewind {"hours":60}`, reload | Reset banner, Day 1 available, streak 0 |
| Duplicate request | Postman: send claim twice | 1st 200, 2nd 403/409 |
| Concurrent | e2e script step 3 | One success, wallet +5 once |
| Fake reward/day/streak/user | Postman bodies in the collection (negative tests) | Ignored / rejected |
| Refresh state | Reload after claim | Same state from backend |
| Logout/login | Log out, log in | Same streak from MongoDB |
| Multiple tabs | Claim in tab A, then claim in tab B | B gets "already claimed" / not available |
| Unauthorized | Call API without token | 401 |

## Missed-day test (documented)
Day 1 claimed -> `POST /dev/rewind {"hours": 25}` -> Day 2 claimed -> `POST /dev/rewind {"hours": 60}` -> `GET /daily-streak` returns `currentDay: 1`, `currentStreak: 0`, `lastReset.previousStreak: 2`; a `STREAK_RESET` audit log is written.

## UI / button checklist
| Control | Expected |
|---|---|
| Header back arrow | Goes to the previous page (or scrolls to top if there is none) |
| Header streak pill / VEs pill | Show backend streak and wallet balance; VEs increases after each VE claim |
| Log out | Returns to login; logging in again shows the same streak |
| Card "Claim Reward" | CPA demo (~2.6 s) -> reveal modal -> "Awesome!" closes -> day becomes Claimed, next card shows countdown |
| Streak Calendar button | Opens sheet with 7 days + recent claims; closes with X, Esc or clicking outside |
| Stats tiles / progress bar | Update after every claim (values come from the API) |
| Countdown at 00:00:00 | Page asks `/daily-streak/status`; Claim appears only if the backend confirms |
| Resize 320 / 375 / 768 / 1024 / 1440 | No horizontal scroll; layout switches mobile -> tablet -> desktop |
| Streak-at-risk line (divider) | Appears only when a reward is claimable and a streak is running; counts down to the backend deadline; at zero the page re-checks the backend |
| Claim Day 7 | Reveal modal says "Ultimate Reward unlocked!" |
| Header VEs balance | Briefly scales up when the balance changes |
