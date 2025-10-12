import { PrismaClient } from '@prisma/client';

// Instancia única del cliente de Prisma. Se reutiliza en los servicios
// para hacer consultas a la base de datos.
const prisma = new PrismaClient();
// Estado de la conexión para que el servidor pueda responder salud (health)
let dbConnected = false;

/**
 * connectDB
 * Intenta establecer la conexión con la base de datos utilizando Prisma.
 * Si la conexión falla, se imprime el error y se finaliza el proceso porque
 * la API depende de la base de datos para funcionar.
 */
export const connectDB = async () => {
  // Intenta establecer la conexión con la base de datos.
  try {
    await prisma.$connect();
    dbConnected = true;
    console.log('MySQL conectado con Prisma');
  } catch (error) {
    console.error('Error conectando a MySQL:', error);
    // No salir del proceso: dejamos que la app arranque y responda 503 en /health
    dbConnected = false;
  }
};

export const isDBConnected = () => dbConnected;

export default prisma;
