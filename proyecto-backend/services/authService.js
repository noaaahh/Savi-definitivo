import * as UserService from './userService.js';
import * as EmpresaService from './empresaService.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import jwtConfig from '../config/jwt.js';

/**
 * login
 * Autentica a un usuario o empresa usando email/password. Si las credenciales
 * son válidas, genera un JWT con la información base del usuario/empresa y lo devuelve
 * junto con el objeto `user`.
 * @param {{email:string,password:string}} param0
 */
export const login = async ({ email, password }) => {
  // Primero buscar en usuarios regulares
  let user = await UserService.findByEmail(email);
  let userType = 'usuario';
  
  // Si no se encuentra en usuarios, buscar en empresas
  if (!user) {
    user = await EmpresaService.findByEmail(email);
    userType = 'empresa';
  }
  
  if (!user) throw new Error('Credenciales inválidas');
  
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Credenciales inválidas');
  
  // Preparar datos del usuario para el token y respuesta
  const userData = {
    id: user.usuario_id || user.empresa_id,
    email: user.email,
    nombre: user.nombre,
    tipo: userType
  };
  
  // Agregar campos específicos según el tipo
  if (userType === 'empresa') {
    userData.empresa_id = user.empresa_id;
    userData.descripcion = user.descripcion;
    userData.direccion = user.direccion;
    userData.contacto = user.contacto;
    userData.horario = user.horario;
    userData.publicado = user.publicado;
    userData.accesibilidad = user.accesibilidad;
    userData.imagenes = user.imagenes;
  }
  
  // Firmar token con secret y expiración configurados en config/jwt.js
  const token = jwt.sign({ id: userData.id, email: userData.email, tipo: userType }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
  
  return { token, user: userData };
};
