import { getCurrentUser } from "@/lib/auth";

export default function UserInfo() {
  const user = getCurrentUser();
  
  return (
    <div className="fixed top-4 right-4 bg-background/95 backdrop-blur border rounded-lg px-4 py-2 shadow-lg z-50 hidden lg:block">
      <div className="text-xs text-muted-foreground">Usuario actual:</div>
      <div className="text-sm font-medium">{user.nombre}</div>
      <div className="text-xs text-muted-foreground">{user.email}</div>
      <div className="text-xs text-primary font-mono">ID: {user.id}</div>
    </div>
  );
}
