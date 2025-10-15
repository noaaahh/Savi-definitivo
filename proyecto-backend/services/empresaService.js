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
 * updateEmpresaAccesibilidad
 * Actualiza los datos de accesibilidad de una empresa existente.
 */
export const updateEmpresaAccesibilidad = async (empresaId, serviciosAccesibilidad, detallesAccesibilidad) => {
  return await prisma.accesibilidad.update({
    where: { empresa_id: empresaId },
    data: {
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
};
