# Configuración de Base de Datos para Registro de Empresas

## Pasos para configurar la base de datos:

### 1. Crear archivo .env
Crea un archivo `.env` en la raíz del proyecto backend con el siguiente contenido:

```env
# Configuración de la base de datos
DATABASE_URL="mysql://usuario:password@localhost:3306/nombre_base_datos"

# Configuración JWT
JWT_SECRET="tu_secreto_jwt_muy_seguro_aqui"
JWT_EXPIRES_IN="7d"

# Puerto del servidor
PORT=3000
```

### 2. Configurar credenciales
Reemplaza en el DATABASE_URL:
- `usuario`: tu usuario de MySQL
- `password`: tu contraseña de MySQL  
- `nombre_base_datos`: el nombre de tu base de datos (ej: `navi_db`)

### 3. Ejecutar migración
Una vez configurado el archivo .env, ejecuta:

```bash
cd repositorio-savi/proyecto-backend
npx prisma migrate dev --name update_accesibilidad_fields
```

### 4. Generar cliente Prisma
```bash
npx prisma generate
```

## Endpoints disponibles:

### POST /api/empresas/register
Registra una nueva empresa con sus servicios de accesibilidad.

**Body:**
```json
{
  "nombre": "Nombre de la empresa",
  "email": "empresa@ejemplo.com",
  "password": "contraseña123",
  "serviciosAccesibilidad": {
    "pasillosMin90cm": true,
    "rampa": false,
    "puerta80cm": true,
    "pisosAntideslizantes": false,
    "banoAccesible": true,
    "mesasSillasAdaptadas": false,
    "ascensor": true,
    "senalizacionBraille": false,
    "contrasteColores": true,
    "guiasPodotactiles": false,
    "alarmasEmergencia": true,
    "sistemaAudifonos": false
  },
  "detallesAccesibilidad": {
    "banoAdaptadoCantidad": "2",
    "banoAdaptadoDetalles": "Baños en planta baja",
    "atencionPrioritariaTipo": "Cola preferencial",
    "atencionPrioritariaHorario": "9:00-18:00",
    "otrosServicios": "Servicio de asistencia personalizada"
  }
}
```

### POST /api/empresas/login
Autentica una empresa existente.

### GET /api/empresas
Obtiene todas las empresas con sus datos de accesibilidad.

### GET /api/empresas/:id
Obtiene una empresa específica por ID.

### PUT /api/empresas/:id/accesibilidad
Actualiza los datos de accesibilidad de una empresa (requiere autenticación).
