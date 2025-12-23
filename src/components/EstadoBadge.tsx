import { cn } from "@/lib/utils";
import { EstadoOposicion, EstadoSolicitud } from "@/types/oposicion";

type EstadoType = EstadoOposicion | EstadoSolicitud;

interface EstadoBadgeProps {
  estado: EstadoType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const estadoConfig: Record<EstadoType, { bg: string; text: string; label: string }> = {
  ACTIVA: { bg: 'bg-success/10', text: 'text-success', label: 'Activa' },
  CERRADA: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Cerrada' },
  SOLICITADA: { bg: 'bg-warning/10', text: 'text-warning', label: 'Solicitada' },
  PROCESANDO: { bg: 'bg-info/10', text: 'text-info', label: 'Procesando' },
  PENDIENTE_REVISION: { bg: 'bg-warning/20', text: 'text-warning', label: 'Pendiente de revisión' },
  APROBADA: { bg: 'bg-success/10', text: 'text-success', label: 'Aprobada' },
  RECHAZADA: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Rechazada' },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export function EstadoBadge({ estado, size = 'md', className }: EstadoBadgeProps) {
  const config = estadoConfig[estado];

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        config.bg,
        config.text,
        sizeClasses[size],
        className
      )}
    >
      {config.label}
    </span>
  );
}
