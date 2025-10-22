import * as EmpresaService from '../services/empresaService.js';

export const getAllEmpresas = async (req, res) => {
  try {
    const empresas = await EmpresaService.getAllEmpresas();
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
          ramp: accesibilidad.rampa,
          banoAdaptado: accesibilidad.bano_accesible,
          braille: accesibilidad.senalizacion_braille,
          interprete: false,
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

export const getUltimosLocales = async (req, res) => {
  try {
    const empresas = await EmpresaService.getUltimosLocales();
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
          ramp: accesibilidad.rampa,
          banoAdaptado: accesibilidad.bano_accesible,
          braille: accesibilidad.senalizacion_braille,
          interprete: false,
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

export const getEmpresaById = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await EmpresaService.getEmpresaById(parseInt(id));

    if (!empresa) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

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
      accesibilidad: {
        ramp: accesibilidad.rampa,
        banoAdaptado: accesibilidad.bano_accesible,
        braille: accesibilidad.senalizacion_braille,
        interprete: false,
        pisosAntideslizantes: accesibilidad.pisos_antideslizantes,
        mesasSillasAdaptadas: accesibilidad.mesas_sillas_adaptadas,
        elevator: accesibilidad.ascensor,
        pasillos: accesibilidad.pasillos_min_90cm,
        puertaAncha: accesibilidad.puerta_80cm,
        contrasteColores: accesibilidad.contraste_colores,
        guiasPodotactiles: accesibilidad.guias_podotactiles,
        alarmasEmergencia: accesibilidad.alarmas_emergencia,
        sistemaAudifonos: accesibilidad.sistema_audifonos
      },
      calificacion: {
        promedio: 4.5,
        totalCalificaciones: 0
      }
    };

    res.json({
      success: true,
      empresa: empresaResponse
    });
  } catch (error) {
    console.error('Error obteniendo empresa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const createEmpresa = async (req, res) => {
  try {
    const empresaData = req.body;
    const nuevaEmpresa = await EmpresaService.createEmpresa(empresaData);
    res.status(201).json({
      success: true,
      empresa: nuevaEmpresa
    });
  } catch (error) {
    console.error('Error creando empresa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const empresaData = req.body;
    const empresaActualizada = await EmpresaService.updateEmpresa(parseInt(id), empresaData);
    
    if (!empresaActualizada) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    res.json({
      success: true,
      empresa: empresaActualizada
    });
  } catch (error) {
    console.error('Error actualizando empresa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const empresaEliminada = await EmpresaService.deleteEmpresa(parseInt(id));
    
    if (!empresaEliminada) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    res.json({
      success: true,
      message: 'Empresa eliminada correctamente'
    });
  } catch (error) {
    console.error('Error eliminando empresa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const registerEmpresa = async (req, res) => {
  try {
    const empresaData = req.body;
    console.log('registerEmpresa - Datos recibidos:', empresaData);
    
    const result = await EmpresaService.createEmpresa(empresaData);
    console.log('registerEmpresa - Resultado del servicio:', result);
    
    // El servicio devuelve { empresa, accesibilidad }
    const nuevaEmpresa = result.empresa;
    
    // Generar token JWT para la nueva empresa
    const jwt = await import('jsonwebtoken');
    const token = jwt.default.sign(
      {
        id: nuevaEmpresa.empresa_id,
        email: nuevaEmpresa.email,
        tipo: 'empresa'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      success: true,
      token,
      empresa: {
        empresa_id: nuevaEmpresa.empresa_id,
        nombre: nuevaEmpresa.nombre,
        email: nuevaEmpresa.email,
        descripcion: nuevaEmpresa.descripcion,
        direccion: nuevaEmpresa.direccion,
        contacto: nuevaEmpresa.contacto,
        horario: nuevaEmpresa.horario,
        publicado: nuevaEmpresa.publicado,
        imagenes: nuevaEmpresa.imagenes,
        tipo: 'empresa'
      }
    });
  } catch (error) {
    console.error('Error registrando empresa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const loginEmpresa = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar empresa por email
    const empresa = await EmpresaService.getEmpresaByEmail(email);
    
    if (!empresa) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    // Verificar contraseña (asumiendo que está hasheada)
    // En una implementación real, usarías bcrypt.compare()
    if (empresa.password !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    // Generar token JWT
    const jwt = await import('jsonwebtoken');
    const token = jwt.default.sign(
      { 
        id: empresa.empresa_id, 
        email: empresa.email, 
        tipo: 'empresa' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        empresa_id: empresa.empresa_id,
        nombre: empresa.nombre,
        email: empresa.email,
        tipo: 'empresa'
      }
    });
  } catch (error) {
    console.error('Error en login de empresa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updatePerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const datosPerfil = req.body;
    
    console.log('updatePerfil - ID:', id);
    console.log('updatePerfil - Datos recibidos:', datosPerfil);
    
    // Actualizar perfil básico
    const empresaActualizada = await EmpresaService.updateEmpresaPerfil(parseInt(id), datosPerfil);
    
    // Si hay datos de accesibilidad, actualizarlos también
    if (datosPerfil.accesibilidad) {
      console.log('updatePerfil - Actualizando accesibilidad con datos:', datosPerfil.accesibilidad);
      await EmpresaService.updateEmpresaAccesibilidad(parseInt(id), datosPerfil.accesibilidad, {});
    }
    
    // Obtener datos completos actualizados
    const empresaCompleta = await EmpresaService.getEmpresaById(parseInt(id));
    
    if (!empresaActualizada) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    // Mapear los datos de accesibilidad para el frontend
    let accesibilidadMapeada = {};
    if (empresaCompleta.detallesAccesibilidad && empresaCompleta.detallesAccesibilidad.length > 0) {
      const accesibilidad = empresaCompleta.detallesAccesibilidad[0];
      accesibilidadMapeada = {
        pasillos: accesibilidad.pasillos_min_90cm,
        ramp: accesibilidad.rampa,
        puertaAncha: accesibilidad.puerta_80cm,
        pisosAntideslizantes: accesibilidad.pisos_antideslizantes,
        banoAdaptado: accesibilidad.bano_accesible,
        mesasSillasAdaptadas: accesibilidad.mesas_sillas_adaptadas,
        elevator: accesibilidad.ascensor,
        braille: accesibilidad.senalizacion_braille,
        contrasteColores: accesibilidad.contraste_colores,
        guiasPodotactiles: accesibilidad.guias_podotactiles,
        alarmasEmergencia: accesibilidad.alarmas_emergencia,
        sistemaAudifonos: accesibilidad.sistema_audifonos
      };
    }

    const empresaConAccesibilidad = {
      ...empresaCompleta,
      accesibilidad: accesibilidadMapeada
    };

    res.json({
      success: true,
      empresa: empresaConAccesibilidad
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateAccesibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviciosAccesibilidad, detallesAccesibilidad } = req.body;

    console.log('updateAccesibilidad - ID:', id);
    console.log('updateAccesibilidad - Servicios:', serviciosAccesibilidad);
    console.log('updateAccesibilidad - Detalles:', detallesAccesibilidad);
    
    const accesibilidadActualizada = await EmpresaService.updateEmpresaAccesibilidad(
      parseInt(id), 
      serviciosAccesibilidad, 
      detallesAccesibilidad
    );
    
    if (!accesibilidadActualizada) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    res.json({
      success: true,
      accesibilidad: accesibilidadActualizada
    });
  } catch (error) {
    console.error('Error actualizando accesibilidad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const uploadImagenes = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files;
    
    console.log('uploadImagenes - ID:', id);
    console.log('uploadImagenes - Archivos recibidos:', files?.length || 0);
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No se recibieron archivos' });
    }
    
    // Generar URLs de las nuevas imágenes
    const newImageUrls = files.map(file => `http://localhost:3000/uploads/${file.filename}`);
    
    // Actualizar las imágenes en la base de datos (esto ahora suma las nuevas a las existentes)
    const empresaActualizada = await EmpresaService.updateImagenes(parseInt(id), newImageUrls);
    
    if (!empresaActualizada) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    // Parsear todas las imágenes (existentes + nuevas) para devolverlas
    let todasLasImagenes = [];
    if (empresaActualizada.imagenes) {
      try {
        todasLasImagenes = JSON.parse(empresaActualizada.imagenes);
      } catch (error) {
        console.error('Error parseando imágenes en respuesta:', error);
        todasLasImagenes = newImageUrls;
      }
    }

    res.json({
      success: true,
      imagenesNuevas: newImageUrls,
      todasLasImagenes: todasLasImagenes,
      empresa: empresaActualizada
    });
  } catch (error) {
    console.error('Error subiendo imágenes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar todas las imágenes (para eliminar las que no queremos)
export const updateAllImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { imagenes } = req.body;
    
    console.log('updateAllImages - ID:', id);
    console.log('updateAllImages - Imágenes recibidas:', imagenes?.length || 0);
    
    if (!Array.isArray(imagenes)) {
      return res.status(400).json({ error: 'Las imágenes deben ser un array' });
    }
    
    // Verificar que no exceda el límite de 9
    if (imagenes.length > 9) {
      return res.status(400).json({ error: 'Máximo 9 imágenes permitidas' });
    }
    
    // Reemplazar completamente todas las imágenes en la base de datos
    const empresaActualizada = await EmpresaService.replaceAllImages(parseInt(id), imagenes);
    
    if (!empresaActualizada) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }
    
    res.json({
      success: true,
      imagenes: imagenes,
      empresa: empresaActualizada
    });
  } catch (error) {
    console.error('Error actualizando imágenes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar imagen específica
export const deleteImagen = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;
    
    console.log('deleteImagen - ID:', id);
    console.log('deleteImagen - Image URL:', imageUrl);
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'URL de imagen requerida' });
    }
    
    // Obtener la empresa actual
    const empresa = await EmpresaService.getEmpresaById(parseInt(id));
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }
    
    // Parsear las imágenes existentes
    let imagenesExistentes = [];
    if (empresa.imagenes) {
      try {
        imagenesExistentes = JSON.parse(empresa.imagenes);
      } catch (error) {
        console.error('Error parseando imágenes existentes:', error);
        return res.status(500).json({ error: 'Error procesando imágenes' });
      }
    }
    
    // Filtrar la imagen a eliminar
    const imagenesActualizadas = imagenesExistentes.filter(img => img !== imageUrl);
    
    // Actualizar en la base de datos
    const empresaActualizada = await EmpresaService.replaceAllImages(parseInt(id), imagenesActualizadas);
    
    if (!empresaActualizada) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }
    
    res.json({
      success: true,
      imagenesRestantes: imagenesActualizadas,
      empresa: empresaActualizada
    });
  } catch (error) {
    console.error('Error eliminando imagen:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
