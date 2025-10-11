import express from 'express';
import { register, getProfile, registerCompany } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/register-company', registerCompany);
router.get('/profile', authMiddleware, getProfile);

export default router;
