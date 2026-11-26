<<<<<<< HEAD
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
=======

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
>>>>>>> origin/main

Cycle statuses:

- `ACTIVE`
- `COMPLETED`
- `RESET`

<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main

```http
POST /api/daily-streak/claim
```

<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main

- `serverTime`
- `nextClaimAt`

<<<<<<< HEAD
The frontend calculates the countdown using `performance.now()` anchored to the backend's `serverTime`.

This prevents changes to the device clock from manipulating the countdown.

When the countdown reaches zero:

1. The frontend calls `GET /api/daily-streak/status`.
2. The backend recalculates the current state.
3. The Claim Reward button is shown only when the backend confirms that the reward is claimable.

## 8. Reward System and Wallet

The seven daily rewards are stored as records in `StreakReward`.
=======
The frontend calculates the countdown using `performance.now()` anchored to the server time.

This prevents users from manipulating the reward timer by changing their device clock.

When the countdown reaches zero, the frontend requests:

```http
GET /api/daily-streak/status
```

The Claim Reward button is displayed only when the backend confirms that the reward is claimable.

## 9. Reward System and Wallet

The seven-day reward configuration is maintained in the `StreakReward` collection.
>>>>>>> origin/main

Reward configuration includes:

- Type
- Currency
- Amount
- Title
- Asset type
- Metadata

<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main

## 13. Testing

### Backend Unit Tests

<<<<<<< HEAD
```powershell
=======
```bash
>>>>>>> origin/main
cd backend
npm test
```

<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main
