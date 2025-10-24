import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteEmpresa(empresaId) {
  try {
    console.log(`🗑️  Eliminando empresa con ID: ${empresaId}...`);
    
    // Verificar que la empresa existe
    const empresa = await prisma.empresa.findUnique({
      where: { empresa_id: empresaId },
      include: {
        detallesAccesibilidad: true,
        calificaciones: true
      }
    });
    
    if (!empresa) {
      console.log(`❌ No se encontró la empresa con ID: ${empresaId}`);
      return;
    }
    
    console.log(`📋 Empresa encontrada: ${empresa.nombre}`);
    console.log(`   🔧 Registros de accesibilidad: ${empresa.detallesAccesibilidad.length}`);
    console.log(`   ⭐ Calificaciones: ${empresa.calificaciones.length}`);
    
    // Eliminar la empresa (esto eliminará automáticamente los registros relacionados por CASCADE)
    const resultado = await prisma.empresa.delete({
      where: { empresa_id: empresaId }
    });
    
    console.log(`✅ Empresa "${resultado.nombre}" eliminada exitosamente`);
    console.log(`   📧 Email: ${resultado.email}`);
    console.log(`   🗑️  Se eliminaron automáticamente ${empresa.detallesAccesibilidad.length} registro(s) de accesibilidad`);
    console.log(`   🗑️  Se eliminaron automáticamente ${empresa.calificaciones.length} calificación(es)`);
    
  } catch (error) {
    console.error('❌ Error eliminando empresa:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Obtener el ID de la empresa desde los argumentos de línea de comandos
const empresaId = process.argv[2];

if (!empresaId) {
  console.log('❌ Uso: node delete-empresa.js <empresa_id>');
  console.log('📝 Ejemplo: node delete-empresa.js 1');
  process.exit(1);
}

deleteEmpresa(parseInt(empresaId));
