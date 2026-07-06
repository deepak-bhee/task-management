import jwt from 'jsonwebtoken';

export function createTokenPayload(user) {
  return {
    id: user._id.toString(),
    email: user.email
  };
}

export function signAuthToken(user) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }

  return jwt.sign(createTokenPayload(user), secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

export function verifyAuthToken(token) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }

  return jwt.verify(token, secret);
}

export function formatAuthResponse(user) {
  return {
    user: user.toSafeObject(),
    token: signAuthToken(user)
  };
}
