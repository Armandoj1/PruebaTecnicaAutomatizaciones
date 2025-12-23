// Estructura del Temario Interno de la Academia
// Basado en la carpeta "Temario para Imprenta EELL"

export interface TemaInterno {
  numero: number;
  titulo: string;
  archivo: string;
  bloque: string;
}

export const temariosInternos = {
  // ==========================================
  // TEMARIO ENTIDADES LOCALES (EELL)
  // ==========================================
  entidadesLocales: {
    id: 1,
    titulo: "Temario Completo Entidades Locales",
    categoria: "Administración",
    especialidad: "Entidades Locales",
    bloques: [
      {
        id: 1,
        nombre: "Bloque I - Derecho Constitucional",
        temas: [
          { numero: 1, titulo: "La Constitución Española de 1978", archivo: "1. Bloque I y Bloque II/2. Bloque 1_Tema 1.pdf" },
          { numero: 2, titulo: "Derechos y deberes fundamentales", archivo: "1. Bloque I y Bloque II/2. Bloque 1_Tema 2.pdf" },
          { numero: 3, titulo: "Organización territorial del Estado", archivo: "1. Bloque I y Bloque II/3. Bloque 1_Tema 3.pdf" },
        ]
      },
      {
        id: 2,
        nombre: "Bloque II - Organización Local",
        temas: [
          { numero: 4, titulo: "La Administración Local", archivo: "1. Bloque I y Bloque II/5. Bloque 2_Tema 4.pdf" },
          { numero: 5, titulo: "El municipio", archivo: "1. Bloque I y Bloque II/6. Bloque 2_Tema 5.pdf" },
          { numero: 6, titulo: "La provincia", archivo: "1. Bloque I y Bloque II/7. Bloque 2_Tema 6.pdf" },
          { numero: 7, titulo: "Organización municipal", archivo: "1. Bloque I y Bloque II/8. Bloque 2_Tema 7.pdf" },
          { numero: 8, titulo: "Competencias municipales", archivo: "1. Bloque I y Bloque II/9. Bloque 2_Tema 8.pdf" },
          { numero: 9, titulo: "Funcionamiento de los órganos colegiados", archivo: "1. Bloque I y Bloque II/10. Bloque 2_Tema 9.pdf" },
          { numero: 10, titulo: "Régimen de sesiones", archivo: "1. Bloque I y Bloque II/11. Bloque 2_Tema 10.pdf" },
          { numero: 11, titulo: "Los actos administrativos", archivo: "1. Bloque I y Bloque II/12. Bloque 2_Tema 11.pdf" },
          { numero: 12, titulo: "El procedimiento administrativo común", archivo: "1. Bloque I y Bloque II/13. Bloque 2_Tema 12.pdf" },
          { numero: 13, titulo: "Fases del procedimiento", archivo: "1. Bloque I y Bloque II/Bloque 2_Tema 13.pdf" },
          { numero: 14, titulo: "Revisión de actos administrativos", archivo: "1. Bloque I y Bloque II/Bloque 2_Tema 14.pdf" },
        ]
      },
      {
        id: 3,
        nombre: "Bloque III - Régimen Jurídico",
        temas: [
          { numero: 15, titulo: "La potestad reglamentaria - Parte 1", archivo: "2. Bloque III y Bloque IV.1/2. Bloque 3_Tema 15.1.pdf" },
          { numero: 15, titulo: "La potestad reglamentaria - Parte 2", archivo: "2. Bloque III y Bloque IV.1/3. Bloque 3_Tema 15.2.pdf" },
          { numero: 16, titulo: "Las ordenanzas y reglamentos locales", archivo: "2. Bloque III y Bloque IV.1/4. Bloque 3_Tema 16.pdf" },
          { numero: 17, titulo: "Los bienes de las entidades locales", archivo: "2. Bloque III y Bloque IV.1/5. Bloque 3_Tema 17.pdf" },
        ]
      },
      {
        id: 4,
        nombre: "Bloque IV - Régimen Económico y Presupuestario",
        subsecciones: [
          {
            nombre: "IV.1 - Haciendas Locales",
            temas: [
              { numero: 18, titulo: "Las Haciendas Locales", archivo: "2. Bloque III y Bloque IV.1/7. Bloque 4_Tema 18.pdf" },
              { numero: 19, titulo: "Los ingresos de las entidades locales", archivo: "2. Bloque III y Bloque IV.1/8. Bloque 4_Tema 19.pdf" },
              { numero: 20, titulo: "Los tributos locales", archivo: "2. Bloque III y Bloque IV.1/9. Bloque 4_Tema 20.pdf" },
              { numero: 21, titulo: "Impuestos municipales", archivo: "2. Bloque III y Bloque IV.1/10. Bloque 4_Tema 21.pdf" },
              { numero: 22, titulo: "Tasas y contribuciones especiales", archivo: "2. Bloque III y Bloque IV.1/11. Bloque 4_Tema 22.pdf" },
              { numero: 23, titulo: "Los precios públicos", archivo: "2. Bloque III y Bloque IV.1/12. Bloque 4_Tema 23.pdf" },
              { numero: 24, titulo: "Subvenciones", archivo: "2. Bloque III y Bloque IV.1/13. Bloque 4_Tema 24.pdf" },
              { numero: 25, titulo: "Los créditos no presupuestarios", archivo: "2. Bloque III y Bloque IV.1/14. Bloque 4_Tema 25.pdf" },
              { numero: 26, titulo: "El endeudamiento local", archivo: "2. Bloque III y Bloque IV.1/Bloque 4_Tema 26.pdf" },
            ]
          },
          {
            nombre: "IV.2 - Presupuestos",
            temas: [
              { numero: 27, titulo: "El Presupuesto General de las Entidades Locales", archivo: "3. Bloque IV.2/1. Bloque 4_Tema 27.pdf" },
              { numero: 28, titulo: "La elaboración del presupuesto", archivo: "3. Bloque IV.2/2. Bloque 4_Tema 28.pdf" },
              { numero: 29, titulo: "La ejecución del presupuesto", archivo: "3. Bloque IV.2/3. Bloque 4_Tema 29.pdf" },
              { numero: 30, titulo: "Modificaciones presupuestarias", archivo: "3. Bloque IV.2/4. Bloque 4_Tema 30.pdf" },
              { numero: 31, titulo: "La liquidación del presupuesto", archivo: "3. Bloque IV.2/5. Bloque 4_Tema 31.pdf" },
            ]
          },
          {
            nombre: "IV.3 - Contabilidad",
            temas: [
              { numero: 32, titulo: "Contabilidad pública local", archivo: "4. Bloque IV.3, Bloque V y Bloque VI.1/1. Bloque 4_Tema 32.pdf" },
              { numero: 33, titulo: "Plan General de Contabilidad Pública", archivo: "4. Bloque IV.3, Bloque V y Bloque VI.1/2. Bloque 4_Tema 33.pdf" },
            ]
          }
        ]
      },
      {
        id: 5,
        nombre: "Bloque V - Función Pública Local",
        temas: [
          { numero: 34, titulo: "La función pública local", archivo: "4. Bloque IV.3, Bloque V y Bloque VI.1/4. Bloque 5_Tema 34.pdf" },
          { numero: 35, titulo: "Clases de personal al servicio de las entidades locales", archivo: "4. Bloque IV.3, Bloque V y Bloque VI.1/5. Bloque 5_Tema 35.pdf" },
          { numero: 36, titulo: "Derechos de los empleados públicos", archivo: "4. Bloque IV.3, Bloque V y Bloque VI.1/6. Bloque 5_Tema 36.pdf" },
          { numero: 37, titulo: "Deberes de los empleados públicos", archivo: "4. Bloque IV.3, Bloque V y Bloque VI.1/7. Bloque 5_Tema 37.pdf" },
          { numero: 38, titulo: "El régimen disciplinario", archivo: "4. Bloque IV.3, Bloque V y Bloque VI.1/8. Bloque 5_Tema 38.pdf" },
          { numero: 38, titulo: "El régimen disciplinario - Extra", archivo: "4. Bloque IV.3, Bloque V y Bloque VI.1/9. Bloque 5_Tema 38 extra.pdf" },
          { numero: 39, titulo: "Adquisición y pérdida de la condición de funcionario", archivo: "4. Bloque IV.3, Bloque V y Bloque VI.1/10. Bloque 5_Tema 39.pdf" },
          { numero: 39, titulo: "Adquisición y pérdida - Extra", archivo: "4. Bloque IV.3, Bloque V y Bloque VI.1/11. Bloque 5_Tema 39 extra.pdf" },
          { numero: 40, titulo: "Situaciones administrativas", archivo: "4. Bloque IV.3, Bloque V y Bloque VI.1/12. Bloque 5_Tema 40.pdf" },
        ]
      },
      {
        id: 6,
        nombre: "Bloque VI - Contratación y Patrimonio",
        subsecciones: [
          {
            nombre: "VI.1 - Contratos del Sector Público",
            temas: [
              { numero: 41, titulo: "Los contratos del sector público", archivo: "4. Bloque IV.3, Bloque V y Bloque VI.1/14. Bloque 6_Tema 41.pdf" },
              { numero: 42, titulo: "Elementos de los contratos", archivo: "4. Bloque IV.3, Bloque V y Bloque VI.1/15. Bloque 6_Tema 42.pdf" },
              { numero: 43, titulo: "Procedimiento de adjudicación", archivo: "4. Bloque IV.3, Bloque V y Bloque VI.1/16. Bloque 6_Tema 43.pdf" },
              { numero: 44, titulo: "Efectos, cumplimiento y extinción", archivo: "4. Bloque IV.3, Bloque V y Bloque VI.1/17. Bloque 6_Tema 44.pdf" },
              { numero: 45, titulo: "Tipos de contratos - Obras", archivo: "4. Bloque IV.3, Bloque V y Bloque VI.1/18. Bloque 6_Tema 45.pdf" },
              { numero: 46, titulo: "Tipos de contratos - Servicios y Suministros", archivo: "4. Bloque IV.3, Bloque V y Bloque VI.1/19. Bloque 6_Tema 46.pdf" },
            ]
          },
          {
            nombre: "VI.2 - Actividad de Fomento",
            temas: [
              { numero: 47, titulo: "La actividad de fomento", archivo: "5. Bloque VI.2, Bloque VII y Bloque VIII/1. Bloque 6_Tema 47.pdf" },
              { numero: 48, titulo: "Procedimiento de concesión de subvenciones", archivo: "5. Bloque VI.2, Bloque VII y Bloque VIII/2. Bloque 6_Tema 48.pdf" },
              { numero: 49, titulo: "Régimen jurídico de las subvenciones", archivo: "5. Bloque VI.2, Bloque VII y Bloque VIII/3. Bloque 6_Tema 49.pdf" },
              { numero: 50, titulo: "Control de las subvenciones", archivo: "5. Bloque VI.2, Bloque VII y Bloque VIII/4. Bloque 6_Tema 50.pdf" },
            ]
          }
        ]
      },
      {
        id: 7,
        nombre: "Bloque VII - Urbanismo",
        temas: [
          { numero: 51, titulo: "El planeamiento urbanístico", archivo: "5. Bloque VI.2, Bloque VII y Bloque VIII/6. Bloque 7_Tema 51.pdf" },
          { numero: 52, titulo: "Instrumentos de planeamiento", archivo: "5. Bloque VI.2, Bloque VII y Bloque VIII/7. Bloque 7_Tema 52.pdf" },
          { numero: 53, titulo: "Gestión y ejecución urbanística", archivo: "5. Bloque VI.2, Bloque VII y Bloque VIII/8. Bloque 7_Tema 53.pdf" },
        ]
      },
      {
        id: 8,
        nombre: "Bloque VIII - Régimen Local Específico",
        temas: [
          { numero: 54, titulo: "Régimen local de las Comunidades Autónomas - Parte 1", archivo: "5. Bloque VI.2, Bloque VII y Bloque VIII/10. Bloque 8_Tema 54.1.pdf" },
          { numero: 54, titulo: "Régimen local de las Comunidades Autónomas - Parte 2", archivo: "5. Bloque VI.2, Bloque VII y Bloque VIII/11. Bloque 8 _Tema 54.2.pdf" },
        ]
      }
    ],
    totalTemas: 54
  },

  // ==========================================
  // TEMARIO OFIMÁTICA
  // ==========================================
  ofimatica: {
    id: 2,
    titulo: "Temario Ofimática",
    categoria: "Administración",
    especialidad: "Ofimática",
    temas: [
      { numero: 1, titulo: "Introducción a la informática", archivo: "6. Ofimática/Ofimatica -TEMA 1.pdf" },
      { numero: 2, titulo: "Sistema operativo Windows", archivo: "6. Ofimática/Ofimatica -TEMA 2.pdf" },
      { numero: 3, titulo: "Microsoft Word - Procesador de textos", archivo: "6. Ofimática/Ofimatica -TEMA 3.pdf" },
      { numero: 4, titulo: "Microsoft Excel - Hoja de cálculo", archivo: "6. Ofimática/Ofimatica -TEMA 4.pdf" },
      { numero: 5, titulo: "Microsoft PowerPoint - Presentaciones", archivo: "6. Ofimática/Ofimatica -TEMA 5.pdf" },
      { numero: 6, titulo: "Microsoft Access - Bases de datos", archivo: "6. Ofimática/Ofimatica -TEMA 6.pdf" },
      { numero: 7, titulo: "Correo electrónico y comunicaciones", archivo: "6. Ofimática/Ofimatica -TEMA 7.pdf" },
      { numero: 8, titulo: "Internet y navegadores", archivo: "6. Ofimática/Ofimatica -TEMA 8.pdf" },
    ],
    totalTemas: 8
  }
};

// Función helper para obtener todos los temas en formato plano
export function obtenerTodosLosTemas() {
  const temas: TemaInterno[] = [];
  
  // Temario EELL
  temariosInternos.entidadesLocales.bloques.forEach(bloque => {
    if ('subsecciones' in bloque && bloque.subsecciones) {
      bloque.subsecciones.forEach(subseccion => {
        subseccion.temas.forEach(tema => {
          temas.push({
            ...tema,
            bloque: `${bloque.nombre} - ${subseccion.nombre}`
          });
        });
      });
    } else if ('temas' in bloque) {
      bloque.temas.forEach(tema => {
        temas.push({
          ...tema,
          bloque: bloque.nombre
        });
      });
    }
  });

  // Temario Ofimática
  temariosInternos.ofimatica.temas.forEach(tema => {
    temas.push({
      ...tema,
      bloque: 'Ofimática'
    });
  });

  return temas;
}

// Función para buscar temas por palabra clave
export function buscarTemasPorPalabraClave(palabraClave: string): TemaInterno[] {
  const todosLosTemas = obtenerTodosLosTemas();
  const palabraLower = palabraClave.toLowerCase();
  
  return todosLosTemas.filter(tema => 
    tema.titulo.toLowerCase().includes(palabraLower) ||
    tema.bloque.toLowerCase().includes(palabraLower)
  );
}

// Función para obtener la ruta completa del PDF
export function obtenerRutaPDF(archivo: string): string {
  return `/Temario para Imprenta EELL/${archivo}`;
}
