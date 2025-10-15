import express from 'express';
import * as EmpresaController from '../controllers/empresaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.post('/register', EmpresaController.registerEmpresa);
router.post('/login', EmpresaController.loginEmpresa);
router.get('/', EmpresaController.getAllEmpresas);
router.get('/:id', EmpresaController.getEmpresaById);

// Rutas protegidas (requieren autenticación)
router.put('/:id/accesibilidad', authMiddleware, EmpresaController.updateAccesibilidad);

export default router;
