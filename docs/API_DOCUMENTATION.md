# API Documentation
Base URL: `http://localhost:5000/api` (set `VITE_API_URL` in the frontend). Protected routes need `Authorization: Bearer <token>`.
All errors: `{ "success": false, "code": "...", "message": "..." }` (no raw database errors).

## Auth
### POST /auth/register
Body `{ "name", "email", "password" (8+) }` -> `201 { success, token, user }`. `409 EMAIL_TAKEN`.
### POST /auth/login
Body `{ "email", "password" }` -> `200 { success, token, user }`. `401 INVALID_CREDENTIALS`.
### GET /auth/me  (auth) -> `{ success, user }`

## GET /daily-streak  (auth)
Full page state.
```json
{
  "success": true,
  "serverTime": "2026-09-05T12:00:00.000Z",
  "streak": { "currentStreak": 1, "currentDay": 2, "checkedIn": 1, "totalRewards": 7,
    "status": "WAITING", "claimable": false, "nextClaimAt": "2026-09-06T12:00:00.000Z",
    "remainingMs": 86399000, "cycleNumber": 1, "lastReset": null },
  "stats": { "totalRewards": 7, "checkedIn": 1,
    "nextReward": { "day": 2, "amount": 10, "currency": "VES", "type": "VES", "title": "Daily Reward", "subtitle": "10 VEs" } },
  "ultimateReward": { "day": 7, "amount": 5, "currency": "INR", "type": "GIFT_CARD", "title": "Ultimate Reward", "subtitle": "Amazon Gift Card", "assetType": "crown", "unlockDay": 7 },
  "rewards": [ { "day": 1, "status": "CLAIMED", "isToday": false, "isNext": false, "nextClaimAt": null,
                 "reward": { "type": "VES", "currency": "VES", "amount": 5, "title": "Daily Reward", "subtitle": "5 VEs", "assetType": "coin", "badge": null, "isUltimate": false } } ],
  "wallet": { "VES": 125, "INR": 0 }
}
```
`streak.status`: `FRESH | FRESH_NEXT_CYCLE | MISSED | READY | WAITING | COMPLETE_WAITING`. Card `status`: `CLAIMED | AVAILABLE | LOCKED` (`isToday` = actionable day, `isNext` = waiting day with countdown).
A detected missed streak is persisted (cycle -> `RESET`) when this endpoint is read.

## GET /daily-streak/status  (auth)
Light version: `{ success, serverTime, streak, wallet }`. Used when the countdown reaches zero.

## POST /daily-streak/claim  (auth, rate limited 15/min)
Headers: optional `Idempotency-Key`. Body: `{}` (optional `{ "day": n }` as an intent only; `reward/amount/currency/streak/userId` are ignored).
Success `200`: the full GET /daily-streak payload plus
```json
{ "claim": { "claimId": "...", "day": 2, "reward": { "type": "VES", "currency": "VES", "amount": 10 }, "claimedAt": "...", "transactionId": "...", "referenceId": "STREAK-9F3A21BC" }, "idempotentReplay": false }
```
Errors: `400 INVALID_DAY`, `403 NOT_AVAILABLE_YET` (includes `nextClaimAt`, `serverTime`), `409 ALREADY_CLAIMED`, `401 UNAUTHENTICATED`, `429 RATE_LIMITED`.

## GET /daily-streak/history?page=1&limit=20  (auth)
`{ success, page, limit, total, history: [ { claimId, cycleNumber, day, reward, status, claimedAt, transactionId, referenceId } ] }`

## GET /wallet  (auth) -> `{ success, wallet: { VES, INR } }`
## GET /health -> `{ success, status: "ok", serverTime }`

## Dev only: POST /dev/rewind  (needs ALLOW_DEV_ROUTES=true, not in production)
Body `{ "hours": 60 }` shifts the stored `lastClaimAt` back, to test unlock/missed-day logic.
