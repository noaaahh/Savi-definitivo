import express from 'express';
import { login } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);

export default router;

// Ruta: POST /api/auth/login -> recibe {email,password} y devuelve {token,user}
