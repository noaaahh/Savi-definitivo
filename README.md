# Savi - Sistema de Accesibilidad e Inclusión

## 📋 Descripción

**Savi** es una plataforma web innovadora diseñada para promover la accesibilidad e inclusión en establecimientos comerciales. La aplicación permite a las empresas registrar y mostrar sus características de accesibilidad, mientras que los usuarios pueden buscar y filtrar locales que cumplan con sus necesidades específicas de accesibilidad.

### 🎯 Función Principal

Savi conecta a personas con discapacidades o necesidades especiales con establecimientos que ofrecen servicios accesibles, facilitando la búsqueda de lugares inclusivos y promoviendo una sociedad más accesible para todos.

## 🏢 Misión

**Facilitar el acceso universal** a espacios comerciales y de servicios, eliminando barreras físicas y digitales para crear una sociedad verdaderamente inclusiva donde todas las personas puedan participar plenamente en la vida social y económica.

## 👁️ Visión

Ser la plataforma líder en Latinoamérica para la promoción de la accesibilidad, conectando a millones de personas con establecimientos inclusivos y transformando la forma en que las empresas abordan la accesibilidad universal.

## 💎 Valores

- **Inclusión**: Creemos en un mundo donde todos tienen derecho a participar plenamente
- **Accesibilidad**: Promovemos el diseño universal y la eliminación de barreras
- **Transparencia**: Proporcionamos información clara y verificable sobre accesibilidad
- **Empatía**: Entendemos las necesidades diversas de nuestra comunidad
- **Innovación**: Utilizamos tecnología para crear soluciones inclusivas
- **Colaboración**: Trabajamos junto con empresas y usuarios para construir un futuro más accesible

## 🛠️ Requisitos del Sistema

### Base de Datos
- **XAMPP** (para ejecutar MySQL)
- **Extensión SQLite** (para Prisma ORM)

### Tecnologías Utilizadas
- **Frontend**: React.js, Vite, CSS3
- **Backend**: Node.js, Express.js
- **Base de Datos**: MySQL con Prisma ORM
- **Autenticación**: JWT (JSON Web Tokens)

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd Savi-definitiva-main-main
```

### 2. Configurar XAMPP
1. Descargar e instalar [XAMPP](https://www.apachefriends.org/)
2. Iniciar los servicios **Apache** y **MySQL** desde el panel de control de XAMPP
3. Verificar que MySQL esté ejecutándose en el puerto 3306

### 3. Configurar la Base de Datos
1. Abrir phpMyAdmin (http://localhost/phpmyadmin)
2. Crear una nueva base de datos llamada `navi_db`
3. Configurar el archivo `.env` en `proyecto-backend/` con:
```env
DATABASE_URL="mysql://root:@localhost:3306/navi_db"
JWT_SECRET="tu_secreto_jwt_muy_seguro_aqui_2024"
PORT=3000
```

### 4. Instalar Dependencias del Backend
```bash
cd proyecto-backend
npm install
npx prisma generate
npx prisma db push
```

### 5. Instalar Dependencias del Frontend
```bash
cd ../proyecto-frontend
npm install
```

## ▶️ Ejecutar la Aplicación

### Backend (Terminal 1)
```bash
cd proyecto-backend
npm start
```
El backend estará disponible en: http://localhost:3000

### Frontend (Terminal 2)
```bash
cd proyecto-frontend
npm run dev
```
El frontend estará disponible en: http://localhost:5173

## 📱 Funcionalidades

### Para Usuarios
- 🔍 **Búsqueda de locales** con filtros de accesibilidad
- ⭐ **Sistema de calificaciones** para establecimientos
- 📧 **Contacto directo** con empresas
- 👤 **Perfil personal** y gestión de cuenta

### Para Empresas
- 🏢 **Registro de establecimiento** con información detallada
- ♿ **Configuración de accesibilidad** (rampas, baños adaptados, etc.)
- 📸 **Galería de imágenes** (máximo 9 fotos)
- 📊 **Gestión de perfil** y actualización de información

## 🎨 Características de Accesibilidad

- **Rampas** y accesos sin barreras
- **Baños adaptados** con barras de apoyo
- **Señalización en braille**
- **Pisos antideslizantes**
- **Mesas y sillas adaptadas**
- **Ascensores** accesibles
- **Pasillos de mínimo 90cm**
- **Puertas de 80cm de ancho**
- **Contraste de colores** adecuado
- **Guías podotáctiles**
- **Alarmas de emergencia** visuales y sonoras
- **Sistema de apoyo** para audífonos

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

- **Email**: savi@gmail.com.uy
- **Teléfono**: 091 222 333

---

**Savi** - Construyendo un mundo más accesible, un establecimiento a la vez. 🌟
