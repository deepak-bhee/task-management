import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

const app = express();

app.use(helmet());

// CORS: permissive in development, strict in production
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: true, credentials: true }));
  app.options('*', cors());
} else {
  // CORS setup: allow list from CLIENT_URL (comma-separated)
  const rawClient = process.env.CLIENT_URL || '';
  const allowedOrigins = new Set(
    rawClient
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  );

  const corsOptions = {
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  };

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
}

app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
