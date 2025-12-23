import { useState, useMemo, useEffect } from "react";
import { Search, Sparkles, BookOpen, Clock, Users } from "lucide-react";
import { Header } from "@/components/Header";
import { OposicionCard } from "@/components/OposicionCard";
import { SearchFilters, type Filters } from "@/components/SearchFilters";
import { SkeletonCard } from "@/components/SkeletonCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useOposiciones } from "@/hooks/useApi";

const features = [
  {
    icon: Sparkles,
    title: "Mapeo con IA",
    description: "Generamos temarios personalizados usando inteligencia artificial",
  },
  {
    icon: BookOpen,
    title: "Revisado por expertos",
    description: "Profesores especializados validan cada temario",
  },
  {
    icon: Clock,
    title: "Rápido y eficiente",
    description: "Tu temario listo en 24-48 horas",
  },
];

export default function Index() {
  const [filters, setFilters] = useState<Filters>({
    query: "",
    administracion: "",
    provincia: "",
    categoria: "",
    soloActivas: false,
  });

  // Usar la API real en lugar de mock data
  const { data: apiResponse, isLoading, error } = useOposiciones(filters);
  const oposiciones = apiResponse?.data || [];

  const filteredOposiciones = useMemo(() => {
    return oposiciones.filter((op) => {
      // Si no hay query, o el query matchea
      if (filters.query) {
        const query = filters.query.toLowerCase();
        if (
          !op.titulo.toLowerCase().includes(query) &&
          !(op.administracion || '').toLowerCase().includes(query) &&
          !op.provincia.toLowerCase().includes(query) &&
          !op.categoria.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      // Solo filtrar si hay un valor seleccionado (no string vacío)
      if (filters.administracion && filters.administracion !== "" && op.tipo_administracion !== filters.administracion) {
        return false;
      }
      if (filters.provincia && filters.provincia !== "" && filters.provincia !== "todas" && op.provincia !== filters.provincia) {
        return false;
      }
      if (filters.categoria && filters.categoria !== "" && op.categoria !== filters.categoria) {
        return false;
      }
      if (filters.soloActivas && op.estado !== "ACTIVA") {
        return false;
      }
      return true;
    });
  }, [oposiciones, filters]);

  const totalPlazas = oposiciones.reduce((acc, op) => acc + op.numPlazas, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-16 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4 animate-fade-in">
              Encuentra tu{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Oposición Ideal
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
              Más de {totalPlazas.toLocaleString('es-ES')} plazas disponibles en toda España
            </p>

            {/* Search Bar */}
            <div 
              className="relative max-w-2xl mx-auto animate-fade-in" 
              style={{ animationDelay: '200ms' }}
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por título, administración, provincia..."
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                className="w-full h-14 pl-12 pr-32 text-lg rounded-2xl border-2 border-border bg-background focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-soft"
              />
              <Button 
                variant="gradient" 
                size="lg" 
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                Buscar
              </Button>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 animate-fade-in" style={{ animationDelay: '300ms' }}>
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-soft"
              >
                <feature.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{feature.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-10">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <SearchFilters
            filters={filters}
            onFiltersChange={setFilters}
            resultCount={filteredOposiciones.length}
          />

          {/* Results Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Oposiciones disponibles
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{filteredOposiciones.length} resultados</span>
              </div>
            </div>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : error ? (
              <EmptyState
                title="Error al cargar oposiciones"
                description="No se pudieron obtener las oposiciones. Por favor, verifica que el backend esté corriendo."
              />
            ) : filteredOposiciones.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
                {filteredOposiciones.map((op, index) => (
                  <OposicionCard key={op.id} oposicion={op} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No se encontraron oposiciones"
                description="Intenta ajustar los filtros de búsqueda para encontrar más resultados"
                action={{
                  label: "Limpiar filtros",
                  onClick: () =>
                    setFilters({
                      query: "",
                      administracion: "",
                      provincia: "",
                      categoria: "",
                      soloActivas: false,
                    }),
                }}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} OpoBusca. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
