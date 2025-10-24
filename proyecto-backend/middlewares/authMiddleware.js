import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';
import prisma from '../config/db.js';

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    
    // Buscar en usuarios regulares
    let user = await prisma.usuario.findUnique({ where: { usuario_id: decoded.id } });
    
    // Si no se encuentra en usuarios, buscar en empresas
    if (!user) {
      user = await prisma.empresa.findUnique({ 
        where: { empresa_id: decoded.id },
        include: {
          detallesAccesibilidad: true
        }
      });
    }
    
    if (!user) throw new Error('Usuario no encontrado');
    
    const { password, ...userData } = user;
    req.user = userData;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
