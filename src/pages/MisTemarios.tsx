import { useState } from "react";
import { FileText, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { SolicitudCard } from "@/components/SolicitudCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { solicitudes } from "@/data/mockData";
import { Link } from "react-router-dom";

type FilterType = 'todas' | 'proceso' | 'aprobadas';

export default function MisTemarios() {
  const [filter, setFilter] = useState<FilterType>('todas');

  const filteredSolicitudes = solicitudes.filter((s) => {
    if (filter === 'proceso') {
      return s.estado === 'PROCESANDO' || s.estado === 'PENDIENTE_REVISION' || s.estado === 'SOLICITADA';
    }
    if (filter === 'aprobadas') {
      return s.estado === 'APROBADA';
    }
    return true;
  });

  const stats = {
    total: solicitudes.length,
    aprobadas: solicitudes.filter((s) => s.estado === 'APROBADA').length,
    enProceso: solicitudes.filter((s) => 
      s.estado === 'PROCESANDO' || s.estado === 'PENDIENTE_REVISION' || s.estado === 'SOLICITADA'
    ).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Mis Solicitudes de Temarios
            </h1>
            <p className="text-muted-foreground">
              Gestiona y descarga tus temarios personalizados
            </p>
          </div>
          <Link to="/nueva-solicitud">
            <Button size="lg">
              <FileText className="mr-2 h-5 w-5" />
              Nueva Solicitud
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total solicitudes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.aprobadas}</p>
                  <p className="text-sm text-muted-foreground">Temarios aprobados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.enProceso}</p>
                  <p className="text-sm text-muted-foreground">En proceso</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)} className="mb-6">
          <TabsList>
            <TabsTrigger value="todas">
              Todas ({solicitudes.length})
            </TabsTrigger>
            <TabsTrigger value="proceso">
              En Proceso ({stats.enProceso})
            </TabsTrigger>
            <TabsTrigger value="aprobadas">
              Aprobadas ({stats.aprobadas})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Solicitudes List */}
        {filteredSolicitudes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSolicitudes.map((solicitud) => (
              <SolicitudCard key={solicitud.id} solicitud={solicitud} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Clock className="h-8 w-8 text-muted-foreground" />}
            title="No hay solicitudes"
            description={
              filter === 'todas'
                ? "Aún no has solicitado ningún temario. Explora las oposiciones disponibles."
                : filter === 'proceso'
                ? "No tienes solicitudes en proceso actualmente."
                : "Aún no tienes temarios aprobados."
            }
            action={
              filter === 'todas'
                ? {
                    label: "Explorar oposiciones",
                    onClick: () => {},
                  }
                : undefined
            }
          />
        )}

        {filteredSolicitudes.length === 0 && filter === 'todas' && (
          <div className="mt-4 text-center">
            <Button variant="gradient" asChild>
              <Link to="/">Explorar Oposiciones</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
