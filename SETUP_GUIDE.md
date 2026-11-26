# Step-by-step guide (from zero)

You need a laptop/PC (Windows, Mac or Linux). Everything below is free.

## Part 1 - Install the tools (once)
1. **Node.js (LTS):** https://nodejs.org -> download "LTS" -> install (keep defaults). Check: open a terminal and run `node -v` (should show v18 or higher).
2. **VS Code:** https://code.visualstudio.com -> install.
3. **Git:** https://git-scm.com -> install. Check: `git --version`.
4. Create free accounts: **GitHub**, **MongoDB Atlas** (mongodb.com/atlas), **Render** (render.com), **Vercel** (vercel.com). Sign up to Render and Vercel with GitHub.

## Part 2 - Database (MongoDB Atlas)
1. Atlas -> Create a free **M0** cluster (any region).
2. **Database Access** -> Add user (e.g. `veloop` + a password; save it). Give "Read and write to any database".
3. **Network Access** -> Add IP address -> **Allow access from anywhere (0.0.0.0/0)**.
4. Cluster -> **Connect** -> Drivers -> copy the connection string. It looks like
   `mongodb+srv://veloop:<password>@cluster0.xxxxx.mongodb.net/`
   Replace `<password>` with your password and add the database name before the `?`:
   `mongodb+srv://veloop:PASSWORD@cluster0.xxxxx.mongodb.net/veloop_streak?retryWrites=true&w=majority`

## Part 3 - Run the backend
1. Unzip the project, open the folder in VS Code (File -> Open Folder), open Terminal (Ctrl+`).
2. ```bash
   cd backend
   npm install
   ```
3. Make your settings file: copy `.env.example` to a new file named `.env` and fill:
   - `MONGO_URI=` your string from Part 2
   - `JWT_SECRET=` any long random text (or run `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` and paste the output)
   - `ALLOW_DEV_ROUTES=true` (only for local testing)
4. Load the rewards and demo user: `npm run seed` (should print "Seed complete").
5. Start: `npm run dev`. Open http://localhost:5000/api/health in the browser -> you should see `"status":"ok"`.
Keep this terminal open.

## Part 4 - Run the frontend
1. Open a **second** terminal:
   ```bash
   cd frontend
   npm install
   ```
2. Copy `.env.example` to `.env` (keep `VITE_API_URL=http://localhost:5000/api`).
3. `npm run dev` -> open http://localhost:5173
4. Log in with `demo@veloop.test` / `Demo@1234`. Click **Claim Reward** on Day 1.

## Part 5 - Test it
- Unit tests: in `backend`, run `npm test`.
- API anti-cheat tests (backend must be running): second terminal in `backend` -> `npm run test:e2e`. All lines should say PASS.
- Missed-day demo: claim Day 1 in the browser, then in Postman (import `postman/VELoop_Daily_Streak.postman_collection.json`, run "2. Login", then "DEV. Rewind 60h"), reload the page -> reset banner and Day 1 available.
- See `docs/TESTING.md` for the whole checklist.
- Check the data: Atlas -> Browse Collections -> `streakclaims`, `wallettransactions`, `auditlogs`.

## Part 6 - Put it on GitHub
1. GitHub -> New repository -> name `veloop-daily-streak` -> **Public** -> create (empty).
2. In the project root terminal:
   ```bash
   git init
   git add .
   git commit -m "VELoop Daily Streak - MERN"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/veloop-daily-streak.git
   git push -u origin main
   ```
   `.env` files are git-ignored, so your secrets are not uploaded. Never upload them.

## Part 7 - Deploy
**Backend on Render**
1. Render -> New -> **Web Service** -> pick your repo.
2. Root Directory: `backend`. Build Command: `npm install`. Start Command: `npm start`. Instance type: Free.
3. Environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_ORIGIN=` (fill after the frontend is live), `USE_TRANSACTIONS=true`. Do NOT set `ALLOW_DEV_ROUTES`.
4. Deploy. Open `https://YOUR-SERVICE.onrender.com/api/health`.
The database is already seeded (Part 3 used the same Atlas database).

**Frontend on Vercel**
1. Vercel -> Add New Project -> pick the repo -> Root Directory `frontend` -> Framework: Vite.
2. Environment variable: `VITE_API_URL=https://YOUR-SERVICE.onrender.com/api`
3. Deploy -> copy your Vercel link.
4. Back in Render, set `CLIENT_ORIGIN=https://YOUR-APP.vercel.app` (no trailing slash) and redeploy.
5. Open the Vercel link and test login + claim. (The free Render service sleeps; the first request may take about a minute - open it once before submitting.)

## Part 8 - Before you submit (deadline 5:30 PM IST)
- [ ] Put your live links at the top of `README.md` and push again
- [ ] GitHub repo is public and has README, `.env.example`, `docs/`, `postman/`
- [ ] Live frontend works with the live backend (login, claim, refresh)
- [ ] Record a short demo video (login -> loader -> claim -> CPA demo -> countdown -> refresh -> mobile view)
- [ ] Submit: GitHub link + live deployment link (+ video, demo login)
- [ ] Optional polish: replace the cropped images in `frontend/src/assets` with cleaner transparent versions (same file names)

## Common problems
| Problem | Fix |
|---|---|
| `Missing required environment variable` | `.env` not created in `backend/` or typo in names |
| `MongoServerSelectionError` | Atlas Network Access not 0.0.0.0/0, wrong password, or string missing database name |
| "Transaction numbers are only allowed on a replica set" | Using a local plain MongoDB: set `USE_TRANSACTIONS=false` (Atlas does not need this) |
| Login works but page shows network error | `VITE_API_URL` wrong, backend not running, or `CLIENT_ORIGIN` does not match the frontend address |
| Blank page after Vercel deploy | Root Directory must be `frontend`; env var set before build |
Send me the exact error text and I will fix it.
