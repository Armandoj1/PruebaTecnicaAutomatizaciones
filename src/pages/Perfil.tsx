import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Download,
  Loader2,
  LogOut 
} from "lucide-react";

interface Solicitud {
  id: number;
  estado: string;
  fecha_solicitud: string;
  fecha_completada: string | null;
  oposicion_titulo: string;
  provincia: string;
  categoria: string;
  relacion_id: number | null;
  relacion_estado: string | null;
}

export default function Perfil() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    fetchSolicitudes();
  }, [isAuthenticated, user, navigate]);

  const fetchSolicitudes = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3001/api/solicitudes/usuario/${user.id}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar solicitudes');
      }

      const data = await response.json();
      setSolicitudes(data.data || []);
    } catch (err: any) {
      setError(err.message || "Error al cargar las solicitudes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDescargarMapeo = async (relacionId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/relaciones/${relacionId}/download`);
      
      if (!response.ok) {
        throw new Error('Error al descargar mapeo');
      }

      const data = await response.json();
      
      // Crear y descargar archivo JSON
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mapeo-temario-${relacionId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Error al descargar el mapeo');
    }
  };

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { variant: any; icon: any; text: string }> = {
      'SOLICITADA': { variant: 'secondary', icon: Clock, text: 'Pendiente' },
      'PROCESANDO': { variant: 'default', icon: Loader2, text: 'Procesando' },
      'PENDIENTE_REVISION': { variant: 'default', icon: Clock, text: 'En Revisión' },
      'APROBADA': { variant: 'default', icon: CheckCircle2, text: 'Aprobada' },
      'RECHAZADA': { variant: 'destructive', icon: XCircle, text: 'Rechazada' }
    };

    const config = estados[estado] || estados['SOLICITADA'];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header del Perfil */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.nombre}</h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Sección de Solicitudes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Mis Solicitudes de Temarios</h2>
            <Button onClick={() => navigate("/")} size="sm">
              + Nueva Solicitud
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : solicitudes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No tienes solicitudes aún</p>
                <Button onClick={() => navigate("/")}>
                  Buscar Oposiciones
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {solicitudes.map((solicitud) => (
                <Card key={solicitud.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {solicitud.oposicion_titulo}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <span>{solicitud.provincia}</span>
                          <span>•</span>
                          <span>{solicitud.categoria}</span>
                        </CardDescription>
                      </div>
                      {getEstadoBadge(solicitud.estado)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <strong>Solicitado:</strong> {formatDate(solicitud.fecha_solicitud)}
                        </p>
                        {solicitud.fecha_completada && (
                          <p>
                            <strong>Completado:</strong> {formatDate(solicitud.fecha_completada)}
                          </p>
                        )}
                      </div>

                      {solicitud.relacion_id && solicitud.estado === 'APROBADA' && (
                        <Button
                          onClick={() => handleDescargarMapeo(solicitud.relacion_id!)}
                          size="sm"
                          variant="outline"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Descargar Mapeo
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
