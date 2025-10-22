import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';

// Cargar .env
dotenv.config();

const usuariosEjemplo = [
  {
    name: 'luciaf',
    email: 'luciaf@example.com',
    password: 'luciaf123'
  },
  {
    name: 'admin',
    email: 'admin@example.com',
    password: 'admin123'
  }
];

const main = async () => {
  try {
    console.log('🌱 Iniciando seed de usuarios...');

    for (const userData of usuariosEjemplo) {
      const existing = await prisma.usuario.findUnique({ where: { email: userData.email } });
      if (existing) {
        console.log('El usuario ya existe:', userData.email);
        continue;
      }

      const hashed = await bcrypt.hash(userData.password, 10);
      const user = await prisma.usuario.create({ 
        data: { 
          nombre: userData.name, 
          email: userData.email, 
          password: hashed,
          publicado: true
        } 
      });
      console.log('Usuario creado:', user.email);
    }

    console.log('🎉 Seed de usuarios completado!');
  } catch (err) {
    console.error('Error creando usuarios:', err);
  } finally {
    await prisma.$disconnect();
  }
};

main();
