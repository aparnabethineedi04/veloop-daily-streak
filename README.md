
# VELoop Rewards – Daily Streak System (MERN)

A secure, backend-driven Daily Streak and Rewards feature built using the MERN stack.

**React controls the presentation. The backend controls the streak.**

- **Live Frontend:** https://veloop-daily-streak-beige.vercel.app
- **Live Backend:** https://veloop-daily-streak-5xzt.onrender.com
- **Backend Health Check:** https://veloop-daily-streak-5xzt.onrender.com/api/health

**Demo Login**
- Email: `demo@veloop.test`
- Password: `Demo@1234`

---

## 1. Architecture

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

Backend responsibilities:
- JWT authentication
- Input validation
- Rate limiting
- Streak state management
- Reward configuration
- Claim eligibility
- Wallet and transaction ledger
```

Everything important, including streak progress, current day, reward eligibility, timer, claim status, missed-day reset, and wallet balance, is calculated and managed by the backend.

The frontend is responsible for displaying the backend response.

## 2. Folder Structure

```text
veloop-daily-streak/
├── backend/
├── frontend/
├── docs/
├── postman/
├── SETUP_GUIDE.md
└── README.md
```

## 3. Installation and Setup

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
npm run seed
npm run dev
```

Configure `MONGO_URI` and `JWT_SECRET` in `backend/.env`.

Backend runs locally at:

`http://localhost:5000`

### Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Configure the frontend API URL in `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Frontend runs locally at:

`http://localhost:5173`

**Note:** The commands use Git Bash syntax. In Windows PowerShell, use `Copy-Item .env.example .env` instead.

## 4. Streak Logic

A **streak cycle** represents one seven-day reward run.

- Each user has a `StreakCycle` containing claimed days, last claim time, and cycle status.
- Cycle statuses include `ACTIVE`, `COMPLETED`, and `RESET`.
- `claimIntervalHours` (default: 24) defines the waiting period between claims.
- `claimWindowHours` (default: 24) defines the grace period after a reward becomes available.
- Both settings are stored in `StreakConfig`.

### Missed-Day Handling

If a user does not claim within the permitted claim window:

- The current cycle is marked as `RESET`.
- Day 1 becomes available again.

After Day 7 is successfully claimed:

- The cycle is marked as `COMPLETED`.
- A new cycle starts after the configured interval.

The streak calculation logic is maintained in:

`backend/src/utils/streakState.js`

The frontend displays these card states:

- `CLAIMED`
- `AVAILABLE`
- `LOCKED`

Additional card information includes `isToday`, `isNext`, and `nextClaimAt`.

## 5. Claim Logic

The reward claim endpoint is:

```http
POST /api/daily-streak/claim
```

The claim process follows these steps:

1. User identity is obtained from the JWT token.
2. The backend uses server time and recalculates the streak state from the database.
3. The client-provided day is treated only as an intent and must match the server-calculated day.
4. The backend checks whether the reward is eligible and has not already been claimed.
5. An atomic guard ensures that only one simultaneous claim request succeeds.
6. The wallet balance is updated using `$inc`.
7. A `WalletTransaction` record stores transaction details, including `balanceBefore`, `balanceAfter`, and a transaction reference.
8. A `StreakClaim` record is created with a unique `userId + cycleId + day` combination.
9. Reward amount and currency are retrieved from `StreakReward`. Client-provided reward values are ignored.

An `Idempotency-Key` header is used to handle retries and prevent duplicate reward grants.

The claim operation uses a MongoDB transaction to maintain consistency across related database updates.

## 6. Timer Architecture

The backend provides:

- `serverTime`
- `nextClaimAt`

The frontend calculates the countdown using `performance.now()` anchored to the server time.

This prevents users from changing their device clock to manipulate the reward timer.

When the countdown reaches zero, the frontend requests:

```http
GET /api/daily-streak/status
```

The Claim Reward button is displayed only when the backend confirms that the reward is claimable.

## 7. Reward System and Wallet

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

## 8. CPA Demo

`CpaDemo.jsx` provides a placeholder screen displaying:

**"Preparing your reward..."**

It is shown while the claim request is being processed.

The CPA component does not independently grant rewards. No real advertising network or CPA SDK is integrated in this version.

## 9. User Interface and Responsiveness

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

## 10. Security

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

## 11. Testing

Backend unit tests:

```bash
cd backend
npm test
```

Backend E2E tests:

```bash
npm run test:e2e
```

The E2E tests require the backend server to be running.

### Test Results

- Backend unit tests: **10/10 passed**
- Backend E2E tests: **18/18 passed**

The Postman collection is available at:

`postman/VELoop_Daily_Streak_postman_collection.json`

For detailed testing information, refer to `docs/TESTING.md`.

## 12. Deployment

The application uses the following deployment architecture:

- **Database:** MongoDB Atlas
- **Backend:** Render
- **Frontend:** Vercel

The backend and frontend are configured to communicate through the deployed API.

For setup and deployment instructions, refer to `SETUP_GUIDE.md`.

## 13. Known Limitations

- The CPA step is currently a visual placeholder. A real CPA or advertising network integration has not been added.
- Gift-card rewards are credited as INR wallet balance; actual voucher payout is not implemented.
- Missed-day testing uses a development-only rewind route that shifts stored timestamps without changing the server clock.
- The Render free tier may sleep when idle, so the first request after inactivity can take longer to respond.

---

**Project:** VELoop Rewards – Daily Streak System

**Technology:** MongoDB, Express.js, React.js, Node.js, Bootstrap and CSS Modules

**Project Status:** Development, testing and deployment completed.
