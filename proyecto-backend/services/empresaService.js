import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';

/**
 * registerEmpresa
 * Registra una nueva empresa con sus servicios de accesibilidad.
 * Crea tanto el registro de la empresa como el de accesibilidad asociado.
 * @param {{nombre:string,email:string,password:string,serviciosAccesibilidad:object,detallesAccesibilidad:object}} param0
 */
export const registerEmpresa = async ({ 
  nombre, 
  email, 
  password, 
  serviciosAccesibilidad, 
  detallesAccesibilidad 
}) => {
  console.log('registerEmpresa service - Datos recibidos:', { nombre, email, serviciosAccesibilidad, detallesAccesibilidad });
  
  // Verificar si la empresa ya existe
  const empresaExists = await prisma.empresa.findUnique({ where: { email } });
  if (empresaExists) throw new Error('La empresa ya existe');

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear la empresa y su accesibilidad en una transacción
  const result = await prisma.$transaction(async (tx) => {
    // Crear la empresa
    const empresa = await tx.empresa.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        publicado: false
      }
    });

    // Crear el registro de accesibilidad asociado
    const accesibilidad = await tx.accesibilidad.create({
      data: {
        empresa_id: empresa.empresa_id,
        // Accesibilidad física
        pasillos_min_90cm: serviciosAccesibilidad.pasillosMin90cm || false,
        rampa: serviciosAccesibilidad.rampa || false,
        puerta_80cm: serviciosAccesibilidad.puerta80cm || false,
        pisos_antideslizantes: serviciosAccesibilidad.pisosAntideslizantes || false,
        bano_accesible: serviciosAccesibilidad.banoAccesible || false,
        mesas_sillas_adaptadas: serviciosAccesibilidad.mesasSillasAdaptadas || false,
        ascensor: serviciosAccesibilidad.ascensor || false,
        // Adaptabilidad accesible
        senalizacion_braille: serviciosAccesibilidad.senalizacionBraille || false,
        contraste_colores: serviciosAccesibilidad.contrasteColores || false,
        guias_podotactiles: serviciosAccesibilidad.guiasPodotactiles || false,
        alarmas_emergencia: serviciosAccesibilidad.alarmasEmergencia || false,
        sistema_audifonos: serviciosAccesibilidad.sistemaAudifonos || false,
        // Campos adicionales
        bano_adaptado_cantidad: detallesAccesibilidad.banoAdaptadoCantidad || null,
        bano_adaptado_detalles: detallesAccesibilidad.banoAdaptadoDetalles || null,
        atencion_prioritaria_tipo: detallesAccesibilidad.atencionPrioritariaTipo || null,
        atencion_prioritaria_horario: detallesAccesibilidad.atencionPrioritariaHorario || null,
        otros_servicios: detallesAccesibilidad.otrosServicios || null
      }
    });

    return { empresa, accesibilidad };
  });

  return result;
};

/**
 * findByEmail
 * Busca una empresa por email.
 */
export const findByEmail = async (email) => {
  return await prisma.empresa.findUnique({ 
    where: { email },
    include: {
      detallesAccesibilidad: true
    }
  });
};

/**
 * getEmpresaByEmail
 * Busca una empresa por email (alias para findByEmail).
 */
export const getEmpresaByEmail = async (email) => {
  return await findByEmail(email);
};

/**
 * getAllEmpresas
 * Obtiene todas las empresas con sus datos de accesibilidad.
 */
export const getAllEmpresas = async () => {
  return await prisma.empresa.findMany({
    include: {
      detallesAccesibilidad: true
    },
    orderBy: {
      empresa_id: 'desc'
    }
  });
};

/**
 * getUltimosLocales
 * Obtiene los últimos 3 locales registrados con sus datos de accesibilidad.
 */
export const getUltimosLocales = async () => {
  return await prisma.empresa.findMany({
    include: {
      detallesAccesibilidad: true
    },
    orderBy: {
      empresa_id: 'desc'
    },
    take: 3
  });
};

/**
 * getEmpresaById
 * Obtiene una empresa específica por ID con sus datos de accesibilidad.
 */
export const getEmpresaById = async (id) => {
  return await prisma.empresa.findUnique({
    where: { empresa_id: parseInt(id) },
    include: {
      detallesAccesibilidad: true
    }
  });
};

/**
 * updateEmpresaPerfil
 * Actualiza la información básica del perfil de una empresa.
 */
export const updateEmpresaPerfil = async (empresaId, datosPerfil) => {
  return await prisma.empresa.update({
    where: { empresa_id: empresaId },
    data: {
      nombre: datosPerfil.nombre,
      descripcion: datosPerfil.descripcion,
      direccion: datosPerfil.direccion,
      contacto: datosPerfil.contacto,
      email: datosPerfil.email,
      horario: datosPerfil.horario
    }
  });
};

/**
 * updateEmpresaAccesibilidad
 * Actualiza los datos de accesibilidad de una empresa existente.
 */
export const updateEmpresaAccesibilidad = async (empresaId, serviciosAccesibilidad, detallesAccesibilidad) => {
  console.log('updateEmpresaAccesibilidad - ID:', empresaId);
  console.log('updateEmpresaAccesibilidad - Servicios recibidos:', serviciosAccesibilidad);
  
  // Primero buscar si ya existe un registro de accesibilidad para esta empresa
  const accesibilidadExistente = await prisma.accesibilidad.findFirst({
    where: { empresa_id: empresaId }
  });

  const datosAccesibilidad = {
    // Accesibilidad física - mapear desde los nombres del frontend
    pasillos_min_90cm: serviciosAccesibilidad.pasillos || false,
    rampa: serviciosAccesibilidad.ramp || false,
    puerta_80cm: serviciosAccesibilidad.puertaAncha || false,
    pisos_antideslizantes: serviciosAccesibilidad.pisosAntideslizantes || false,
    bano_accesible: serviciosAccesibilidad.banoAdaptado || false,
    mesas_sillas_adaptadas: serviciosAccesibilidad.mesasSillasAdaptadas || false,
    ascensor: serviciosAccesibilidad.elevator || false,
    // Adaptabilidad accesible
    senalizacion_braille: serviciosAccesibilidad.braille || false,
    contraste_colores: serviciosAccesibilidad.contrasteColores || false,
    guias_podotactiles: serviciosAccesibilidad.guiasPodotactiles || false,
    alarmas_emergencia: serviciosAccesibilidad.alarmasEmergencia || false,
    sistema_audifonos: serviciosAccesibilidad.sistemaAudifonos || false,
    // Campos adicionales
    bano_adaptado_cantidad: detallesAccesibilidad.banoAdaptadoCantidad || null,
    bano_adaptado_detalles: detallesAccesibilidad.banoAdaptadoDetalles || null,
    atencion_prioritaria_tipo: detallesAccesibilidad.atencionPrioritariaTipo || null,
    atencion_prioritaria_horario: detallesAccesibilidad.atencionPrioritariaHorario || null,
    otros_servicios: detallesAccesibilidad.otrosServicios || null
  };

  if (accesibilidadExistente) {
    // Si existe, actualizar usando el accesibilidad_id
    return await prisma.accesibilidad.update({
      where: { accesibilidad_id: accesibilidadExistente.accesibilidad_id },
      data: datosAccesibilidad
    });
  } else {
    // Si no existe, crear un nuevo registro
    return await prisma.accesibilidad.create({
      data: {
        empresa_id: empresaId,
        ...datosAccesibilidad
      }
    });
  }
};

export const updateImagenes = async (empresaId, newImageUrls) => {
  // Primero obtener las imágenes existentes
  const empresa = await prisma.empresa.findUnique({
    where: { empresa_id: empresaId },
    select: { imagenes: true }
  });

  // Parsear las imágenes existentes o usar array vacío si no hay
  let imagenesExistentes = [];
  if (empresa && empresa.imagenes) {
    try {
      imagenesExistentes = JSON.parse(empresa.imagenes);
    } catch (error) {
      console.error('Error parseando imágenes existentes:', error);
      imagenesExistentes = [];
    }
  }

  // Combinar imágenes existentes con las nuevas
  const todasLasImagenes = [...imagenesExistentes, ...newImageUrls];

  // Actualizar con todas las imágenes
  return await prisma.empresa.update({
    where: { empresa_id: empresaId },
    data: {
      imagenes: JSON.stringify(todasLasImagenes)
    }
  });
};

// Nueva función para reemplazar completamente todas las imágenes
export const replaceAllImages = async (empresaId, allImages) => {
  console.log('replaceAllImages - ID:', empresaId);
  console.log('replaceAllImages - Imágenes a guardar:', allImages?.length || 0);
  
  return await prisma.empresa.update({
    where: { empresa_id: empresaId },
    data: {
      imagenes: JSON.stringify(allImages)
    }
  });
};

/**
 * createEmpresa
 * Crea una nueva empresa (alias para registerEmpresa).
 */
export const createEmpresa = async (empresaData) => {
  return await registerEmpresa(empresaData);
};

/**
 * updateEmpresa
 * Actualiza una empresa existente.
 */
export const updateEmpresa = async (id, empresaData) => {
  return await prisma.empresa.update({
    where: { empresa_id: parseInt(id) },
    data: empresaData
  });
};

/**
 * deleteEmpresa
 * Elimina una empresa.
 */
export const deleteEmpresa = async (id) => {
  return await prisma.empresa.delete({
    where: { empresa_id: parseInt(id) }
  });
};
