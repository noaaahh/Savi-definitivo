import express from 'express';
import * as EmpresaController from '../controllers/empresaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Rutas públicas
router.post('/register', EmpresaController.registerEmpresa);
router.post('/login', EmpresaController.loginEmpresa);
router.get('/', EmpresaController.getAllEmpresas);
router.get('/ultimos', EmpresaController.getUltimosLocales);
router.get('/:id', EmpresaController.getEmpresaById);

// Rutas protegidas (requieren autenticación)
router.put('/:id/perfil', EmpresaController.updatePerfil);
router.put('/:id/accesibilidad', authMiddleware, EmpresaController.updateAccesibilidad);
router.post('/:id/imagenes', (req, res, next) => {
  console.log('Ruta de imágenes accedida:', req.params.id);
  next();
}, upload.array('imagenes', 10), (err, req, res, next) => {
  if (err) {
    console.error('Error en multer:', err);
    return res.status(400).json({ error: err.message });
  }
  next();
}, EmpresaController.uploadImagenes);

// Ruta para actualizar todas las imágenes (eliminar las que no queremos)
router.put('/:id/imagenes', EmpresaController.updateAllImages);

// Ruta para eliminar imagen específica
router.delete('/:id/imagenes', EmpresaController.deleteImagen);

export default router;
