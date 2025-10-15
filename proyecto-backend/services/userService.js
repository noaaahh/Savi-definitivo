import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';

/**
 * register
 * Registra un usuario normal. Valida si el email ya existe, hashea
 * la contraseña y crea el registro en la tabla `User`.
 * @param {{name:string,email:string,password:string}} param0
 */
export const register = async ({ name, email, password }) => {
  const userExists = await prisma.usuario.findUnique({ where: { email } });
  if (userExists) throw new Error('El usuario ya existe');
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.usuario.create({
    data: { nombre: name, email, password: hashedPassword }
  });
  return user;
};

/**
 * findByEmail
 * Devuelve un usuario por email o null si no existe.
 */
export const findByEmail = async (email) => {
  return await prisma.usuario.findUnique({ where: { email } });
};

/**
 * registerCompany
 * Función separada para manejar registros de empresas. Actualmente
 * reutiliza la tabla `User` para el almacenamiento, pero está separada
 * para que la lógica (y el endpoint) sea distinta y podamos adaptar la
 * estructura (p.ej. crear modelo Company) en el futuro sin romper code.
 */
export const registerCompany = async ({ name, email, password, ...rest }) => {
  const userExists = await prisma.usuario.findUnique({ where: { email } });
  if (userExists) throw new Error('El usuario ya existe');
  const hashedPassword = await bcrypt.hash(password, 10);
  // Por ahora guardamos la "empresa" en la tabla Usuario (schema actual).
  const user = await prisma.usuario.create({
    data: { nombre: name, email, password: hashedPassword }
  });
  return user;
};
