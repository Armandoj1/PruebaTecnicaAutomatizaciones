import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, executeQuery, executeProcedure } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ==========================================
// MIDDLEWARES
// ==========================================

app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:8080', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});


app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario por email y password
    const sql = `
      SELECT 
        id,
        email,
        nombre,
        provincia_id,
        activo
      FROM Usuarios
      WHERE email = '${email}' 
        AND password_hash = '${password}'
        AND activo = 1
    `;

    const result = await executeQuery(sql);

    if (result.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    const usuario = result.recordset[0];

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        provincia_id: usuario.provincia_id
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// RUTAS - SOLICITUDES
// ==========================================

// Crear solicitud de relación de temario
app.post('/api/solicitudes', async (req, res) => {
  try {
    const { usuario_id, oposicion_id } = req.body;

    if (!usuario_id || !oposicion_id) {
      return res.status(400).json({
        success: false,
        error: 'usuario_id y oposicion_id son requeridos'
      });
    }

    const checkSql = `
      SELECT id, estado 
      FROM SolicitudesRelacion 
      WHERE usuario_id = ${usuario_id} 
        AND oposicion_id = ${oposicion_id}
        AND estado IN ('SOLICITADA', 'PROCESANDO', 'PENDIENTE_REVISION')
    `;

    const existingRequest = await executeQuery(checkSql);

    if (existingRequest.recordset.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe una solicitud en proceso para esta oposición'
      });
    }

    // Crear nueva solicitud
    const insertSql = `
      INSERT INTO SolicitudesRelacion (
        usuario_id, oposicion_id, relacion_temario_id,
        estado, fecha_solicitud, intentos_generacion, notificado
      )
      VALUES (
        ${usuario_id},
        ${oposicion_id},
        NULL,
        'SOLICITADA',
        GETDATE(),
        0,
        0
      );
      SELECT SCOPE_IDENTITY() as solicitud_id;
    `;

    const result = await executeQuery(insertSql);
    const solicitudId = result.recordset[0].solicitud_id;

    res.json({
      success: true,
      message: 'Solicitud creada exitosamente',
      data: {
        solicitud_id: solicitudId,
        estado: 'SOLICITADA'
      }
    });

  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Obtener solicitudes de un usuario
app.get('/api/solicitudes/usuario/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const sql = `
      SELECT 
        sr.id as solicitud_id,
        sr.usuario_id,
        sr.oposicion_id,
        sr.estado,
        sr.fecha_solicitud,
        sr.fecha_completada,
        sr.intentos_generacion,
        o.titulo as oposicion_titulo,
        a.nombre as administracion,
        p.nombre as provincia,
        c.nombre as categoria,
        rt.id as relacion_id,
        rt.mapeo_json,
        rt.estado as estado_relacion
      FROM SolicitudesRelacion sr
      INNER JOIN Oposiciones o ON sr.oposicion_id = o.id
      INNER JOIN Administraciones a ON o.administracion_id = a.id
      LEFT JOIN Provincias p ON o.provincia_id = p.id
      INNER JOIN Categorias c ON o.categoria_id = c.id
      LEFT JOIN RelacionesTemarios rt ON sr.relacion_temario_id = rt.id
      WHERE sr.usuario_id = ${usuario_id}
      ORDER BY sr.fecha_solicitud DESC
    `;

    const result = await executeQuery(sql);

    res.json({
      success: true,
      data: result.recordset
    });

  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// RUTAS - OPOSICIONES
// ==========================================

// Obtener todas las oposiciones (con filtros)
app.get('/api/oposiciones', async (req, res) => {
  try {
    const { query, administracion, provincia, categoria, soloActivas } = req.query;
    
    let sql = `
      SELECT 
        o.id,
        o.titulo,
        a.nombre as administracion,
        a.tipo as tipo_administracion,
        p.nombre as provincia,
        c.nombre as categoria,
        o.num_plazas,
        o.estado,
        o.fecha_publicacion,
        o.fecha_cierre,
        o.descripcion,
        o.url_bases_oficiales
      FROM Oposiciones o
      INNER JOIN Administraciones a ON o.administracion_id = a.id
      LEFT JOIN Provincias p ON o.provincia_id = p.id
      INNER JOIN Categorias c ON o.categoria_id = c.id
      WHERE 1=1
    `;

    if (query) {
      sql += ` AND (o.titulo LIKE '%${query}%' OR p.nombre LIKE '%${query}%' OR c.nombre LIKE '%${query}%')`;
    }
    if (administracion) {
      sql += ` AND a.tipo = '${administracion}'`;
    }
    if (provincia) {
      sql += ` AND p.nombre = '${provincia}'`;
    }
    if (categoria) {
      sql += ` AND c.nombre = '${categoria}'`;
    }
    if (soloActivas === 'true') {
      sql += ` AND o.estado = 'ACTIVA'`;
    }

    sql += ` ORDER BY o.fecha_publicacion DESC`;

    const result = await executeQuery(sql);
    
    res.json({
      success: true,
      data: result.recordset,
      total: result.recordset.length
    });
  } catch (error) {
    console.error('Error al obtener oposiciones:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Obtener una oposición por ID
app.get('/api/oposiciones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const sql = `
      SELECT 
        o.*,
        a.nombre as administracion_nombre,
        a.tipo as tipo_administracion,
        p.nombre as provincia_nombre,
        c.nombre as categoria_nombre
      FROM Oposiciones o
      INNER JOIN Administraciones a ON o.administracion_id = a.id
      LEFT JOIN Provincias p ON o.provincia_id = p.id
      INNER JOIN Categorias c ON o.categoria_id = c.id
      WHERE o.id = ${id}
    `;

    const result = await executeQuery(sql);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Oposición no encontrada'
      });
    }

    res.json({
      success: true,
      data: result.recordset[0]
    });
  } catch (error) {
    console.error('Error al obtener oposición:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// RUTAS - SOLICITUDES
// ==========================================

// Crear nueva solicitud
app.post('/api/solicitudes', async (req, res) => {
  try {
    const { usuario_id, oposicion_id, usuario_email, usuario_nombre } = req.body;

    if (!usuario_id || !oposicion_id) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: usuario_id, oposicion_id'
      });
    }

    // Verificar si ya existe una solicitud activa
    const checkSql = `
      SELECT id FROM SolicitudesRelacion 
      WHERE usuario_id = ${usuario_id} 
      AND oposicion_id = ${oposicion_id}
      AND estado NOT IN ('RECHAZADA', 'APROBADA')
    `;
    
    const check = await executeQuery(checkSql);
    
    if (check.recordset.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe una solicitud activa para esta oposición'
      });
    }

    // Crear la solicitud
    const insertSql = `
      INSERT INTO SolicitudesRelacion (usuario_id, oposicion_id, estado, fecha_solicitud)
      OUTPUT INSERTED.id
      VALUES (${usuario_id}, ${oposicion_id}, 'SOLICITADA', GETDATE())
    `;

    const result = await executeQuery(insertSql);
    const solicitudId = result.recordset[0].id;

    // Log
    const logSql = `
      INSERT INTO LogsSistema (tipo, entidad, entidad_id, usuario_id, mensaje, nivel)
      VALUES ('SOLICITUD', 'SOLICITUD', ${solicitudId}, ${usuario_id}, 
              'Nueva solicitud creada desde frontend', 'INFO')
    `;
    await executeQuery(logSql);

    res.json({
      success: true,
      message: 'Solicitud creada exitosamente',
      data: {
        solicitud_id: solicitudId,
        estado: 'SOLICITADA'
      }
    });

  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Obtener solicitudes de un usuario
app.get('/api/solicitudes/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const sql = `
      SELECT 
        sr.id,
        sr.estado,
        sr.fecha_solicitud,
        sr.fecha_completada,
        sr.notificado,
        o.titulo as oposicion_titulo,
        o.num_plazas,
        p.nombre as provincia,
        c.nombre as categoria,
        rt.id as relacion_id,
        rt.estado as relacion_estado
      FROM SolicitudesRelacion sr
      INNER JOIN Oposiciones o ON sr.oposicion_id = o.id
      LEFT JOIN Provincias p ON o.provincia_id = p.id
      INNER JOIN Categorias c ON o.categoria_id = c.id
      LEFT JOIN RelacionesTemarios rt ON sr.relacion_temario_id = rt.id
      WHERE sr.usuario_id = ${id}
      ORDER BY sr.fecha_solicitud DESC
    `;

    const result = await executeQuery(sql);
    
    res.json({
      success: true,
      data: result.recordset
    });
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Obtener una solicitud por ID
app.get('/api/solicitudes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const sql = `
      SELECT 
        sr.*,
        o.titulo as oposicion_titulo,
        u.nombre as usuario_nombre,
        u.email as usuario_email
      FROM SolicitudesRelacion sr
      INNER JOIN Oposiciones o ON sr.oposicion_id = o.id
      INNER JOIN Usuarios u ON sr.usuario_id = u.id
      WHERE sr.id = ${id}
    `;

    const result = await executeQuery(sql);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Solicitud no encontrada'
      });
    }

    res.json({
      success: true,
      data: result.recordset[0]
    });
  } catch (error) {
    console.error('Error al obtener solicitud:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// RUTAS - RELACIONES/MAPEOS
// ==========================================

// Obtener relación por ID
app.get('/api/relaciones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const sql = `
      SELECT 
        rt.*,
        tof.titulo as temario_oficial_titulo,
        ti.titulo as temario_interno_titulo,
        p.nombre as profesor_nombre
      FROM RelacionesTemarios rt
      INNER JOIN TemariosOficiales tof ON rt.temario_oficial_id = tof.id
      INNER JOIN TemariosInternos ti ON rt.temario_interno_id = ti.id
      LEFT JOIN Profesores p ON rt.profesor_id = p.id
      WHERE rt.id = ${id}
    `;

    const result = await executeQuery(sql);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Relación no encontrada'
      });
    }

    res.json({
      success: true,
      data: result.recordset[0]
    });
  } catch (error) {
    console.error('Error al obtener relación:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Obtener relación por solicitud
app.get('/api/relaciones/solicitud/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const sql = `
      SELECT rt.*
      FROM RelacionesTemarios rt
      INNER JOIN SolicitudesRelacion sr ON sr.relacion_temario_id = rt.id
      WHERE sr.id = ${id}
    `;

    const result = await executeQuery(sql);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Relación no encontrada para esta solicitud'
      });
    }

    res.json({
      success: true,
      data: result.recordset[0]
    });
  } catch (error) {
    console.error('Error al obtener relación:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Descargar mapeo JSON
app.get('/api/relaciones/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    
    const sql = `SELECT mapeo_json FROM RelacionesTemarios WHERE id = ${id}`;
    const result = await executeQuery(sql);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Mapeo no encontrado'
      });
    }

    const mapeoJson = JSON.parse(result.recordset[0].mapeo_json);
    
    res.json({
      success: true,
      data: mapeoJson
    });
  } catch (error) {
    console.error('Error al descargar mapeo:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// RUTAS - AUTENTICACIÓN
// ==========================================

// Registro de usuario
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, nombre, provincia_id } = req.body;
    
    if (!email || !password || !nombre) {
      return res.status(400).json({
        success: false,
        message: 'Email, contraseña y nombre son requeridos'
      });
    }
    
    const checkSql = `SELECT id FROM Usuarios WHERE email = '${email}'`;
    const checkResult = await executeQuery(checkSql);
    
    if (checkResult.recordset.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }
    
    const passwordHash = Buffer.from(password).toString('base64');
    
    const insertSql = `
      INSERT INTO Usuarios (email, nombre, password_hash, provincia_id, activo, fecha_registro)
      OUTPUT INSERTED.id, INSERTED.email, INSERTED.nombre, INSERTED.provincia_id
      VALUES ('${email}', '${nombre}', '${passwordHash}', ${provincia_id || 'NULL'}, 1, GETDATE())
    `;
    
    const result = await executeQuery(insertSql);
    const user = result.recordset[0];
    
    const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        provincia_id: user.provincia_id
      },
      token
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Login de usuario
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }
    
    const sql = `
      SELECT id, email, nombre, password_hash, provincia_id, activo
      FROM Usuarios
      WHERE email = '${email}'
    `;
    
    const result = await executeQuery(sql);
    
    if (result.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }
    
    const user = result.recordset[0];
    
    if (!user.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }
    
    const passwordHash = Buffer.from(password).toString('base64');
    
    if (user.password_hash !== passwordHash) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }
    
    const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        provincia_id: user.provincia_id
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ==========================================
// RUTAS - DATOS MAESTROS
// ==========================================

// Obtener provincias
app.get('/api/provincias', async (req, res) => {
  try {
    const sql = `
      SELECT id, nombre, codigo, comunidad_autonoma 
      FROM Provincias 
      WHERE activo = 1
      ORDER BY nombre
    `;
    const result = await executeQuery(sql);
    
    res.json({
      success: true,
      data: result.recordset
    });
  } catch (error) {
    console.error('Error al obtener provincias:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Obtener categorías
app.get('/api/categorias', async (req, res) => {
  try {
    const sql = `
      SELECT id, nombre, descripcion 
      FROM Categorias 
      WHERE activo = 1
      ORDER BY orden, nombre
    `;
    const result = await executeQuery(sql);
    
    res.json({
      success: true,
      data: result.recordset
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Obtener administraciones
app.get('/api/administraciones', async (req, res) => {
  try {
    const sql = `
      SELECT id, nombre, tipo 
      FROM Administraciones 
      WHERE activo = 1
      ORDER BY nombre
    `;
    const result = await executeQuery(sql);
    
    res.json({
      success: true,
      data: result.recordset
    });
  } catch (error) {
    console.error('Error al obtener administraciones:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Estadísticas del sistema
app.get('/api/estadisticas', async (req, res) => {
  try {
    const sql = `
      SELECT 
        (SELECT COUNT(*) FROM Oposiciones WHERE estado = 'ACTIVA') as oposiciones_activas,
        (SELECT COUNT(*) FROM SolicitudesRelacion WHERE estado = 'SOLICITADA') as solicitudes_pendientes,
        (SELECT COUNT(*) FROM SolicitudesRelacion WHERE estado = 'APROBADA') as solicitudes_aprobadas,
        (SELECT COUNT(*) FROM RelacionesTemarios WHERE estado = 'APROBADO') as mapeos_aprobados,
        (SELECT COUNT(*) FROM Usuarios WHERE activo = 1) as usuarios_activos
    `;
    
    const result = await executeQuery(sql);
    
    res.json({
      success: true,
      data: result.recordset[0]
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// RUTA DE HEALTH CHECK
// ==========================================

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'OpoBusca API - Sistema de Mapeo de Temarios',
    version: '1.0.0',
    endpoints: {
      oposiciones: '/api/oposiciones',
      solicitudes: '/api/solicitudes',
      relaciones: '/api/relaciones',
      provincias: '/api/provincias',
      categorias: '/api/categorias',
      administraciones: '/api/administraciones',
      estadisticas: '/api/estadisticas'
    }
  });
});

// ==========================================
// MANEJO DE ERRORES
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: err.message
  });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

async function startServer() {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 ================================');
      console.log(`🚀 OpoBusca API corriendo en:`);
      console.log(`🚀 http://localhost:${PORT}`);
      console.log('🚀 ================================');
      console.log('');
      console.log('📊 Endpoints disponibles:');
      console.log(`   GET  /api/oposiciones`);
      console.log(`   GET  /api/oposiciones/:id`);
      console.log(`   POST /api/solicitudes`);
      console.log(`   GET  /api/solicitudes/usuario/:id`);
      console.log(`   GET  /api/relaciones/:id`);
      console.log(`   GET  /api/provincias`);
      console.log(`   GET  /api/estadisticas`);
      console.log('');
      console.log(`🌐 Frontend conectado: ${FRONTEND_URL}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();
