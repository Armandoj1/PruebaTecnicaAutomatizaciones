# 🚀 OpoBusca Backend API

Backend API para el sistema de mapeo de temarios con IA.

## 📋 Requisitos

- Node.js 18+
- SQL Server
- Base de datos OpoBuscaDB configurada

## ⚡ Instalación

```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install
```

## 🔧 Configuración

1. **Edita el archivo `.env` con tus credenciales de SQL Server:**

```env
PORT=3001
DB_SERVER=localhost
DB_NAME=OpoBuscaDB
DB_USER=tu_usuario_sql
DB_PASSWORD=tu_password_sql
DB_PORT=1433
FRONTEND_URL=http://localhost:5173
```

## 🚀 Ejecutar

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

La API estará disponible en: `http://localhost:3001`

## 📊 Endpoints Disponibles

### Oposiciones
- `GET /api/oposiciones` - Listar oposiciones
- `GET /api/oposiciones/:id` - Obtener una oposición

### Solicitudes
- `POST /api/solicitudes` - Crear nueva solicitud
- `GET /api/solicitudes/usuario/:id` - Solicitudes de un usuario
- `GET /api/solicitudes/:id` - Detalle de solicitud

### Relaciones/Mapeos
- `GET /api/relaciones/:id` - Detalle de relación
- `GET /api/relaciones/solicitud/:id` - Relación por solicitud
- `GET /api/relaciones/:id/download` - Descargar mapeo JSON

### Datos Maestros
- `GET /api/provincias` - Listado de provincias
- `GET /api/categorias` - Listado de categorías
- `GET /api/administraciones` - Listado de administraciones
- `GET /api/estadisticas` - Estadísticas del sistema

## 🧪 Probar la API

```bash
# Health check
curl http://localhost:3001/health

# Listar oposiciones
curl http://localhost:3001/api/oposiciones

# Crear solicitud
curl -X POST http://localhost:3001/api/solicitudes \
  -H "Content-Type: application/json" \
  -d '{"usuario_id": 1, "oposicion_id": 1}'
```

## 📁 Estructura

```
backend/
├── server.js         # Servidor principal
├── db.js            # Conexión a SQL Server
├── package.json     # Dependencias
├── .env            # Variables de entorno
└── README.md       # Esta documentación
```

## 🔗 Conectar con Frontend

El frontend ya está configurado para usar esta API en `src/lib/api.ts`

Asegúrate de que el frontend use:
```
http://localhost:3001/api
```
