import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

const app = express();

app.use(helmet());

// CORS configuration
const rawClient = process.env.CLIENT_URL || '';
const configuredOrigins = rawClient
  .split(',')
  .map((s) => s.trim().replace(/\/+$/, ''))
  .filter(Boolean);

export const isOriginAllowed = (origin) => {
  if (!origin) return true; // Allow curl/health/mobile requests
  const normalizedOrigin = origin.replace(/\/+$/, '');
  
  if (configuredOrigins.includes(normalizedOrigin)) return true;
  // Allow localhost
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin)) return true;
  try {
    const parsed = new URL(normalizedOrigin);
    // Allow Vercel preview/production deployments
    if (parsed.hostname.endsWith('.vercel.app')) return true;
  } catch {
    // Ignore invalid url parse
  }
  
  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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
