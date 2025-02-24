// Modulos/Operaciones Supabase/ReportesSupa.js
import { supabase } from "./supabase"; // Importa tu instancia de supabase

// Función para obtener los reportes con el nombre del estudiante
export const obtenerReportes = async () => {
  try {
    // Obtener todos los reportes de la tabla 'Reportes'
    const { data: reportes, error: reportesError } = await supabase
      .from('Reportes') // Tabla de reportes
      .select('*');

    if (reportesError) {
      throw reportesError;
    }

    // Ahora obtenemos los nombres de los estudiantes basados en el Codigo
    const reportesConNombres = await Promise.all(
      reportes.map(async (reporte) => {
        // Obtener el usuario relacionado con el CodigoUsuario de la tabla Reportes y Codigo de la tabla Usuarios
        const { data: usuario, error: usuarioError } = await supabase
          .from('Usuarios') // Tabla de usuarios
          .select('Nombre') // Solo seleccionamos el nombre del estudiante
          .eq('Codigo', reporte.CodigoUsuario) // Comparamos el Codigo en la tabla Reportes con Codigo en la tabla Usuarios
          .single(); // Aseguramos que solo se devuelva un usuario

        if (usuarioError) {
          console.error('Error al obtener el usuario:', usuarioError);
          reporte.NombreEstudiante = 'Desconocido'; // Si hay error, asignamos un valor por defecto
        } else {
          reporte.NombreEstudiante = usuario.Nombre; // Asignamos el nombre del estudiante al reporte
        }

        return reporte; // Devolvemos el reporte con el nombre
      })
    );

    return reportesConNombres; // Retornamos los reportes con los nombres
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    return null;
  }
};
