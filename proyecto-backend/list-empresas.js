import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listEmpresas() {
  try {
    console.log('📋 Lista de empresas en la base de datos:\n');
    
    const empresas = await prisma.empresa.findMany({
      include: {
        detallesAccesibilidad: true,
        calificaciones: true
      },
      orderBy: {
        empresa_id: 'asc'
      }
    });
    
    if (empresas.length === 0) {
      console.log('📭 No hay empresas en la base de datos');
      return;
    }
    
    empresas.forEach(empresa => {
      console.log(`🏢 ID: ${empresa.empresa_id} | ${empresa.nombre}`);
      console.log(`   📧 Email: ${empresa.email}`);
      console.log(`   📍 Dirección: ${empresa.direccion || 'No especificada'}`);
      console.log(`   🔧 Accesibilidad: ${empresa.detallesAccesibilidad.length} registro(s)`);
      console.log(`   ⭐ Calificaciones: ${empresa.calificaciones.length}`);
      console.log(`   📅 Publicado: ${empresa.publicado ? 'Sí' : 'No'}`);
      console.log(''); // Línea en blanco
    });
    
    console.log(`📊 Total: ${empresas.length} empresa(s)`);
    console.log('\n💡 Para eliminar una empresa, usa: node delete-empresa.js <empresa_id>');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listEmpresas();
