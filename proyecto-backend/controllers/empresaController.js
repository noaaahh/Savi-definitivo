import * as EmpresaService from '../services/empresaService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
    
    // Filtrar información sensible y mapear campos de accesibilidad
    const empresasResponse = empresas.map(empresa => {
      const accesibilidad = empresa.detallesAccesibilidad[0] || {};
      return {
        empresa_id: empresa.empresa_id,
        nombre: empresa.nombre,
        email: empresa.email,
        descripcion: empresa.descripcion,
        direccion: empresa.direccion,
        contacto: empresa.contacto,
        horario: empresa.horario,
        publicado: empresa.publicado,
        imagenes: empresa.imagenes,
        accesibilidad: {
          // Mapear campos de la BD a los nombres que espera el frontend
          ramp: accesibilidad.rampa,
          banoAdaptado: accesibilidad.bano_accesible,
          braille: accesibilidad.senalizacion_braille,
          interprete: false, // No está en el esquema actual
          pisosAntideslizantes: accesibilidad.pisos_antideslizantes,
          mesasSillasAdaptadas: accesibilidad.mesas_sillas_adaptadas,
          elevator: accesibilidad.ascensor,
          pasillos: accesibilidad.pasillos_min_90cm,
          puertaAncha: accesibilidad.puerta_80cm,
          contrasteColores: accesibilidad.contraste_colores,
          guiasPodotactiles: accesibilidad.guias_podotactiles,
          alarmasEmergencia: accesibilidad.alarmas_emergencia,
          sistemaAudifonos: accesibilidad.sistema_audifonos
        }
      };
    });

    res.json({
      success: true,
      empresas: empresasResponse,
      total: empresasResponse.length
    });

  } catch (error) {
    console.error('Error obteniendo empresas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * getUltimosLocales
 * Endpoint para obtener los últimos 3 locales registrados.
 */
export const getUltimosLocales = async (req, res) => {
  try {
    const empresas = await EmpresaService.getUltimosLocales();
    
    // Filtrar información sensible y mapear campos de accesibilidad
    const empresasResponse = empresas.map(empresa => {
      const accesibilidad = empresa.detallesAccesibilidad[0] || {};
      return {
        empresa_id: empresa.empresa_id,
        nombre: empresa.nombre,
        email: empresa.email,
        descripcion: empresa.descripcion,
        direccion: empresa.direccion,
        contacto: empresa.contacto,
        horario: empresa.horario,
        publicado: empresa.publicado,
        imagenes: empresa.imagenes,
        accesibilidad: {
          // Mapear campos de la BD a los nombres que espera el frontend
          ramp: accesibilidad.rampa,
          banoAdaptado: accesibilidad.bano_accesible,
          braille: accesibilidad.senalizacion_braille,
          interprete: false, // No está en el esquema actual
          pisosAntideslizantes: accesibilidad.pisos_antideslizantes,
          mesasSillasAdaptadas: accesibilidad.mesas_sillas_adaptadas,
          elevator: accesibilidad.ascensor,
          pasillos: accesibilidad.pasillos_min_90cm,
          puertaAncha: accesibilidad.puerta_80cm,
          contrasteColores: accesibilidad.contraste_colores,
          guiasPodotactiles: accesibilidad.guias_podotactiles,
          alarmasEmergencia: accesibilidad.alarmas_emergencia,
          sistemaAudifonos: accesibilidad.sistema_audifonos
        }
      };
    });

    res.json({
      success: true,
      empresas: empresasResponse,
      total: empresasResponse.length
    });

  } catch (error) {
    console.error('Error obteniendo últimos locales:', error);
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

    // Filtrar información sensible y mapear campos de accesibilidad
    const accesibilidad = empresa.detallesAccesibilidad[0] || {};
    
    const empresaResponse = {
      empresa_id: empresa.empresa_id,
      nombre: empresa.nombre,
      email: empresa.email,
      descripcion: empresa.descripcion,
      direccion: empresa.direccion,
      contacto: empresa.contacto,
      horario: empresa.horario,
      publicado: empresa.publicado,
      imagenes: empresa.imagenes,
      calificacion: {
        promedio: 0,
        totalCalificaciones: 0
      },
      accesibilidad: {
        // Mapear campos de la BD a los nombres que espera el frontend
        ramp: accesibilidad.rampa,
        banoAdaptado: accesibilidad.bano_accesible,
        braille: accesibilidad.senalizacion_braille,
        interprete: false, // No está en el esquema actual
        pisosAntideslizantes: accesibilidad.pisos_antideslizantes,
        mesasSillasAdaptadas: accesibilidad.mesas_sillas_adaptadas,
        elevator: accesibilidad.ascensor,
        pasillos: accesibilidad.pasillos_min_90cm,
        puertaAncha: accesibilidad.puerta_80cm,
        contrasteColores: accesibilidad.contraste_colores,
        guiasPodotactiles: accesibilidad.guias_podotactiles,
        alarmasEmergencia: accesibilidad.alarmas_emergencia,
        sistemaAudifonos: accesibilidad.sistema_audifonos
      }
    };

    res.json({ success: true, empresa: empresaResponse });

  } catch (error) {
    console.error('Error obteniendo empresa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * updatePerfil
 * Endpoint para actualizar la información completa del perfil de una empresa.
 */
export const updatePerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, direccion, contacto, email, horario, accesibilidad } = req.body;

    console.log('Actualizando perfil para empresa ID:', id);
    console.log('Datos recibidos:', { nombre, descripcion, direccion, contacto, email, horario, accesibilidad });
    console.log('Accesibilidad recibida (detalle):', JSON.stringify(accesibilidad, null, 2));

    if (!id) {
      return res.status(400).json({ error: 'ID de empresa es obligatorio' });
    }

    // Actualizar información básica de la empresa
    const empresaActualizada = await EmpresaService.updateEmpresaPerfil(
      parseInt(id),
      {
        nombre,
        descripcion,
        direccion,
        contacto,
        email,
        horario
      }
    );

    console.log('Empresa actualizada:', empresaActualizada);

    // Actualizar accesibilidad si se proporciona
    if (accesibilidad) {
      console.log('Actualizando accesibilidad:', accesibilidad);
      const accesibilidadActualizada = await EmpresaService.updateEmpresaAccesibilidad(parseInt(id), accesibilidad, {});
      console.log('Accesibilidad actualizada en BD:', accesibilidadActualizada);
    }

    // Obtener la empresa actualizada con accesibilidad
    const empresaCompleta = await EmpresaService.getEmpresaById(id);
    
    console.log('Empresa completa obtenida:', empresaCompleta);

    // Mapear respuesta incluyendo accesibilidad
    const accesibilidadData = empresaCompleta.detallesAccesibilidad[0] || {};
    const empresaResponse = {
      empresa_id: empresaCompleta.empresa_id,
      nombre: empresaCompleta.nombre,
      email: empresaCompleta.email,
      descripcion: empresaCompleta.descripcion,
      direccion: empresaCompleta.direccion,
      contacto: empresaCompleta.contacto,
      horario: empresaCompleta.horario,
      publicado: empresaCompleta.publicado,
      accesibilidad: {
        // Mapear campos de la BD a los nombres que espera el frontend
        pasillos: accesibilidadData.pasillos_min_90cm,
        ramp: accesibilidadData.rampa,
        puertaAncha: accesibilidadData.puerta_80cm,
        pisosAntideslizantes: accesibilidadData.pisos_antideslizantes,
        banoAdaptado: accesibilidadData.bano_accesible,
        mesasSillasAdaptadas: accesibilidadData.mesas_sillas_adaptadas,
        elevator: accesibilidadData.ascensor,
        braille: accesibilidadData.senalizacion_braille,
        contrasteColores: accesibilidadData.contraste_colores,
        guiasPodotactiles: accesibilidadData.guias_podotactiles,
        alarmasEmergencia: accesibilidadData.alarmas_emergencia,
        sistemaAudifonos: accesibilidadData.sistema_audifonos
      }
    };

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      empresa: empresaResponse
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
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

/**
 * uploadImagenes
 * Endpoint para subir imágenes del local de una empresa.
 */
export const uploadImagenes = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('=== UPLOAD IMAGENES ===');
    console.log('Empresa ID:', id);
    console.log('Archivos recibidos:', req.files);
    console.log('Body:', req.body);
    console.log('Headers:', req.headers);

    if (!id) {
      return res.status(400).json({ error: 'ID de empresa es obligatorio' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron archivos' });
    }

    // Obtener URLs de las imágenes subidas
    const imageUrls = req.files.map(file => {
      // Construir URL completa para acceder a la imagen
      return `http://localhost:3001/uploads/${file.filename}`;
    });

    console.log('URLs de imágenes generadas:', imageUrls);

    // Actualizar la empresa con las nuevas imágenes
    const empresaActualizada = await EmpresaService.updateImagenes(parseInt(id), imageUrls);

    console.log('Empresa actualizada con imágenes:', empresaActualizada);

    res.json({
      success: true,
      message: 'Imágenes subidas exitosamente',
      imagenes: imageUrls,
      empresa: empresaActualizada
    });

  } catch (error) {
    console.error('Error subiendo imágenes:', error);
    res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
};
