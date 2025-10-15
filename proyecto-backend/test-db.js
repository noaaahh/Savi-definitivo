import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Probando conexión a la base de datos...');
    
    // Probar conexión
    await prisma.$connect();
    console.log('✅ Conexión exitosa a la base de datos');
    
    // Contar empresas
    const empresaCount = await prisma.empresa.count();
    console.log(`📊 Total de empresas en la base de datos: ${empresaCount}`);
    
    // Obtener todas las empresas
    const empresas = await prisma.empresa.findMany({
      include: {
        detallesAccesibilidad: true
      }
    });
    
    console.log('🏢 Empresas encontradas:');
    empresas.forEach((empresa, index) => {
      console.log(`${index + 1}. ${empresa.nombre} (ID: ${empresa.empresa_id})`);
    });
    
    if (empresas.length === 0) {
      console.log('⚠️  No hay empresas en la base de datos');
      console.log('💡 Necesitas agregar empresas primero');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
