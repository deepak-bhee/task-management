# TaskFlow — Task Management SaaS

Full-stack task management application using React (Vite) and Node.js (Express) with MongoDB.

Quick start

1. Copy backend env example: `cp .env.example .env` and fill values.
2. Start backend:

```bash
cd backend
npm install
npm run dev
```

3. Create frontend env: `frontend/.env` with `VITE_API_BASE_URL` (e.g. `http://localhost:5000/api`).
4. Start frontend:

```bash
cd frontend
npm install
npm run dev
```

Deployment

- Frontend: Vercel (set `VITE_API_BASE_URL` to your backend URL)
- Backend: Render / Heroku (set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` in environment)

See [backend/README.md](backend/README.md) for API documentation and environment details.# Task Management SaaS

A production-oriented full stack task management application using React, Vite, Tailwind CSS, Node.js, Express, MongoDB Atlas, JWT, and bcrypt.

## Project Structure

```text
task-management/
  frontend/
    src/
      assets/
      components/
      context/
      hooks/
      layouts/
      pages/
      services/
      utils/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
    server.js
```

## Getting Started

Install dependencies from the project root:

```bash
npm install
```

Run the frontend:

```bash
npm run dev:frontend
```

Run the backend:

```bash
npm run dev:backend
```

## Environment

Copy the examples before running locally:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```
c
## Deployment Targets

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
