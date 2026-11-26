# VELoop Rewards – Daily Streak System (MERN)

A secure, backend-driven Daily Streak & Rewards feature built using the MERN stack.

**React controls the presentation. The backend controls the streak.**

- **Live frontend:** Not deployed yet – follow the local setup instructions below.
- **Live backend:** Not deployed yet – local API runs at `http://localhost:5000`
- **Backend health check:** `http://localhost:5000/api/health`
- **Demo login:** `demo@veloop.test` / `Demo@1234`

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

Authentication: JWT
Validation: Zod
Security: Helmet, CORS, Rate Limiting

Database:
- Streak state
- Reward configuration
- Wallet balances
- Transaction ledger
```

Everything important—including streak, day, reward, timer, claim status, reset, and wallet—is calculated and stored by the backend. The frontend only renders the API response.

## 2. Folder Structure

```text
VELoop-Daily-Streak/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   ├── seed/
│   ├── scripts/
│   ├── tests/
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── pages/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   ├── design-refs/
│   ├── preview/
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE.md
│   ├── SECURITY.md
│   └── TESTING.md
│
├── postman/
│   └── VELoop_Daily_Streak.postman_collection.json
│
├── .gitignore
├── README.md
└── SETUP_GUIDE.md
```

## 3. Requirements

Install the following before running the project:

- Node.js and npm
- MongoDB Atlas account or local MongoDB installation
- Visual Studio Code
- Git
- Postman (for API testing)

## 4. Installation and Setup

### Backend Setup

Open a terminal in the project root.

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Open the newly created `.env` file and configure:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
```

Add any other environment variables required by your backend configuration.

Run the database seed script:

```powershell
npm run seed
```

Start the backend:

```powershell
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

### Frontend Setup

Open a second terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
```

Configure the frontend environment file according to the backend API URL.

Start the frontend:

```powershell
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

**Note:** For Linux/macOS, use `cp .env.example .env` instead of the PowerShell `Copy-Item` command.

For detailed instructions, refer to `SETUP_GUIDE.md`.

## 5. Streak Logic

A **cycle** represents one seven-day run. Each user's claimed days, last claim time, and cycle status are stored in the database.

Cycle statuses:

- `ACTIVE`
- `COMPLETED`
- `RESET`

The streak configuration uses:

- `claimIntervalHours` – Default 24 hours; the waiting interval between claims.
- `claimWindowHours` – Default 24 hours; the grace period after the next reward unlocks.

Both values are stored in `StreakConfig`, rather than being hardcoded into the frontend.

### Streak Rules

1. The next day unlocks at `lastClaimAt + interval`.
2. If the user does not claim within the configured claim window, the cycle is marked `RESET`.
3. After a reset, Day 1 becomes available again.
4. After Day 7, the cycle is marked `COMPLETED`.
5. After the configured interval, a new cycle can begin.

The pure streak calculator is located at:

```text
backend/src/utils/streakState.js
```

It is unit-tested.

Card states:

- `CLAIMED`
- `AVAILABLE` – Includes `isToday`.
- `LOCKED` – Includes `isNext` and `nextClaimAt`.

## 6. Claim Logic and Anti-Cheat Protection

The endpoint:

```http
POST /api/daily-streak/claim
```

processes reward claims through a MongoDB transaction.

The claim flow:

1. User identity is obtained from the JWT.
2. Server time is used to calculate the current streak state.
3. A client-provided `day` is treated only as an intent.
4. The requested day must match the server's current day; otherwise, `INVALID_DAY` is returned.
5. The claim must be available and not previously claimed; otherwise, `NOT_AVAILABLE_YET` is returned.
6. An atomic guard checks the cycle document using `claimedCount == day - 1` and the unchanged `lastClaimAt`.
7. Wallet balance is updated using `$inc`.
8. A `WalletTransaction` record is created with balance information and a transaction reference such as `STREAK-XXXXXXXX`.
9. A `StreakClaim` record is created with a unique `userId + cycleId + day` constraint.
10. Reward amount and currency are read from `StreakReward`. Client-provided reward values are ignored.

An `Idempotency-Key` header supports safe retries by returning the original result.

## 7. Timer Architecture

The backend returns:

- `serverTime`
- `nextClaimAt`

The frontend calculates the countdown using `performance.now()` anchored to the backend's `serverTime`.

This prevents changes to the device clock from manipulating the countdown.

When the countdown reaches zero:

1. The frontend calls `GET /api/daily-streak/status`.
2. The backend recalculates the current state.
3. The Claim Reward button is shown only when the backend confirms that the reward is claimable.

## 8. Reward System and Wallet

The seven daily rewards are stored as records in `StreakReward`.

Reward configuration includes:

- Type
- Currency
- Amount
- Title
- Asset type
- Metadata

Wallet credit rules:

- VES rewards credit `wallet.balances.VES`.
- Gift-card rewards credit `wallet.balances.INR`.

Changing a reward configuration updates the reward data without requiring frontend code changes.

## 9. CPA Demo

`CpaDemo.jsx` is a placeholder displayed while a claim request is being processed.

It displays:

```text
Preparing your reward...
```

It does not grant rewards independently.

No real advertising network or CPA SDK is integrated.

## 10. User Interface and Design

The interface follows the supplied mobile and desktop designs, with additional gaming-style polish.

### Mobile and Tablet

- Header with back navigation, Daily Streak title, flame icon, and VES balance.
- Calendar banner.
- Streak panel with status chip.
- Streak Calendar button.
- Three statistic tiles.
- Progress bar.
- Ultimate Reward section.
- Seven reward cards arranged in a 4+3 layout.
- Why Maintain Your Streak section.
- Official footer.

### Desktop

- Header bar with a seven-day streak badge.
- Daily Check-In Rewards hero section with gift artwork.
- Statistics section.
- Ultimate Reward panel.
- Seven reward cards in one row.
- Benefits strip.
- Trust information section.

### Reward Card States

- **Claimed:** Green styling.
- **Today:** Gold styling with a Today tab and Claim button.
- **Locked:** Displays the live countdown on the next reward card.
- **VIP / Day 7:** Gold styling.

### Streak Journey

The seven-day Streak Journey calendar includes:

- Completed days in green.
- Today's reward in gold with a pulse effect.
- Upcoming rewards.
- A live counter showing the number of days remaining until the Ultimate Reward.
- Day selection to navigate to the corresponding reward card.

The Streak Calendar button opens a visual calendar sheet with rewards, progress, and recent claims.

### Animations and Interactions

- Staggered entrance animations.
- Floating artwork.
- Count-up numbers.
- Animated progress bar.
- Claim button shine effect.
- Soft pulse on today's reward card.
- Hover lift.
- Reward reveal animation.
- Reduced-motion support through `prefers-reduced-motion`.

### Claim Flow

1. CPA demo displays Preparing your reward.
2. Claim request is sent to the backend.
3. Reward reveal is displayed after backend confirmation.
4. UI refreshes using the latest API response.

The application also includes:

- Loader states.
- Themed skeleton screens.
- Error states.
- Reset states.
- Streak-at-risk messages with backend-derived deadlines.

### Responsive Breakpoints

| Device | Breakpoint |
|---|---|
| Mobile | Below 768px |
| Tablet | 768px–1023px |
| Desktop | 1024px and above |

Artwork from the supplied designs is stored as transparent PNG assets under `frontend/src/assets`.

## 11. Security

The application includes:

- JWT authentication on protected streak APIs.
- User identity derived only from the authentication token.
- Server-side time validation.
- Rate limiting.
- Zod input validation.
- Helmet security headers.
- CORS allow-list.
- Safe error messages.
- Audit logging.
- Atomic claim protection.
- MongoDB transaction handling.
- Idempotency support.

For more information, see:

```text
docs/SECURITY.md
```

## 12. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Backend health check |
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Get authenticated user |
| GET | `/api/daily-streak` | Get streak information |
| GET | `/api/daily-streak/status` | Get current claim status |
| POST | `/api/daily-streak/claim` | Claim daily reward |
| GET | `/api/daily-streak/history` | Get streak history |
| GET | `/api/wallet` | Get wallet information |

Authentication is required for protected endpoints.

Detailed request and response information is available in:

```text
docs/API_DOCUMENTATION.md
```

## 13. Testing

### Backend Unit Tests

```powershell
cd backend
npm test
```

### Backend End-to-End Tests

Start the backend server in one terminal, then run:

```powershell
cd backend
npm run test:e2e
```

The end-to-end tests require a running server and the appropriate test database configuration.

### Postman Testing

Import the following collection into Postman:

```text
postman/VELoop_Daily_Streak.postman_collection.json
```

The collection can be used to test the API endpoints.

Additional testing information is available in:

```text
docs/TESTING.md
```

## 14. Deployment

The planned deployment architecture is:

```text
MongoDB Atlas
     |
     v
Render – Backend API
     |
     v
Vercel / Netlify – Frontend
```

Deployment instructions are available in `SETUP_GUIDE.md`.

Before deployment:

1. Configure production MongoDB connection details.
2. Set a secure JWT secret.
3. Configure the frontend API base URL.
4. Configure production CORS origins.
5. Deploy the backend.
6. Verify the backend health endpoint.
7. Deploy the frontend.
8. Test authentication and reward claims.

## 15. Known Limitations

- The CPA step is a visual placeholder; no real advertising integration is included.
- Claim and reward grant happen through one backend call.
- Gift-card rewards are credited as INR wallet balance; no real voucher payout is integrated.
- Missed-day testing uses a development-only rewind route. Stored timestamps are shifted; the server clock is unchanged.
- Render's free tier may sleep when idle, so the first request can take longer.

## 16. Project Summary

VELoop Rewards – Daily Streak System demonstrates a secure, backend-driven reward application using the MERN stack.

The project focuses on:

- Backend-controlled streak management.
- Secure reward claiming.
- JWT authentication.
- Atomic database transactions.
- Wallet and transaction management.
- Server-synchronized countdowns.
- Responsive React UI.
- API documentation and testing.
- Anti-cheat and idempotency protection.

**The core principle: The frontend displays the experience, while the backend remains the source of truth for every reward and streak operation.**
