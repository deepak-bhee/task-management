import User from '../models/User.js';
import { verifyAuthToken } from '../services/auth.service.js';
import { httpError } from '../utils/httpError.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw httpError(401, 'Authentication token is required');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.id);

    if (!user) {
      throw httpError(401, 'User no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(httpError(401, 'Invalid or expired authentication token'));
    }

    return next(error);
  }
}
