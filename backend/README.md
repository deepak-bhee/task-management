# Backend — TaskFlow API

Environment (create `.env` from root `.env.example`)

- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for signing JWT tokens
- `JWT_EXPIRES_IN` — Token expiry (e.g. `7d`)
- `PORT` — Server port
- `CLIENT_URL` — Frontend origin for CORS

Scripts

- `npm run dev` — Start dev server with nodemon
- `npm start` — Start production server

API Endpoints

- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout (protected)
- `GET /api/auth/profile` — Get profile (protected)

- `GET /api/tasks` — List tasks (protected)
- `GET /api/tasks/:id` — Get task (protected)
- `POST /api/tasks` — Create task (protected)
- `PUT /api/tasks/:id` — Update task (protected)
- `DELETE /api/tasks/:id` — Delete task (protected)

Testing

Add tests using your preferred test runner (Jest, Vitest). The project currently includes thorough validation and error handling.
