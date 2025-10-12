import * as EmpresaService from '../services/empresaService.js';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';

/**
 * registerEmpresa
 * Endpoint para registrar una nueva empresa con sus servicios de accesibilidad.
 */
export const registerEmpresa = async (req, res) => {
  try {
    const { nombre, email, password, serviciosAccesibilidad, detallesAccesibilidad } = req.body;

    // Validaciones básicas
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        error: 'Nombre, email y contraseña son obligatorios' 
      });
    }

    if (!serviciosAccesibilidad) {
      return res.status(400).json({ 
        error: 'Los servicios de accesibilidad son obligatorios' 
      });
    }

    // Registrar la empresa
    const { empresa, accesibilidad } = await EmpresaService.registerEmpresa({
      nombre,
      email,
      password,
      serviciosAccesibilidad,
      detallesAccesibilidad: detallesAccesibilidad || {}
    });

    // Generar token JWT para la empresa
    const token = jwt.sign(
      { 
        id: empresa.empresa_id, 
        email: empresa.email, 
        tipo: 'empresa' 
      }, 
      jwtConfig.secret, 
      { expiresIn: jwtConfig.expiresIn }
    );

    // Devolver respuesta exitosa (sin incluir la contraseña)
    const empresaResponse = {
      empresa_id: empresa.empresa_id,
      nombre: empresa.nombre,
      email: empresa.email,
      publicado: empresa.publicado,
      accesibilidad: accesibilidad
    };

    res.status(201).json({
      message: 'Empresa registrada exitosamente',
      token,
      empresa: empresaResponse
    });

  } catch (error) {
    console.error('Error registrando empresa:', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * loginEmpresa
 * Endpoint para autenticar una empresa.
 */
export const loginEmpresa = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son obligatorios' 
      });
    }

    const empresa = await EmpresaService.findByEmail(email);
    if (!empresa) {
      return res.status(401).json({ error: 'Empresa no encontrada' });
    }

    // Verificar contraseña
    const bcrypt = require('bcryptjs');
    const validPassword = await bcrypt.compare(password, empresa.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: empresa.empresa_id, 
        email: empresa.email, 
        tipo: 'empresa' 
      }, 
      jwtConfig.secret, 
      { expiresIn: jwtConfig.expiresIn }
    );

    // Devolver respuesta (sin incluir la contraseña)
    const empresaResponse = {
      empresa_id: empresa.empresa_id,
      nombre: empresa.nombre,
      email: empresa.email,
      publicado: empresa.publicado,
      accesibilidad: empresa.detallesAccesibilidad
    };

    res.json({
      message: 'Login exitoso',
      token,
      empresa: empresaResponse
    });

  } catch (error) {
    console.error('Error en login de empresa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * getAllEmpresas
 * Endpoint para obtener todas las empresas con sus datos de accesibilidad.
 */
export const getAllEmpresas = async (req, res) => {
  try {
    const empresas = await EmpresaService.getAllEmpresas();
    
    // Filtrar información sensible
    const empresasResponse = empresas.map(empresa => ({
      empresa_id: empresa.empresa_id,
      nombre: empresa.nombre,
      email: empresa.email,
      publicado: empresa.publicado,
      accesibilidad: empresa.detallesAccesibilidad
    }));

    res.json({
      empresas: empresasResponse,
      total: empresasResponse.length
    });

  } catch (error) {
    console.error('Error obteniendo empresas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * getEmpresaById
 * Endpoint para obtener una empresa específica por ID.
 */
export const getEmpresaById = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await EmpresaService.getEmpresaById(id);

    if (!empresa) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    // Filtrar información sensible
    const empresaResponse = {
      empresa_id: empresa.empresa_id,
      nombre: empresa.nombre,
      email: empresa.email,
      publicado: empresa.publicado,
      accesibilidad: empresa.detallesAccesibilidad
    };

    res.json({ empresa: empresaResponse });

  } catch (error) {
    console.error('Error obteniendo empresa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * updateAccesibilidad
 * Endpoint para actualizar los datos de accesibilidad de una empresa.
 */
export const updateAccesibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviciosAccesibilidad, detallesAccesibilidad } = req.body;

    if (!serviciosAccesibilidad) {
      return res.status(400).json({ 
        error: 'Los servicios de accesibilidad son obligatorios' 
      });
    }

    const accesibilidad = await EmpresaService.updateEmpresaAccesibilidad(
      parseInt(id), 
      serviciosAccesibilidad, 
      detallesAccesibilidad || {}
    );

    res.json({
      message: 'Accesibilidad actualizada exitosamente',
      accesibilidad
    });

  } catch (error) {
    console.error('Error actualizando accesibilidad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
