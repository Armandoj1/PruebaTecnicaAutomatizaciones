import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'Temario',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool = null;

export async function connectDB() {
  try {
    if (pool) {
      return pool;
    }

    console.log('🔌 Conectando a SQL Server...');
    pool = await sql.connect(config);
    console.log('✅ Conectado a SQL Server exitosamente');
    
    return pool;
  } catch (error) {
    console.error('❌ Error al conectar con SQL Server:', error.message);
    throw error;
  }
}

export async function closeDB() {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('🔌 Conexión a SQL Server cerrada');
    }
  } catch (error) {
    console.error('❌ Error al cerrar conexión:', error.message);
  }
}

export async function executeQuery(query, params = {}) {
  try {
    const connection = await connectDB();
    const request = connection.request();
    
    // Agregar parámetros si existen
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });
    
    const result = await request.query(query);
    return result;
  } catch (error) {
    console.error('❌ Error al ejecutar query:', error.message);
    throw error;
  }
}

export async function executeProcedure(procedureName, params = {}) {
  try {
    const connection = await connectDB();
    const request = connection.request();
    
    // Agregar parámetros si existen
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });
    
    const result = await request.execute(procedureName);
    return result;
  } catch (error) {
    console.error('❌ Error al ejecutar procedimiento:', error.message);
    throw error;
  }
}

// Manejar cierre de conexión al terminar el proceso
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDB();
  process.exit(0);
});

export default { connectDB, closeDB, executeQuery, executeProcedure };
