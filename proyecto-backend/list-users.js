import prisma from './config/db.js';

async function listUsers() {
  try {
    const users = await prisma.usuario.findMany();
    console.log(`\n=== USUARIOS EN LA BASE DE DATOS ===`);
    console.log(`Total de usuarios: ${users.length}\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.usuario_id}`);
      console.log(`   Nombre: ${user.nombre}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Publicado: ${user.publicado}`);
      console.log(`   Fecha: ${user.createdAt || 'No disponible'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
