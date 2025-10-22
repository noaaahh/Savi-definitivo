import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
 
// Configurar CORS para permitir el frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);

// Ruta temporal para empresas
app.get('/api/empresas', (req, res) => {
  res.json({
    success: true,
    empresas: [
      {
        id: 1,
        nombre: "Empresa Demo",
        descripcion: "Descripción de prueba",
        direccion: "Calle Falsa 123",
        imagen: "",
        accesibilidad: {
          ramp: true,
          banoAdaptado: false,
          braille: false,
          interprete: false,
          pisosAntideslizantes: false,
          mesasSillasAdaptadas: false,
          elevator: false,
          pasillos: false,
          puertaAncha: false,
          contrasteColores: false,
          guiasPodotactiles: false,
          alarmasEmergencia: false,
          sistemaAudifonos: false
        }
      }
    ]
  });
});


// Conexión a la base de datos
connectDB();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
