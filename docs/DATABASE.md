# Database (MongoDB / Mongoose)
| Collection | Purpose | Key fields / indexes |
|---|---|---|
| users | accounts | name, email (unique), passwordHash (bcrypt, hidden), status |
| wallets | balances | userId (unique), balances.VES, balances.INR |
| streakconfigs | rules | key="default", claimIntervalHours, claimWindowHours, resetOnMiss |
| streakrewards | reward config per day | day (unique), rewardType, currency, amount, title, subtitle, assetType, active, metadata |
| streakcycles | one 7-day run per user | userId, cycleNumber (unique with userId), status ACTIVE/COMPLETED/RESET, claimedDays, claimedCount, lastClaimAt |
| streakclaims | claim history | userId+cycleId+day (UNIQUE), rewardSnapshot, transactionId, referenceId, idempotencyKey (unique per user) |
| wallettransactions | ledger | referenceId (unique, STREAK-XXXXXXXX), amount, balanceBefore, balanceAfter, source=DAILY_STREAK, streakDay |
| auditlogs | security trail | event (STREAK_CLAIM_REQUEST/SUCCESS/REJECTED, STREAK_RESET, DUPLICATE_CLAIM, INVALID_CLAIM, AUTH_FAILED), details, ip |

## Traceability
`StreakClaim.transactionId -> WalletTransaction (balanceBefore/After) -> Wallet.balances`; `StreakClaim.rewardId -> StreakReward`; `StreakClaim.cycleId -> StreakCycle`.
Inspect in Atlas -> Browse Collections.

## Cycle approach
Each 7-day streak is a cycle. Completing Day 7 sets `COMPLETED`; after the interval the next claim creates cycle N+1. A missed day sets `RESET` and the next claim creates a new cycle starting at Day 1.
