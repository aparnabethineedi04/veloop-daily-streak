
# VELoop Rewards – Daily Streak System (MERN)

A secure, backend-driven Daily Streak and Rewards feature built using the MERN stack.

**React controls the presentation. The backend controls the streak.**

## Live Application

- **Frontend:** https://veloop-daily-streak-beige.vercel.app
- **Backend:** https://veloop-daily-streak-5xzt.onrender.com
- **Backend Health Check:** https://veloop-daily-streak-5xzt.onrender.com/api/health

### Demo Login

- **Email:** `demo@veloop.test`
- **Password:** `Demo@1234`

---

## 1. Project Overview

VELoop Rewards is a seven-day daily streak and reward system. Users can claim rewards according to a backend-controlled schedule.

The backend manages streak progress, claim eligibility, timers, missed-day resets, reward configuration, wallet balances, and transaction records.

The frontend displays the state returned by the backend.

## 2. Technology Stack

- **Frontend:** React.js, Vite, Bootstrap, CSS Modules
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Authentication:** JWT
- **Validation:** Zod
- **Deployment:** Vercel and Render

## 3. Architecture

```text
React (Vite, Bootstrap, CSS Modules)
                |
                v
         Express REST API
                |
                v
             Node.js
                |
                v
        MongoDB (Mongoose)
```

### Backend Responsibilities

- JWT authentication
- Input validation
- Rate limiting
- Streak state management
- Reward configuration
- Claim eligibility
- Wallet management
- Transaction ledger

The backend is the source of truth for important reward and streak operations.

## 4. Project Structure

```text
veloop-daily-streak/
├── backend/
├── frontend/
├── docs/
├── postman/
├── SETUP_GUIDE.md
└── README.md
```

- `backend/` – Express API, models, services, controllers, routes, and tests.
- `frontend/` – React application, components, hooks, services, and assets.
- `docs/` – API, database, security, and testing documentation.
- `postman/` – Postman API collection.
- `SETUP_GUIDE.md` – Detailed setup instructions.

## 5. Installation and Setup

Refer to `SETUP_GUIDE.md` for detailed setup instructions.

### Prerequisites

- Node.js
- npm
- MongoDB Atlas account
- Git
- Visual Studio Code

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Configure the following values in `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Seed the database and start the backend:

```bash
npm run seed
npm run dev
```

Backend local URL:

`http://localhost:5000`

### Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

Configure `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend local URL:

`http://localhost:5173`

**Windows PowerShell note:** Use `Copy-Item .env.example .env` instead of `cp .env.example .env`.

## 6. Streak Logic

A streak cycle represents one seven-day reward run.

Each user's `StreakCycle` stores claimed days, last claim time, and cycle status.

Cycle statuses:

- `ACTIVE`
- `COMPLETED`
- `RESET`

Configuration:

- `claimIntervalHours` – default waiting period of 24 hours between claims.
- `claimWindowHours` – default 24-hour grace period after a reward becomes available.

Both settings are stored in `StreakConfig`.

### Missed-Day Handling

If a user does not claim within the permitted claim window:

- The current cycle is marked as `RESET`.
- Day 1 becomes available again.

After Day 7 is successfully claimed:

- The cycle is marked as `COMPLETED`.
- A new cycle starts after the configured interval.

The streak calculation logic is maintained in:

`backend/src/utils/streakState.js`

Frontend card states:

- `CLAIMED`
- `AVAILABLE`
- `LOCKED`

Additional state information includes `isToday`, `isNext`, and `nextClaimAt`.

## 7. Claim Logic

The reward claim endpoint is:

```http
POST /api/daily-streak/claim
```

The claim process follows these steps:

1. User identity is obtained from the JWT token.
2. The backend uses server time and recalculates the streak state from the database.
3. The client-provided day is treated only as an intent and must match the server-calculated day.
4. The backend checks reward eligibility and whether the reward has already been claimed.
5. An atomic guard protects against simultaneous duplicate claims.
6. The wallet balance is updated using `$inc`.
7. A `WalletTransaction` record stores transaction details, including `balanceBefore`, `balanceAfter`, and a transaction reference.
8. A `StreakClaim` record is created with a unique `userId + cycleId + day` combination.
9. Reward amount and currency are retrieved from `StreakReward`. Client-provided reward values are ignored.

An `Idempotency-Key` header is used to handle retries and prevent duplicate reward grants.

The claim operation uses a MongoDB transaction to maintain consistency across related database updates.

## 8. Timer Architecture

The backend provides:

- `serverTime`
- `nextClaimAt`

The frontend calculates the countdown using `performance.now()` anchored to the server time.

This prevents users from manipulating the reward timer by changing their device clock.

When the countdown reaches zero, the frontend requests:

```http
GET /api/daily-streak/status
```

The Claim Reward button is displayed only when the backend confirms that the reward is claimable.

## 9. Reward System and Wallet

The seven-day reward configuration is maintained in the `StreakReward` collection.

Reward configuration includes:

- Type
- Currency
- Amount
- Title
- Asset type
- Metadata

Wallet credit handling:

- VES rewards are credited to `wallet.balances.VES`.
- Gift-card rewards are credited to `wallet.balances.INR`.

Reward configuration can be modified through database configuration without changing the frontend presentation code.

## 10. CPA Demo

`CpaDemo.jsx` provides a placeholder screen displaying:

**"Preparing your reward..."**

It is shown while the claim request is being processed.

The CPA component does not independently grant rewards. No real advertising network or CPA SDK is integrated in this version.

## 11. User Interface and Responsiveness

The application provides responsive layouts for different screen sizes.

- **Mobile:** Below 768px
- **Tablet:** 768px–1099px, with a 4+3 reward card grid and side-by-side panels
- **Desktop:** 1100px and above, with a seven-card row

UI features include:

- Loading indicators
- Skeleton screens
- Error states
- Streak reset states
- Reward claim states
- Responsive reward cards
- Artwork adapted from the supplied design reference
- Subtle floating and glow animations
- `prefers-reduced-motion` support for accessibility

## 12. Security

Security measures implemented include:

- JWT authentication for streak APIs
- User identity obtained from the authentication token
- Backend-controlled time and reward eligibility
- Rate limiting
- Input validation using Zod
- Helmet security middleware
- CORS allow-list
- Safe error responses
- Audit logging
- Atomic claim protection
- MongoDB transaction-based wallet updates

For more information, refer to `docs/SECURITY.md`.

## 13. Testing

### Backend Unit Tests

```bash
cd backend
npm test
```

### Backend E2E Tests

```bash
npm run test:e2e
```

The E2E tests require the backend server to be running.

### Test Results

- **Backend unit tests:** 10/10 passed
- **Backend E2E tests:** 18/18 passed

The Postman collection is available at:

`postman/VELoop_Daily_Streak_postman_collection.json`

For detailed testing information, refer to `docs/TESTING.md`.

## 14. Deployment

The application uses the following deployment architecture:

| Component | Platform |
|---|---|
| Database | MongoDB Atlas |
| Backend | Render |
| Frontend | Vercel |

The backend and frontend are configured to communicate through the deployed API.

For setup and deployment instructions, refer to `SETUP_GUIDE.md`.

## 15. Known Limitations

- The CPA step is currently a visual placeholder. A real CPA or advertising network integration has not been added.
- Gift-card rewards are credited as INR wallet balance; actual voucher payout is not implemented.
- Missed-day testing uses a development-only rewind route that shifts stored timestamps without changing the server clock.
- The Render free tier may sleep when idle, so the first request after inactivity can take longer to respond.

---

## Project Information

**Project:** VELoop Rewards – Daily Streak System

**Technology:** MongoDB, Express.js, React.js, Node.js, Bootstrap and CSS Modules

**Project Status:** Development, testing and deployment completed.
