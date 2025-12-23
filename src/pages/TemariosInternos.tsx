import { useState } from "react";
import { FileText, Download, Search, BookOpen, FolderOpen } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { temariosInternos, obtenerTodosLosTemas, buscarTemasPorPalabraClave, obtenerRutaPDF } from "@/data/temariosInternos";

export default function TemariosInternos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("entidades-locales");

  const temasFiltrados = searchQuery 
    ? buscarTemasPorPalabraClave(searchQuery)
    : obtenerTodosLosTemas();

  const handleDownloadPDF = (archivo: string) => {
    const rutaPDF = obtenerRutaPDF(archivo);
    // En producción, esto abriría el PDF
    window.open(rutaPDF, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="h-12 w-12 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Temarios Internos
              </h1>
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              Accede a todos los temarios de la academia - 62 temas en total
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por tema o palabra clave..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-12 text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="entidades-locales">
              Entidades Locales (54)
            </TabsTrigger>
            <TabsTrigger value="ofimatica">
              Ofimática (8)
            </TabsTrigger>
          </TabsList>

          {/* Temario Entidades Locales */}
          <TabsContent value="entidades-locales" className="mt-6">
            <div className="space-y-6">
              {temariosInternos.entidadesLocales.bloques.map((bloque) => (
                <Card key={bloque.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FolderOpen className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{bloque.nombre}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {'subsecciones' in bloque && bloque.subsecciones ? (
                      // Bloque con subsecciones
                      <div className="space-y-6">
                        {bloque.subsecciones.map((subseccion, idx) => (
                          <div key={idx}>
                            <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                              {subseccion.nombre}
                            </h4>
                            <div className="space-y-2">
                              {subseccion.temas
                                .filter(tema => 
                                  !searchQuery || 
                                  tema.titulo.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((tema, temaIdx) => (
                                  <div
                                    key={temaIdx}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                        {tema.numero}
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm">{tema.titulo}</p>
                                        <p className="text-xs text-muted-foreground">{tema.archivo}</p>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDownloadPDF(tema.archivo)}
                                    >
                                      <FileText className="h-4 w-4 mr-2" />
                                      Ver PDF
                                    </Button>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : 'temas' in bloque ? (
                      // Bloque sin subsecciones
                      <div className="space-y-2">
                        {bloque.temas
                          .filter(tema => 
                            !searchQuery || 
                            tema.titulo.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((tema, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                  {tema.numero}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{tema.titulo}</p>
                                  <p className="text-xs text-muted-foreground">{tema.archivo}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownloadPDF(tema.archivo)}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Ver PDF
                              </Button>
                            </div>
                          ))}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Temario Ofimática */}
          <TabsContent value="ofimatica" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Temario Completo de Ofimática</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {temariosInternos.ofimatica.temas
                    .filter(tema => 
                      !searchQuery || 
                      tema.titulo.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((tema, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                            {tema.numero}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{tema.titulo}</p>
                            <p className="text-xs text-muted-foreground">{tema.archivo}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadPDF(tema.archivo)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Ver PDF
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Resumen */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{temariosInternos.entidadesLocales.totalTemas}</p>
                  <p className="text-sm text-muted-foreground">Temas EELL</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{temariosInternos.ofimatica.totalTemas}</p>
                  <p className="text-sm text-muted-foreground">Temas Ofimática</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Download className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {temariosInternos.entidadesLocales.totalTemas + temariosInternos.ofimatica.totalTemas}
                  </p>
                  <p className="text-sm text-muted-foreground">Total PDFs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
