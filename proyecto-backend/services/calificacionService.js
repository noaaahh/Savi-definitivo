import prisma from '../config/db.js';

// Crear o actualizar una calificación
export const createOrUpdateCalificacion = async (usuarioId, empresaId, puntuacion) => {
  try {
    // Verificar que la puntuación esté entre 1 y 5
    if (puntuacion < 1 || puntuacion > 5) {
      throw new Error('La puntuación debe estar entre 1 y 5');
    }

    // Usar upsert para crear o actualizar la calificación
    const calificacion = await prisma.calificacion.upsert({
      where: {
        usuario_id_empresa_id: {
          usuario_id: usuarioId,
          empresa_id: empresaId
        }
      },
      update: {
        puntuacion: puntuacion,
        fecha_creacion: new Date()
      },
      create: {
        usuario_id: usuarioId,
        empresa_id: empresaId,
        puntuacion: puntuacion
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            email: true
          }
        },
        empresa: {
          select: {
            nombre: true
          }
        }
      }
    });

    return calificacion;
  } catch (error) {
    console.error('Error en createOrUpdateCalificacion:', error);
    throw error;
  }
};

// Obtener el promedio de calificaciones de una empresa
export const getPromedioCalificacion = async (empresaId) => {
  try {
    const result = await prisma.calificacion.aggregate({
      where: {
        empresa_id: empresaId
      },
      _avg: {
        puntuacion: true
      },
      _count: {
        puntuacion: true
      }
    });

    return {
      promedio: result._avg.puntuacion || 0,
      totalCalificaciones: result._count.puntuacion || 0
    };
  } catch (error) {
    console.error('Error en getPromedioCalificacion:', error);
    throw error;
  }
};

// Obtener la calificación de un usuario específico para una empresa
export const getCalificacionUsuario = async (usuarioId, empresaId) => {
  try {
    const calificacion = await prisma.calificacion.findUnique({
      where: {
        usuario_id_empresa_id: {
          usuario_id: usuarioId,
          empresa_id: empresaId
        }
      }
    });

    return calificacion;
  } catch (error) {
    console.error('Error en getCalificacionUsuario:', error);
    throw error;
  }
};

// Obtener todas las calificaciones de una empresa con detalles de usuarios
export const getCalificacionesEmpresa = async (empresaId) => {
  try {
    const calificaciones = await prisma.calificacion.findMany({
      where: {
        empresa_id: empresaId
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            email: true
          }
        }
      },
      orderBy: {
        fecha_creacion: 'desc'
      }
    });

    return calificaciones;
  } catch (error) {
    console.error('Error en getCalificacionesEmpresa:', error);
    throw error;
  }
};
