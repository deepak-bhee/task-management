import { Router } from 'express';
import { getProfile, login, logout, register } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', requireAuth, logout);
router.get('/profile', requireAuth, getProfile);

export default router;
