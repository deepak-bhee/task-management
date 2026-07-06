# Deployment Guide

This guide covers how to **run locally** and **deploy to production** for the TaskFlow application (React frontend + Express/MongoDB backend).

---

## Environment Variables

| Variable | Where | Description |
|---|---|---|
| `MONGODB_URI` | Backend | MongoDB connection string (local or Atlas) |
| `JWT_SECRET` | Backend | Secret key for signing JWT tokens — use a long random string |
| `JWT_EXPIRES_IN` | Backend | Token expiry duration (e.g. `7d`, `24h`) |
| `CLIENT_URL` | Backend | Frontend origin URL for CORS (e.g. `http://localhost:5173`) |
| `PORT` | Backend | Server port (defaults to `5000`) |
| `VITE_API_BASE_URL` | Frontend | Backend API URL (e.g. `http://localhost:5001/api`) |

---

## Run Locally

### Prerequisites

- **Node.js** ≥ 20
- **MongoDB** — either a local instance or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

#### Install MongoDB locally (macOS)

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

### Step 1 — Install dependencies

From the project root:

```bash
npm install
```

This installs both frontend and backend packages (npm workspaces).

### Step 2 — Configure environment

Create `backend/.env`:

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/task-management
JWT_SECRET=your-strong-secret-here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

### Step 3 — Start both servers

**Terminal 1 — Backend:**

```bash
npm run dev:backend
```

Starts Express + Socket.IO on `http://localhost:5001` with nodemon (auto-restart on file changes).

**Terminal 2 — Frontend:**

```bash
npm run dev:frontend
```

Starts Vite dev server on `http://localhost:5173` with hot module replacement.

### Step 4 — Open the app

Go to **http://localhost:5173** in your browser. Register a new account and start using TaskFlow.

### Quick Reference — All npm scripts

| Command | Description |
|---|---|
| `npm run dev:frontend` | Start Vite dev server (port 5173) |
| `npm run dev:backend` | Start Express with nodemon (port 5001) |
| `npm run build` | Build frontend for production (`frontend/dist/`) |
| `npm start` | Start backend in production mode |

---

## Deploy to Production

### Option A — Vercel (frontend) + Render (backend)

This is the recommended approach for quick deployment.

#### Backend → Render

1. Create a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and get your connection string.
2. Go to [Render](https://render.com) → **New Web Service** → connect your GitHub repo.
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** `Node`
4. Add environment variables in Render's service settings:
   - `MONGODB_URI` → your Atlas connection string
   - `JWT_SECRET` → a strong random secret
   - `JWT_EXPIRES_IN` → `7d`
   - `CLIENT_URL` → your Vercel frontend URL (e.g. `https://taskflow.vercel.app`)
   - `NODE_ENV` → `production`
5. Deploy. Note your backend URL (e.g. `https://taskflow-backend.onrender.com`).

> **Tip:** You can also use the included `render.yaml` in the repo root — Render will auto-detect it via Blueprint deploys.

#### Frontend → Vercel

1. Go to [Vercel](https://vercel.com) → **Import Project** → connect your GitHub repo.
2. Configure:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add environment variable:
   - `VITE_API_BASE_URL` → `https://your-render-backend-url.onrender.com/api`
4. Deploy.

#### Post-deploy

Go back to Render and update `CLIENT_URL` to your Vercel frontend URL so CORS allows requests.

---

### Option B — Docker

Both frontend and backend include Dockerfiles.

#### Build & run the backend

```bash
cd backend
docker build -t taskflow-backend .
docker run -p 5001:5000 \
  -e MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/task-management" \
  -e JWT_SECRET="your-strong-secret" \
  -e JWT_EXPIRES_IN="7d" \
  -e CLIENT_URL="http://localhost:3000" \
  -e NODE_ENV="production" \
  taskflow-backend
```

#### Build & run the frontend

```bash
cd frontend
docker build \
  --build-arg VITE_API_BASE_URL="http://localhost:5001/api" \
  -t taskflow-frontend .
docker run -p 3000:80 taskflow-frontend
```

> The frontend Dockerfile uses a multi-stage build: Vite builds the static files, then Nginx serves them.

You can deploy these images to any container host — AWS ECS, DigitalOcean App Platform, Google Cloud Run, Kubernetes, etc.

---

### Option C — CI/CD with GitHub Actions

Three workflow files are included under `.github/workflows/`:

| File | Purpose |
|---|---|
| `ci.yml` | Installs dependencies and builds both packages on every push |
| `deploy-vercel.yml` | Triggers Vercel deploy via API |
| `deploy-render.yml` | Triggers Render deploy via API |

#### Required GitHub Secrets

For Vercel deployment:
- `VERCEL_TOKEN` — your Vercel API token
- `VERCEL_PROJECT_ID` — your Vercel project ID

For Render deployment:
- `RENDER_API_KEY` — your Render API key
- `RENDER_SERVICE_ID` — your Render service ID

---

## Security Best Practices

- **Never commit secrets** — use `.env` files locally (already in `.gitignore`) and platform secrets for hosting.
- **Use HTTPS** for all production API endpoints.
- **Set a strong `JWT_SECRET`** — use `openssl rand -base64 32` to generate one.
- **Rotate credentials** regularly (JWT secret, DB password).
- **Set `NODE_ENV=production`** on your backend hosting to enable strict CORS and security headers.
