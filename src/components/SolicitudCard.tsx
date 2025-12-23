import { MapPin, Calendar, Download, Eye } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EstadoBadge } from "@/components/EstadoBadge";
import { ProgressSteps } from "@/components/ProgressSteps";
import { Solicitud } from "@/types/oposicion";
import { Link } from "react-router-dom";

interface SolicitudCardProps {
  solicitud: Solicitud;
}

export function SolicitudCard({ solicitud }: SolicitudCardProps) {
  const getSteps = () => {
    const steps = [
      { label: "Solicitud recibida", completed: true, active: false },
      { label: "Generando mapeo con IA", completed: solicitud.progreso >= 40, active: solicitud.progreso >= 20 && solicitud.progreso < 40 },
      { label: "Revisión del profesor", completed: solicitud.progreso >= 80, active: solicitud.progreso >= 40 && solicitud.progreso < 80 },
      { label: "Aprobación final", completed: solicitud.progreso >= 100, active: solicitud.progreso >= 80 && solicitud.progreso < 100 },
    ];
    return steps;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card className="overflow-hidden border-border/50 bg-card animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground leading-tight">
              {solicitud.oposicionTitulo}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {solicitud.provincia}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(solicitud.fechaSolicitud)}
              </span>
            </div>
          </div>
          <EstadoBadge estado={solicitud.estado} />
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        {(solicitud.estado === 'PROCESANDO' || solicitud.estado === 'PENDIENTE_REVISION') && (
          <ProgressSteps steps={getSteps()} progress={solicitud.progreso} />
        )}
        
        {solicitud.estado === 'APROBADA' && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
            <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
              <Download className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-success">Temario disponible</p>
              <p className="text-xs text-muted-foreground">Tu temario está listo para descargar</p>
            </div>
          </div>
        )}

        {solicitud.estado === 'SOLICITADA' && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
            <p className="text-sm text-muted-foreground">
              Tu solicitud ha sido recibida. Comenzaremos a procesarla pronto.
            </p>
          </div>
        )}

        {solicitud.estado === 'RECHAZADA' && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-muted-foreground">
              Lo sentimos, no pudimos generar el temario para esta oposición.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        {solicitud.estado === 'APROBADA' && (
          <>
            <Button variant="gradient" className="flex-1">
              <Download className="h-4 w-4" />
              Descargar PDF
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/oposiciones/${solicitud.oposicionId}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </>
        )}
        
        {solicitud.estado === 'PROCESANDO' && (
          <Button variant="outline" className="w-full" asChild>
            <Link to={`/oposiciones/${solicitud.oposicionId}`}>
              <Eye className="h-4 w-4 mr-2" />
              Ver Oposición
            </Link>
          </Button>
        )}

        {solicitud.estado === 'RECHAZADA' && (
          <Button variant="outline" className="w-full" asChild>
            <Link to={`/oposiciones/${solicitud.oposicionId}`}>
              Solicitar de nuevo
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
