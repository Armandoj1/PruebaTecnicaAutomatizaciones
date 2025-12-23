export type Administracion = 'ESTATAL' | 'AUTONOMICA' | 'LOCAL';

export type Categoria = 'Sanidad' | 'Educación' | 'Administración' | 'Justicia' | 'Seguridad' | 'Tecnología';

export type EstadoOposicion = 'ACTIVA' | 'CERRADA';

export type EstadoSolicitud = 'SOLICITADA' | 'PROCESANDO' | 'PENDIENTE_REVISION' | 'APROBADA' | 'RECHAZADA';

export interface Oposicion {
  id: number;
  titulo: string;
  administracion: Administracion;
  provincia: string;
  categoria: Categoria;
  numPlazas: number;
  estado: EstadoOposicion;
  fechaPublicacion: string;
  fechaCierre: string;
  descripcion: string;
  requisitos: string[];
  temarioOficial: string[];
  procesoSelectivo: string[];
  enlaceBasesOficiales?: string;
}

export interface Solicitud {
  id: number;
  oposicionId: number;
  oposicionTitulo: string;
  provincia: string;
  estado: EstadoSolicitud;
  fechaSolicitud: string;
  progreso: number;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  provincia: string;
}
