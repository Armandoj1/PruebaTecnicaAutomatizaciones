import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Building2, MapPin, Calendar, Users, ExternalLink, 
  Bot, CheckCircle2, Loader2, Download, Clock, Award, Shield
} from "lucide-react";
import { Header } from "@/components/Header";
import { EstadoBadge } from "@/components/EstadoBadge";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useOposicion, useCrearSolicitud, useSolicitudesByUsuario } from "@/hooks/useApi";
import { SkeletonCard } from "@/components/SkeletonCard";
import { useAuth } from "@/lib/AuthContext";

export default function OposicionDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Obtener datos de la oposición desde la API
  const { data: oposicionData, isLoading, error } = useOposicion(Number(id));
  const oposicion = oposicionData?.data;

  // Obtener solicitudes del usuario (solo si está autenticado)
  const { data: solicitudesData } = useSolicitudesByUsuario(user?.id || 0);
  const solicitudes = solicitudesData?.data || [];
  
  // Verificar si ya existe solicitud para esta oposición
  const existingSolicitud = solicitudes.find(
    (s: any) => s.oposicion_id === Number(id)
  );

  // Hook para crear solicitud
  const crearSolicitud = useCrearSolicitud();

  const handleRequestTemario = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Debes iniciar sesión",
        description: "Para solicitar un temario debes estar registrado.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    try {
      setRequestStatus('loading');
      console.log('Creando solicitud para:', { usuario_id: user.id, oposicion_id: Number(id) });
      
      const result = await crearSolicitud.mutateAsync({
        usuario_id: user.id,
        oposicion_id: Number(id),
        usuario_email: user.email,
        usuario_nombre: user.nombre
      });
      
      console.log('Solicitud creada:', result);
      setRequestStatus('success');
      toast({
        title: "Solicitud enviada",
        description: "Tu solicitud de temario ha sido registrada. Recibirás una notificación cuando esté listo.",
      });
      setConfirmModalOpen(false);
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      setRequestStatus('error');
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo enviar la solicitud. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No disponible';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const renderTemarioCard = () => {
    if (existingSolicitud?.estado === 'COMPLETADA') {
      return (
        <Card className="border-success/30 bg-success/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <CardTitle className="text-lg">Temario Disponible</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="gradient" size="lg" className="w-full">
              <Download className="h-4 w-4" />
              Descargar Temario
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (existingSolicitud?.estado === 'PROCESANDO' || existingSolicitud?.estado === 'GENERANDO') {
      return (
        <Card className="border-info/30 bg-info/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-info/20 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-info animate-spin" />
              </div>
              <CardTitle className="text-lg">En Proceso</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Nuestro equipo está trabajando en tu temario personalizado.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Tiempo estimado: 24-48h</span>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/mis-temarios">Ver estado</Link>
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-primary/30 overflow-hidden">
        <div className="h-1 gradient-primary" />
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <CardTitle className="text-lg">Temario Adaptado con IA</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Obtén el mapeo inteligente entre el temario oficial y nuestro contenido de academia.
          </p>
          
          <div className="space-y-2">
            {[
              { icon: Bot, text: "Generado con IA Gemini Pro" },
              { icon: Award, text: "Revisado por profesores" },
              { icon: Clock, text: "Listo en 24-48h" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-muted-foreground">{item.text}</span>
              </div>
            ))}
          </div>

          <Button 
            variant="gradient" 
            size="lg" 
            className="w-full"
            onClick={() => setConfirmModalOpen(true)}
            disabled={requestStatus === 'loading'}
          >
            {requestStatus === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              "Solicitar Temario"
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-3/4 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error or not found
  if (error || !oposicion) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Oposición no encontrada</h1>
          <Button asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <span>/</span>
            <Link to="/" className="hover:text-foreground transition-colors">Oposiciones</Link>
            <span>/</span>
            <span className="text-foreground">{oposicion.categoria}</span>
          </nav>
        </div>
      </div>

      <main className="container py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Volver a oposiciones
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-start gap-3 mb-4">
            <EstadoBadge estado={oposicion.estado} size="lg" />
            <span className="px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium">
              {oposicion.administracion === 'AUTONOMICA' ? 'Autonómica' : oposicion.administracion === 'ESTATAL' ? 'Estatal' : 'Local'}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {oposicion.titulo}
          </h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {oposicion.provincia}
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              {oposicion.numPlazas || oposicion.num_plazas || 0} plazas
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Cierre: {formatDate(oposicion.fechaCierre)}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed">
                  {oposicion.descripcion}
                </p>
                
                {oposicion.enlaceBasesOficiales && (
                  <Button variant="outline" className="mt-4" asChild>
                    <a href={oposicion.enlaceBasesOficiales} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Ver bases oficiales
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="requisitos" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
                <TabsTrigger value="temario">Temario Oficial</TabsTrigger>
                <TabsTrigger value="proceso">Proceso Selectivo</TabsTrigger>
              </TabsList>
              
              <TabsContent value="requisitos" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {oposicion.requisitos && oposicion.requisitos.length > 0 ? (
                        oposicion.requisitos.map((req: string, i: number) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{req}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No hay requisitos especificados</p>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="temario" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {oposicion.temarioOficial && oposicion.temarioOficial.length > 0 ? (
                        oposicion.temarioOficial.map((tema: string, i: number) => (
                          <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                              {i + 1}
                            </span>
                            <span className="text-muted-foreground">{tema.replace(/^Tema \d+: /, '')}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-muted-foreground">Temario oficial no disponible. Solicita el mapeo para obtener más información.</p>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="proceso" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {oposicion.procesoSelectivo && oposicion.procesoSelectivo.length > 0 ? (
                        oposicion.procesoSelectivo.map((paso: string, i: number) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                              {i + 1}
                            </span>
                            <span className="text-muted-foreground">{paso}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-muted-foreground">Información del proceso selectivo no disponible</p>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {renderTemarioCard()}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">¿Por qué solicitar?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: Bot, text: "Mapeo inteligente con IA" },
                  { icon: Award, text: "Revisado por profesores expertos" },
                  { icon: Clock, text: "Ahorra tiempo de estudio" },
                  { icon: Shield, text: "100% personalizado" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Mobile Floating Button */}
      {!existingSolicitud && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border">
          <Button 
            variant="gradient" 
            size="xl" 
            className="w-full"
            onClick={() => setConfirmModalOpen(true)}
          >
            <Bot className="h-5 w-5" />
            Solicitar Temario
          </Button>
        </div>
      )}

      <ConfirmModal
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        title="Solicitar Temario Personalizado"
        description="¿Deseas solicitar el temario adaptado con IA para esta oposición? Recibirás un mapeo completo entre el temario oficial y nuestro contenido en 24-48 horas."
        confirmLabel="Sí, solicitar temario"
        onConfirm={handleRequestTemario}
      />
    </div>
  );
}
