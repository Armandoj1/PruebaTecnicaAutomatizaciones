import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { provincias, categorias, administraciones } from "@/data/mockData";

export interface Filters {
  query: string;
  administracion: string;
  provincia: string;
  categoria: string;
  soloActivas: boolean;
}

interface SearchFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  resultCount: number;
}

export function SearchFilters({ filters, onFiltersChange, resultCount }: SearchFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      query: "",
      administracion: "",
      provincia: "",
      categoria: "",
      soloActivas: false,
    });
  };

  const hasActiveFilters = filters.administracion || filters.provincia || filters.categoria || filters.soloActivas;

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filtros</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Administración */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Administración</Label>
        <div className="space-y-2">
          {administraciones.map((admin) => (
            <div key={admin.value} className="flex items-center space-x-2">
              <Checkbox
                id={`admin-${admin.value}`}
                checked={filters.administracion === admin.value}
                onCheckedChange={(checked) =>
                  updateFilter("administracion", checked ? admin.value : "")
                }
              />
              <label
                htmlFor={`admin-${admin.value}`}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {admin.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Provincia */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Provincia</Label>
        <Select
          value={filters.provincia || "all"}
          onValueChange={(value) => updateFilter("provincia", value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Todas las provincias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {provincias.map((prov) => (
              <SelectItem key={prov} value={prov}>
                {prov}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categoría */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Categoría</Label>
        <div className="space-y-2">
          {categorias.map((cat) => (
            <div key={cat} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${cat}`}
                checked={filters.categoria === cat}
                onCheckedChange={(checked) =>
                  updateFilter("categoria", checked ? cat : "")
                }
              />
              <label
                htmlFor={`cat-${cat}`}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {cat}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Solo activas */}
      <div className="flex items-center space-x-2 pt-2 border-t border-border">
        <Checkbox
          id="soloActivas"
          checked={filters.soloActivas}
          onCheckedChange={(checked) => updateFilter("soloActivas", !!checked)}
        />
        <label
          htmlFor="soloActivas"
          className="text-sm font-medium cursor-pointer"
        >
          Solo oposiciones activas
        </label>
      </div>

      <div className="text-sm text-muted-foreground pt-2">
        {resultCount} resultado{resultCount !== 1 ? 's' : ''} encontrado{resultCount !== 1 ? 's' : ''}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
              {hasActiveFilters && (
                <span className="ml-2 h-5 w-5 rounded-full gradient-primary text-primary-foreground text-xs flex items-center justify-center">
                  !
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px]">
            <SheetHeader>
              <SheetTitle>Filtrar Oposiciones</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
          <FilterContent />
        </div>
      </aside>
    </>
  );
}
