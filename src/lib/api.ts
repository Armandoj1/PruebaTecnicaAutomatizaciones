// API client para conectar con el backend local y n8n
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ==========================================
// AUTENTICACIÓN
// ==========================================

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al iniciar sesión');
  }
  
  return response.json() as Promise<ApiResponse>;
}

// ==========================================
// OPOSICIONES
// ==========================================

export async function getOposiciones(filters?: {
  query?: string;
  administracion?: string;
  provincia?: string;
  categoria?: string;
  soloActivas?: boolean;
}) {
  const params = new URLSearchParams();
  if (filters?.query) params.append('query', filters.query);
  if (filters?.administracion) params.append('administracion', filters.administracion);
  if (filters?.provincia) params.append('provincia', filters.provincia);
  if (filters?.categoria) params.append('categoria', filters.categoria);
  if (filters?.soloActivas) params.append('soloActivas', 'true');

  const response = await fetch(`${API_BASE_URL}/oposiciones?${params}`);
  if (!response.ok) throw new Error('Error al obtener oposiciones');
  return response.json() as Promise<ApiResponse>;
}

export async function getOposicionById(id: number) {
  const response = await fetch(`${API_BASE_URL}/oposiciones/${id}`);
  if (!response.ok) throw new Error('Error al obtener oposición');
  return response.json() as Promise<ApiResponse>;
}

// ==========================================
// SOLICITUDES DE RELACIÓN
// ==========================================

export async function crearSolicitud(data: {
  usuario_id: number;
  oposicion_id: number;
  usuario_email?: string;
  usuario_nombre?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/solicitudes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usuario_id: data.usuario_id,
      oposicion_id: data.oposicion_id,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al crear solicitud');
  }
  
  const result = await response.json() as ApiResponse;
  
  return result;
}

export async function getSolicitudesByUsuario(usuarioId: number) {
  const response = await fetch(`${API_BASE_URL}/solicitudes/usuario/${usuarioId}`);
  if (!response.ok) throw new Error('Error al obtener solicitudes');
  return response.json() as Promise<ApiResponse>;
}

export async function getSolicitudById(id: number) {
  const response = await fetch(`${API_BASE_URL}/solicitudes/${id}`);
  if (!response.ok) throw new Error('Error al obtener solicitud');
  return response.json() as Promise<ApiResponse>;
}

// ==========================================
// RELACIONES Y TEMARIOS
// ==========================================

export async function getRelacionById(id: number) {
  const response = await fetch(`${API_BASE_URL}/relaciones/${id}`);
  if (!response.ok) throw new Error('Error al obtener relación');
  return response.json() as Promise<ApiResponse>;
}

export async function getRelacionPorSolicitud(solicitudId: number) {
  const response = await fetch(`${API_BASE_URL}/relaciones/solicitud/${solicitudId}`);
  if (!response.ok) throw new Error('Error al obtener relación');
  return response.json() as Promise<ApiResponse>;
}

export async function descargarMapeoJSON(relacionId: number) {
  const response = await fetch(`${API_BASE_URL}/relaciones/${relacionId}/download`);
  if (!response.ok) throw new Error('Error al descargar mapeo');
  return response.json();
}

// ==========================================
// N8N WEBHOOK TRIGGER
// ==========================================

async function triggerN8nWorkflow(data: {
  solicitud_id: number;
  oposicion_id: number;
  usuario_id: number;
  usuario_email: string;
  usuario_nombre: string;
}) {
  try {
    const response = await fetch(`${N8N_WEBHOOK_URL}/mapeo-temario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      console.error('Error al disparar workflow de n8n:', await response.text());
    }
  } catch (error) {
    console.error('Error al conectar con n8n:', error);
    // No lanzamos error aquí porque la solicitud ya se creó en BD
  }
}

// ==========================================
// ESTADÍSTICAS Y DASHBOARD
// ==========================================

export async function getEstadisticas() {
  const response = await fetch(`${API_BASE_URL}/estadisticas`);
  if (!response.ok) throw new Error('Error al obtener estadísticas');
  return response.json() as Promise<ApiResponse>;
}

// ==========================================
// PROVINCIAS Y CATEGORÍAS
// ==========================================

export async function getProvincias() {
  const response = await fetch(`${API_BASE_URL}/provincias`);
  if (!response.ok) throw new Error('Error al obtener provincias');
  return response.json() as Promise<ApiResponse>;
}

export async function getCategorias() {
  const response = await fetch(`${API_BASE_URL}/categorias`);
  if (!response.ok) throw new Error('Error al obtener categorías');
  return response.json() as Promise<ApiResponse>;
}

export async function getAdministraciones() {
  const response = await fetch(`${API_BASE_URL}/administraciones`);
  if (!response.ok) throw new Error('Error al obtener administraciones');
  return response.json() as Promise<ApiResponse>;
}

// ==========================================
// AUTENTICACIÓN
// ==========================================
// (login function already defined above)

export async function register(data: { 
  email: string; 
  password: string; 
  nombre: string; 
  provincia_id?: number 
}) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al registrarse');
  }

  return response.json() as Promise<ApiResponse<{ user: any; token: string }>>;
}
