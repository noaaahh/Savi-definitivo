import * as CalificacionService from '../services/calificacionService.js';

// Crear o actualizar una calificación
export const createOrUpdateCalificacion = async (req, res) => {
  try {
    const { empresaId } = req.params;
    const { puntuacion } = req.body;
    const usuarioId = req.user.usuario_id; // Viene del middleware de autenticación

    console.log('Creando/actualizando calificación:', { usuarioId, empresaId, puntuacion });

    if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({ 
        error: 'La puntuación debe estar entre 1 y 5' 
      });
    }

    const calificacion = await CalificacionService.createOrUpdateCalificacion(
      usuarioId, 
      parseInt(empresaId), 
      parseFloat(puntuacion)
    );

    // Obtener el nuevo promedio
    const promedio = await CalificacionService.getPromedioCalificacion(parseInt(empresaId));

    res.json({
      success: true,
      message: 'Calificación guardada exitosamente',
      calificacion: calificacion,
      promedio: promedio
    });

  } catch (error) {
    console.error('Error en createOrUpdateCalificacion:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor: ' + error.message 
    });
  }
};

// Obtener el promedio de calificaciones de una empresa
export const getPromedioCalificacion = async (req, res) => {
  try {
    const { empresaId } = req.params;

    const promedio = await CalificacionService.getPromedioCalificacion(parseInt(empresaId));

    res.json({
      success: true,
      promedio: promedio
    });

  } catch (error) {
    console.error('Error en getPromedioCalificacion:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor: ' + error.message 
    });
  }
};

// Obtener la calificación de un usuario específico para una empresa
export const getCalificacionUsuario = async (req, res) => {
  try {
    const { empresaId } = req.params;
    const usuarioId = req.user.usuario_id; // Viene del middleware de autenticación

    const calificacion = await CalificacionService.getCalificacionUsuario(
      usuarioId, 
      parseInt(empresaId)
    );

    res.json({
      success: true,
      calificacion: calificacion
    });

  } catch (error) {
    console.error('Error en getCalificacionUsuario:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor: ' + error.message 
    });
  }
};

// Obtener todas las calificaciones de una empresa
export const getCalificacionesEmpresa = async (req, res) => {
  try {
    const { empresaId } = req.params;

    const calificaciones = await CalificacionService.getCalificacionesEmpresa(parseInt(empresaId));

    res.json({
      success: true,
      calificaciones: calificaciones
    });

  } catch (error) {
    console.error('Error en getCalificacionesEmpresa:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor: ' + error.message 
    });
  }
};
