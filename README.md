# Nutriec Backend

Backend API para el proyecto Nutriec desarrollado con Node.js y Express.

## 🚀 Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **dotenv** - Gestión de variables de entorno
- **cors** - Middleware para habilitar CORS
- **nodemon** - Auto-reinicio del servidor en desarrollo

## 📦 Instalación

```bash
npm install
```

## 🏃 Ejecutar el proyecto

### Modo desarrollo (con auto-reload)
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

## 📝 Scripts disponibles

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon

## 🌐 Endpoints

### GET /
Endpoint principal que retorna información sobre la API

### GET /health
Endpoint de verificación de salud del servidor

## 🔧 Configuración

Las variables de entorno se configuran en el archivo `.env`:

```
PORT=3000
NODE_ENV=development
```

## 📁 Estructura del proyecto

```
nutriec-backend/
├── index.js          # Punto de entrada de la aplicación
├── package.json      # Dependencias y scripts
├── .env              # Variables de entorno
├── .gitignore        # Archivos ignorados por git
└── README.md         # Documentación
```

## 🤝 Contribuir

1. Clona el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios
4. Haz commit de tus cambios (`git commit -m 'Añade nueva funcionalidad'`)
5. Push a la rama (`git push origin feature/nueva-funcionalidad`)
6. Abre un Pull Request
