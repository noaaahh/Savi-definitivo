import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';

// Cargar .env
dotenv.config();

const main = async () => {
  try {
    const email = 'luciaf@example.com';
    const name = 'luciaf';
    const password = 'luciaf123';

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log('El usuario ya existe:', email);
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed } });
    console.log('Usuario creado:', user.email);
  } catch (err) {
    console.error('Error creando usuario:', err);
  } finally {
    await prisma.$disconnect();
  }
};

main();
