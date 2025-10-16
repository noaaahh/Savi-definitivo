import express from 'express';
import * as CalificacionController from '../controllers/calificacionController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas protegidas (requieren autenticación de usuario personal)
router.post('/:empresaId', authMiddleware, CalificacionController.createOrUpdateCalificacion);
router.get('/:empresaId/usuario', authMiddleware, CalificacionController.getCalificacionUsuario);

// Rutas públicas
router.get('/:empresaId/promedio', CalificacionController.getPromedioCalificacion);
router.get('/:empresaId/todas', CalificacionController.getCalificacionesEmpresa);

export default router;
