import { httpError } from './httpError.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function validateEmail(email) {
  if (!emailPattern.test(normalizeEmail(email))) {
    throw httpError(400, 'A valid email is required');
  }
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 8) {
    throw httpError(400, 'Password must be at least 8 characters long');
  }
}

export function validateRegisterInput(body) {
  const name = String(body?.name || '').trim();
  const email = normalizeEmail(body?.email);
  const password = body?.password;
  const avatar = typeof body?.avatar === 'string' ? body.avatar.trim() : '';

  if (name.length < 2) {
    throw httpError(400, 'Name must be at least 2 characters long');
  }

  validateEmail(email);
  validatePassword(password);

  return {
    name,
    email,
    password,
    avatar
  };
}

export function validateLoginInput(body) {
  const email = normalizeEmail(body?.email);
  const password = body?.password;

  validateEmail(email);

  if (typeof password !== 'string' || password.length === 0) {
    throw httpError(400, 'Password is required');
  }

  return {
    email,
    password
  };
}
