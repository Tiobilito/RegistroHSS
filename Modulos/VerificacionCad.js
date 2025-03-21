const PalabrasClave = [
  "horario",
  "horas de atención",
  "horario de oficina",
  "disponibilidad",
  "tiempo de servicio",
  "apertura",
  "cierre",
  "información general",
  "descripción",
  "misión",
  "visión",
  "objetivos",
  "historia",
  "propósito",
  "responsables",
  "coordinadores",
  "supervisores",
  "directores",
  "personal",
  "equipo",
  "staff",
  "teléfono",
  "correo electrónico",
  "dirección",
  "ubicación",
  "sitio web",
  "redes sociales",
  "contacto directo",
  "asistencia",
  "apoyo",
  "ayuda",
  "orientación",
  "consulta",
  "asesoría",
  "programas",
  "actividades",
  "documentación",
  "formularios",
  "inscripción",
  "registro",
  "condiciones",
  "criterios",
  "elegibilidad",
  "pasos",
  "proceso",
  "trámites",
  "instrucciones",
  "guía",
  "cómo hacer",
  "protocolo",
  "ventajas",
  "oportunidades",
  "incentivos",
  "recompensas",
  "apoyo financiero",
  "becas",
  "talleres",
  "seminarios",
  "conferencias",
  "reuniones",
  "charlas",
  "actividades especiales",
  "FAQ",
  "dudas comunes",
  "aclaraciones",
  "información adicional",
  "detalles",
  "dirección",
  "mapa",
  "cómo llegar",
  "transporte",
  "accesibilidad",
  "instalaciones",
  "normas",
  "reglas",
  "regulaciones",
  "lineamientos",
  "políticas internas",
  "código de conducta",
  "experiencias",
  "opiniones",
  "comentarios",
  "reseñas",
  "feedback",
  "valoraciones",
  "ayuda técnica",
  "soporte",
  "asistencia técnica",
  "problemas técnicos",
  "solución de problemas",
];

//funcion que evalua una cadena, si la misma contiene alguna palabra clave retorna un true, sino retorna un false
export const ChecCadPalabrasClave = (Cadena) => {
  return PalabrasClave.some((topic) =>
    Cadena.toLowerCase().includes(topic.toLowerCase())
  );
};
