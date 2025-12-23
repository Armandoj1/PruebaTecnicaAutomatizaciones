import { Link } from "react-router-dom";
import { Building2, MapPin, Tag, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EstadoBadge } from "@/components/EstadoBadge";
import { Oposicion } from "@/types/oposicion";

interface OposicionCardProps {
  oposicion: Oposicion;
  index?: number;
}

export function OposicionCard({ oposicion, index = 0 }: OposicionCardProps) {
  return (
    <Card 
      className="card-hover relative overflow-hidden border-border/50 bg-card min-w-0"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold leading-tight text-foreground line-clamp-2 min-w-0 flex-1">
            {oposicion.titulo}
          </h3>
          <EstadoBadge estado={oposicion.estado} size="sm" className="shrink-0" />
        </div>
      </CardHeader>
      
      <CardContent className="pb-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4 text-primary" />
          <span>{oposicion.administracion === 'AUTONOMICA' ? 'Autonómica' : oposicion.administracion === 'ESTATAL' ? 'Estatal' : 'Local'}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{oposicion.provincia}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Tag className="h-4 w-4 text-primary" />
          <span>{oposicion.categoria}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4 text-primary" />
          <span>{oposicion.num_plazas || 0} plazas</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button asChild variant="outline" className="w-full">
          <Link to={`/oposiciones/${oposicion.id}`}>
            Ver Detalles
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
