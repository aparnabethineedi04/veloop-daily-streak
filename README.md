# VELoop Rewards – Daily Streak System (MERN)

A secure, backend-driven Daily Streak and Rewards application built using the MERN stack.

**Core Principle: React controls the presentation. The backend controls the streak.**

---

## Live Application

- **Frontend:** https://veloop-daily-streak-beige.vercel.app
- **Backend:** https://veloop-daily-streak-5xzt.onrender.com
- **Backend Health Check:** https://veloop-daily-streak-5xzt.onrender.com/api/health

### Demo Login

- **Email:** `demo@veloop.test`
- **Password:** `Demo@1234`

*Demo credentials should be used only if the corresponding demo account is available in the configured database.*

---

## 1. Project Overview

VELoop Rewards is a seven-day daily streak and reward system that allows users to claim rewards according to a backend-controlled schedule.

The application manages:

- Daily streak progress
- Seven-day reward cycles
- Reward claim eligibility
- Countdown timers
- Missed-day resets
- Reward configuration
- Wallet balances
- Transaction history

The backend is the single source of truth for streak progress, claim eligibility, and reward allocation. The frontend displays the state received from the API.

## 2. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js, Vite |
| Styling | Bootstrap, CSS Modules, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JSON Web Token (JWT) |
| Validation | Zod |
| Security | Helmet, CORS, Rate Limiting |
| API Testing | Postman |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |

## 3. System Architecture

```text
       React Frontend
     (Vite, Bootstrap)
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

- User registration and authentication
- JWT-based authorization
- Input validation
- Rate limiting
- Streak state management
- Reward configuration
- Claim eligibility verification
- Wallet management
- Transaction ledger management
- Audit logging

The backend calculates important reward and streak information rather than trusting values supplied by the frontend.

## 4. Project Structure

```text
veloop-daily-streak/
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
│   │
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
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   │
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

## 5. Requirements

Install the following before running the project:

- Node.js and npm
- MongoDB Atlas account or local MongoDB installation
- Visual Studio Code
- Git
- Postman (for API testing)

## 6. Installation and Setup

### Backend Setup

Open PowerShell in the project root:

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Open `backend/.env` and configure:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
```

Configure any additional environment variables required by the backend.

Seed the database:

```powershell
npm run seed
```

Start the backend:

```powershell
npm run dev
```

Backend local URL:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

### Frontend Setup

Open a second terminal in the project root:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
```

Configure `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```powershell
npm run dev
```

Frontend local URL:

```text
http://localhost:5173
```

**Note:** For Linux/macOS, use `cp .env.example .env` instead of PowerShell's `Copy-Item` command.

For additional instructions, refer to `SETUP_GUIDE.md`.

## 7. Streak Logic

A streak cycle represents one seven-day reward run.

Each user's streak information is stored in the database through the streak-related models.

The system tracks:

- Claimed days
- Last claim timestamp
- Current cycle
- Cycle status
- Reward eligibility

### Cycle Statuses

- `ACTIVE`
- `COMPLETED`
- `RESET`

### Streak Configuration

The system uses the following configuration values:

- `claimIntervalHours` – Default waiting interval of 24 hours between claims.
- `claimWindowHours` – Default 24-hour grace period after a reward becomes available.

Both settings are stored in `StreakConfig`.

### Missed-Day Handling

If a user does not claim within the configured claim window:

1. The current cycle is marked as `RESET`.
2. Day 1 becomes available again.

After successfully claiming Day 7:

1. The cycle is marked as `COMPLETED`.
2. A new cycle can begin after the configured interval.

The streak calculation logic is maintained in:

```text
backend/src/utils/streakState.js
```

### Frontend Card States

- `CLAIMED`
- `AVAILABLE`
- `LOCKED`

Additional state information includes:

- `isToday`
- `isNext`
- `nextClaimAt`

## 8. Reward Claiming and Anti-Cheat Protection

The reward claim endpoint is:

```http
POST /api/daily-streak/claim
```

The claim process follows these steps:

1. User identity is obtained from the JWT authentication token.
2. The backend uses server time to calculate the current streak state.
3. The client-provided day is treated only as an intent.
4. The requested day must match the server-calculated day.
5. The backend checks claim eligibility and duplicate claims.
6. An atomic guard protects against simultaneous duplicate claims.
7. The wallet balance is updated using MongoDB's `$inc` operation.
8. A `WalletTransaction` record stores transaction details, including balance information and a transaction reference.
9. A `StreakClaim` record is created with a unique user, cycle, and day combination.
10. Reward amount and currency are retrieved from `StreakReward`. Client-provided reward values are ignored.

The claim operation uses a MongoDB transaction to maintain consistency across related database updates.

An `Idempotency-Key` header supports safe retries and helps prevent duplicate reward grants.

## 9. Timer Architecture

The backend provides:

- `serverTime`
- `nextClaimAt`

The frontend calculates the countdown using `performance.now()` anchored to the backend's server time.

This prevents changes to the device clock from manipulating the countdown.

When the countdown reaches zero:

1. The frontend requests the current status.
2. The backend recalculates the streak state.
3. The Claim Reward button appears only when the backend confirms that the reward is claimable.

Status endpoint:

```http
GET /api/daily-streak/status
```

## 10. Reward System and Wallet

The seven-day reward configuration is maintained in the `StreakReward` collection.

Reward configuration includes:

- Reward type
- Currency
- Amount
- Title
- Asset type
- Metadata

### Wallet Credit Handling

- VES rewards are credited to `wallet.balances.VES`.
- Gift-card rewards are credited to `wallet.balances.INR`.

Reward configuration can be modified through database configuration without requiring corresponding frontend presentation changes.

## 11. CPA Demo

`CpaDemo.jsx` provides a placeholder screen displaying:

**"Preparing your reward..."**

It is shown while the claim request is being processed.

The CPA component does not independently grant rewards. No real advertising network or CPA SDK is integrated in this version.

## 12. User Interface and Design

The application provides responsive mobile, tablet, and desktop layouts.

### Mobile and Tablet

- Header with back navigation, Daily Streak title, flame icon, and VES balance
- Calendar banner
- Streak panel with status chip
- Streak Calendar button
- Three statistic tiles
- Progress bar
- Ultimate Reward section
- Seven reward cards arranged in a 4+3 layout
- Why Maintain Your Streak section
- Official footer

### Desktop

- Header bar with a seven-day streak badge
- Daily Check-In Rewards hero section with gift artwork
- Statistics section
- Ultimate Reward panel
- Seven reward cards in one row
- Benefits strip
- Trust information section

### Reward Card States

- **Claimed:** Green styling
- **Today:** Gold styling with a Today tab and Claim button
- **Locked:** Displays the countdown on the next reward card
- **VIP / Day 7:** Gold styling

### Streak Journey

The seven-day Streak Journey includes:

- Completed days in green
- Today's reward in gold with a pulse effect
- Upcoming rewards
- A live counter showing days remaining until the Ultimate Reward
- Day selection to navigate to the corresponding reward card

The Streak Calendar button opens a visual calendar sheet displaying rewards, progress, and recent claims.

### Animations and Interactions

- Staggered entrance animations
- Floating artwork
- Count-up numbers
- Animated progress bar
- Claim button shine effect
- Soft pulse on today's reward card
- Hover lift
- Reward reveal animation
- Reduced-motion support through `prefers-reduced-motion`

### Claim Flow

1. CPA demo displays "Preparing your reward..."
2. Claim request is sent to the backend.
3. Reward reveal is displayed after backend confirmation.
4. The UI refreshes using the latest API response.

### Responsive Breakpoints

| Device | Breakpoint |
|---|---|
| Mobile | Below 768px |
| Tablet | 768px–1099px |
| Desktop | 1100px and above |

Artwork adapted from the supplied design references is stored as transparent PNG assets under `frontend/src/assets`.

## 13. Security

Security measures implemented include:

- JWT authentication for protected streak APIs
- User identity derived from the authentication token
- Backend-controlled time and reward eligibility
- Rate limiting
- Input validation using Zod
- Helmet security middleware
- CORS allow-list
- Safe error responses
- Audit logging
- Atomic claim protection
- MongoDB transaction-based wallet updates
- Idempotency support

For more information, refer to:

```text
docs/SECURITY.md
```

## 14. API Endpoints

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

## 15. Testing

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

The E2E tests require a running server and the appropriate test database configuration.

### Postman Testing

Import the following collection into Postman:

```text
postman/VELoop_Daily_Streak.postman_collection.json
```

The collection can be used to test the authentication, streak, claim, history, and wallet API endpoints.

For detailed testing instructions, refer to:

```text
docs/TESTING.md
```

## 16. Deployment

The application uses the following deployment architecture:

| Component | Platform |
|---|---|
| Database | MongoDB Atlas |
| Backend | Render |
| Frontend | Vercel |

### Deployment URLs

- Frontend: https://veloop-daily-streak-beige.vercel.app
- Backend: https://veloop-daily-streak-5xzt.onrender.com
- Health Check: https://veloop-daily-streak-5xzt.onrender.com/api/health

The frontend and backend are configured to communicate through the deployed API.

For setup and deployment instructions, refer to `SETUP_GUIDE.md`.

## 17. Known Limitations

- The CPA step is currently a visual placeholder. A real CPA or advertising network integration has not been added.
- Gift-card rewards are credited as INR wallet balance; actual voucher payout is not implemented.
- Missed-day testing uses a development-only rewind route that shifts stored timestamps without changing the server clock.
- Render's free tier may sleep when idle, so the first request after inactivity can take longer to respond.

## 18. Project Summary

VELoop Rewards – Daily Streak System demonstrates a secure, backend-driven reward application using the MERN stack.

The project focuses on:

- Backend-controlled streak management
- Secure reward claiming
- JWT authentication
- Atomic database transactions
- Wallet and transaction management
- Server-synchronized countdowns
- Responsive React UI
- API documentation and testing
- Anti-cheat and idempotency protection

**The core principle: The frontend displays the experience, while the backend remains the source of truth for every reward and streak operation.**

---

**Project:** VELoop Rewards – Daily Streak System

**Technology:** MongoDB, Express.js, React.js, Node.js, Bootstrap and CSS Modules

**GitHub:** https://github.com/aparnabethineedi04/veloop-daily-streak

**Internship ID:** VLRINT20263239