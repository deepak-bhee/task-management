import User from '../models/User.js';
import { formatAuthResponse } from '../services/auth.service.js';
import { httpError } from '../utils/httpError.js';
import {
  normalizeEmail,
  validateLoginInput,
  validateRegisterInput
} from '../utils/authValidation.js';

export async function register(req, res, next) {
  try {
    const payload = validateRegisterInput(req.body);
    const email = normalizeEmail(payload.email);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw httpError(409, 'An account with this email already exists');
    }

    const user = await User.create({
      name: payload.name,
      email,
      password: payload.password,
      avatar: payload.avatar || ''
    });

    res.status(201).json(formatAuthResponse(user));
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const payload = validateLoginInput(req.body);
    const email = normalizeEmail(payload.email);
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw httpError(401, 'Invalid email or password');
    }

    const passwordMatches = await user.comparePassword(payload.password);

    if (!passwordMatches) {
      throw httpError(401, 'Invalid email or password');
    }

    res.status(200).json(formatAuthResponse(user));
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res) {
  res.status(200).json({ message: 'Logged out successfully' });
}

export async function getProfile(req, res) {
  res.status(200).json({ user: req.user.toSafeObject() });
}
