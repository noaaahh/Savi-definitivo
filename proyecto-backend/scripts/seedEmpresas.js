import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';

const empresasEjemplo = [
  {
    nombre: "Restaurante El Buen Sabor",
    email: "contacto@elbuensabor.com",
    password: "password123",
    serviciosAccesibilidad: {
      pasillosMin90cm: true,
      rampa: true,
      puerta80cm: true,
      pisosAntideslizantes: false,
      banoAccesible: true,
      mesasSillasAdaptadas: true,
      ascensor: false,
      senalizacionBraille: false,
      contrasteColores: true,
      guiasPodotactiles: false,
      alarmasEmergencia: true,
      sistemaAudifonos: false
    },
    detallesAccesibilidad: {
      banoAdaptadoCantidad: "1",
      banoAdaptadoDetalles: "Baño adaptado en planta baja",
      atencionPrioritariaTipo: "Atención preferencial",
      atencionPrioritariaHorario: "12:00-15:00, 19:00-22:00",
      otrosServicios: "Menú en braille disponible"
    }
  },
  {
    nombre: "Café Central",
    email: "info@cafecentral.com",
    password: "password123",
    serviciosAccesibilidad: {
      pasillosMin90cm: true,
      rampa: false,
      puerta80cm: true,
      pisosAntideslizantes: true,
      banoAccesible: true,
      mesasSillasAdaptadas: false,
      ascensor: false,
      senalizacionBraille: true,
      contrasteColores: true,
      guiasPodotactiles: true,
      alarmasEmergencia: true,
      sistemaAudifonos: true
    },
    detallesAccesibilidad: {
      banoAdaptadoCantidad: "2",
      banoAdaptadoDetalles: "Baños adaptados en ambas plantas",
      atencionPrioritariaTipo: "Servicio personalizado",
      atencionPrioritariaHorario: "8:00-20:00",
      otrosServicios: "Sistema de audio para personas con discapacidad visual"
    }
  },
  {
    nombre: "Farmacia San José",
    email: "ventas@farmaciasanjose.com",
    password: "password123",
    serviciosAccesibilidad: {
      pasillosMin90cm: true,
      rampa: true,
      puerta80cm: true,
      pisosAntideslizantes: true,
      banoAccesible: true,
      mesasSillasAdaptadas: false,
      ascensor: true,
      senalizacionBraille: true,
      contrasteColores: true,
      guiasPodotactiles: false,
      alarmasEmergencia: true,
      sistemaAudifonos: false
    },
    detallesAccesibilidad: {
      banoAdaptadoCantidad: "1",
      banoAdaptadoDetalles: "Baño adaptado en planta baja",
      atencionPrioritariaTipo: "Cola preferencial",
      atencionPrioritariaHorario: "9:00-18:00",
      otrosServicios: "Asistencia personalizada para medicamentos"
    }
  }
];

async function seedEmpresas() {
  try {
    console.log('🌱 Iniciando seed de empresas...');

    // Limpiar datos existentes
    await prisma.accesibilidad.deleteMany();
    await prisma.empresa.deleteMany();
    console.log('✅ Datos existentes eliminados');

    // Crear empresas de ejemplo
    for (const empresaData of empresasEjemplo) {
      const hashedPassword = await bcrypt.hash(empresaData.password, 10);
      
      const result = await prisma.$transaction(async (tx) => {
        // Crear la empresa
        const empresa = await tx.empresa.create({
          data: {
            nombre: empresaData.nombre,
            email: empresaData.email,
            password: hashedPassword,
            publicado: true
          }
        });

        // Crear el registro de accesibilidad
        const accesibilidad = await tx.accesibilidad.create({
          data: {
            empresa_id: empresa.empresa_id,
            pasillos_min_90cm: empresaData.serviciosAccesibilidad.pasillosMin90cm,
            rampa: empresaData.serviciosAccesibilidad.rampa,
            puerta_80cm: empresaData.serviciosAccesibilidad.puerta80cm,
            pisos_antideslizantes: empresaData.serviciosAccesibilidad.pisosAntideslizantes,
            bano_accesible: empresaData.serviciosAccesibilidad.banoAccesible,
            mesas_sillas_adaptadas: empresaData.serviciosAccesibilidad.mesasSillasAdaptadas,
            ascensor: empresaData.serviciosAccesibilidad.ascensor,
            senalizacion_braille: empresaData.serviciosAccesibilidad.senalizacionBraille,
            contraste_colores: empresaData.serviciosAccesibilidad.contrasteColores,
            guias_podotactiles: empresaData.serviciosAccesibilidad.guiasPodotactiles,
            alarmas_emergencia: empresaData.serviciosAccesibilidad.alarmasEmergencia,
            sistema_audifonos: empresaData.serviciosAccesibilidad.sistemaAudifonos,
            bano_adaptado_cantidad: empresaData.detallesAccesibilidad.banoAdaptadoCantidad,
            bano_adaptado_detalles: empresaData.detallesAccesibilidad.banoAdaptadoDetalles,
            atencion_prioritaria_tipo: empresaData.detallesAccesibilidad.atencionPrioritariaTipo,
            atencion_prioritaria_horario: empresaData.detallesAccesibilidad.atencionPrioritariaHorario,
            otros_servicios: empresaData.detallesAccesibilidad.otrosServicios
          }
        });

        return { empresa, accesibilidad };
      });

      console.log(`✅ Empresa creada: ${empresaData.nombre}`);
    }

    console.log('🎉 Seed completado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en el seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedEmpresas();
