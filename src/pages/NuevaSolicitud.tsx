import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { useOposiciones } from "@/hooks/useApi";
import { crearSolicitud } from "@/lib/api";
import { ArrowLeft, FileText, Send } from "lucide-react";

export default function NuevaSolicitud() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: oposicionesData, isLoading: loadingOposiciones } = useOposiciones({ soloActivas: true });
  const [oposicionId, setOposicionId] = useState("");
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para crear una solicitud",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!oposicionId) {
      toast({
        title: "Error",
        description: "Debes seleccionar una oposición",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await crearSolicitud({
        usuario_id: user.id,
        oposicion_id: parseInt(oposicionId),
        usuario_email: user.email,
        usuario_nombre: user.nombre,
      });
      
      console.log("Solicitud creada:", result);
      
      toast({
        title: "¡Solicitud creada!",
        description: "Tu solicitud de temario está siendo procesada. Te notificaremos cuando esté lista.",
      });
      
      // Esperar un momento antes de redirigir para que el usuario vea el mensaje
      setTimeout(() => {
        navigate("/mis-temarios");
      }, 1500);
    } catch (error: any) {
      console.error("Error al crear solicitud:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la solicitud. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Acceso Requerido</CardTitle>
              <CardDescription>Debes iniciar sesión para crear una solicitud</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/login")} className="w-full">
                Iniciar Sesión
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const oposiciones = oposicionesData?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Botón Volver */}
          <Button
            variant="ghost"
            onClick={() => navigate("/mis-temarios")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Mis Temarios
          </Button>

          {/* Formulario */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Nueva Solicitud de Temario</CardTitle>
                  <CardDescription>
                    Solicita la relación entre el temario oficial de una oposición y nuestro temario interno
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Seleccionar Oposición */}
                <div className="space-y-2">
                  <Label htmlFor="oposicion">Oposición *</Label>
                  <Select value={oposicionId} onValueChange={setOposicionId} disabled={loadingOposiciones}>
                    <SelectTrigger id="oposicion">
                      <SelectValue placeholder={loadingOposiciones ? "Cargando oposiciones..." : "Selecciona una oposición"} />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingOposiciones ? (
                        <SelectItem value="loading" disabled>Cargando...</SelectItem>
                      ) : oposiciones.length === 0 ? (
                        <SelectItem value="empty" disabled>No hay oposiciones disponibles</SelectItem>
                      ) : (
                        oposiciones.map((op: any) => (
                          <SelectItem key={op.id} value={op.id.toString()}>
                            {op.titulo} - {op.administracion} ({op.provincia})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Elige la oposición para la que necesitas el temario relacionado
                  </p>
                </div>

                {/* Notas Adicionales */}
                <div className="space-y-2">
                  <Label htmlFor="notas">Notas o comentarios (opcional)</Label>
                  <Textarea
                    id="notas"
                    placeholder="Añade cualquier información adicional que consideres relevante..."
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Información */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">¿Qué sucederá después?</h4>
                  <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
                    <li>Tu solicitud será procesada automáticamente por nuestro sistema de IA</li>
                    <li>Se generará una relación entre el temario oficial y nuestro temario interno</li>
                    <li>Un profesor revisará y aprobará la relación generada</li>
                    <li>Recibirás una notificación cuando esté lista para descargar</li>
                  </ul>
                </div>

                {/* Botones */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/mis-temarios")}
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={loading || !oposicionId}
                  >
                    {loading ? (
                      <>Procesando...</>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Crear Solicitud
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
