import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import empresaRoutes from './routes/empresaRoutes.js';
import calificacionRoutes from './routes/calificacionRoutes.js';
import { connectDB, isDBConnected } from './config/db.js';

// Cargar variables de entorno desde el archivo .env
// Esto permite usar process.env.DATABASE_URL, process.env.JWT_SECRET, etc.
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar CORS para permitir que el frontend en desarrollo acceda a la API.
// origin: dirección del frontend (Vite por defecto en 5173).
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json());

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static('uploads'));

// Rutas: agrupadas por responsabilidad
app.use('/api/auth', authRoutes); // login, etc.
app.use('/api/users', userRoutes); // registro, perfil, etc.
app.use('/api/contact', contactRoutes); // endpoint para mensajes de contacto
app.use('/api/empresas', empresaRoutes); // registro, login y gestión de empresas
app.use('/api/calificaciones', calificacionRoutes); // calificaciones de empresas

// Endpoint de salud para que nginx/monitoring verifique el estado.
app.get('/health', (req, res) => {
  if (isDBConnected()) return res.status(200).json({ status: 'ok' });
  return res.status(503).json({ status: 'db_unavailable' });
});

// Iniciar la conexión a la base de datos (Prisma)
// connectDB intentará conectar con la BD y si falla hará process.exit(1)
connectDB();

// Iniciar servidor HTTP
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
