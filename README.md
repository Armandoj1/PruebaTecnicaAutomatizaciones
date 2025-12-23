# Automatización y Mapeo de Temarios con IA

Prueba técnica orientada a automatizar la relación entre temarios oficiales
de oposiciones (SAS, Generalitat, etc.) y un temario interno de una academia,
incluyendo validación humana (Human-in-the-loop) por parte de un profesor.

---

## Descripción general

El sistema permite que un alumno solicite la relación de temarios para una
oposición específica.  
Si la relación no existe, se genera automáticamente mediante IA, pasa por
un proceso de revisión por parte de un profesor y se notifica al alumno
una vez aprobada o rechazada.

---

## Arquitectura de la solución

- **Frontend**: diseño inicial realizado en **Lovable**, utilizado para definir
  la experiencia de usuario y el flujo visual. El proyecto fue exportado y
  ajustado en local para permitir la integración con el backend durante las pruebas.
- **Backend**: entorno local en **Node.js**, utilizado para validar la lógica
  del workflow, las peticiones HTTP y el manejo de estados.
- **Base de datos**: modelo relacional orientado a trazabilidad, control de
  estados, reintentos y auditoría del proceso.

---

## Workflow

El workflow contempla:
- generación automática de la relación de temarios mediante IA
- validación humana por parte del profesor
- control de estados del proceso
- manejo de errores y reintentos
- registro de métricas y eventos del sistema

---

## Documentación

- Documento PDF con capturas del workflow y del esquema de base de datos.
- Video explicativo donde se detallan las decisiones técnicas y los ajustes
  realizados durante la implementación.

Video explicativo:  
https://youtu.be/BrgQ2FIB0qk

Proyecto Visual en Lovable (Uso para el desarrollo del front)
https://id-preview--fc6f0905-77f0-4926-880e-376ca8810bc8.lovable.app/?__lovable_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMGNrNm1JQ3Q4RlNmOWxqMHlsc3VERGdhVE16MiIsInByb2plY3RfaWQiOiJmYzZmMDkwNS03N2YwLTQ5MjYtODgwZS0zNzZjYTg4MTBiYzgiLCJub25jZSI6IjUyMzNkNDFmMDc1ZWM0ODc4OWFjZDllM2VkMTA4MTU2IiwiaXNzIjoibG92YWJsZS1hcGkiLCJzdWIiOiJmYzZmMDkwNS03N2YwLTQ5MjYtODgwZS0zNzZjYTg4MTBiYzgiLCJhdWQiOlsibG92YWJsZS1hcHAiXSwiZXhwIjoxNzY3MTA5OTkzLCJuYmYiOjE3NjY1MDUxOTMsImlhdCI6MTc2NjUwNTE5M30.upF37q1mcRa-i-0OTw29dqnlMPhSSUTiVg8zaYX2XrY

---

## Ejecución local

### Backend

- cd Backend
- npm install
- npm start

### FrontEnd

- npm install 
- npm run dev

