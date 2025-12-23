import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// ==========================================
// HOOKS PARA OPOSICIONES
// ==========================================

export function useOposiciones(filters?: {
  query?: string;
  administracion?: string;
  provincia?: string;
  categoria?: string;
  soloActivas?: boolean;
}) {
  return useQuery({
    queryKey: ['oposiciones', filters],
    queryFn: () => api.getOposiciones(filters),
  });
}

export function useOposicion(id: number) {
  return useQuery({
    queryKey: ['oposicion', id],
    queryFn: () => api.getOposicionById(id),
    enabled: !!id,
  });
}

// ==========================================
// HOOKS PARA SOLICITUDES
// ==========================================

export function useSolicitudesByUsuario(usuarioId: number) {
  return useQuery({
    queryKey: ['solicitudes', usuarioId],
    queryFn: () => api.getSolicitudesByUsuario(usuarioId),
    enabled: !!usuarioId,
  });
}

export function useSolicitud(id: number) {
  return useQuery({
    queryKey: ['solicitud', id],
    queryFn: () => api.getSolicitudById(id),
    enabled: !!id,
  });
}

export function useCrearSolicitud() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: api.crearSolicitud,
    onSuccess: (result) => {
      // Invalidar queries para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
      
      toast({
        title: '✅ Solicitud creada',
        description: result.message || 'Tu solicitud ha sido procesada correctamente.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: '❌ Error',
        description: error.message || 'No se pudo crear la solicitud. Intenta de nuevo.',
        variant: 'destructive',
      });
    },
  });
}

// ==========================================
// HOOKS PARA RELACIONES
// ==========================================

export function useRelacion(id: number) {
  return useQuery({
    queryKey: ['relacion', id],
    queryFn: () => api.getRelacionById(id),
    enabled: !!id,
  });
}

export function useRelacionPorSolicitud(solicitudId: number) {
  return useQuery({
    queryKey: ['relacion-solicitud', solicitudId],
    queryFn: () => api.getRelacionPorSolicitud(solicitudId),
    enabled: !!solicitudId,
  });
}

// ==========================================
// HOOKS PARA DATOS MAESTROS
// ==========================================

export function useProvincias() {
  return useQuery({
    queryKey: ['provincias'],
    queryFn: api.getProvincias,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
}

export function useCategorias() {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: api.getCategorias,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
}

export function useAdministraciones() {
  return useQuery({
    queryKey: ['administraciones'],
    queryFn: api.getAdministraciones,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
}

export function useEstadisticas() {
  return useQuery({
    queryKey: ['estadisticas'],
    queryFn: api.getEstadisticas,
    refetchInterval: 30000, // Refrescar cada 30 segundos
  });
}
