import * as UserService from '../services/userService.js';

// Controlador para registrar usuarios normales
export const register = async (req, res) => {
  try {
    const user = await UserService.register(req.body);
    res.status(201).json({ message: 'Usuario registrado', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controlador para registrar empresas (ruta separada)
export const registerCompany = async (req, res) => {
  try {
    const user = await UserService.registerCompany(req.body);
    res.status(201).json({ message: 'Empresa registrada', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Devuelve el perfil del usuario autenticado. `authMiddleware` inyecta `req.user`.
export const getProfile = async (req, res) => {
  res.json({ user: req.user });
};
