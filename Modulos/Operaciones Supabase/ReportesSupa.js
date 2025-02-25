import { supabase } from "./supabase"; 

// Función para obtener los reportes con el nombre del estudiante filtrados por departamento
export const obtenerReportes = async (idDepartamento) => {
  try {
    // Obtener los usuarios que pertenecen al departamento especificado
    const { data: usuarios, error: usuariosError } = await supabase
      .from('Usuarios') // Tabla de usuarios
      .select('Codigo, Nombre') // Obtener solo el Código y el Nombre
      .eq('idDepartamento', idDepartamento); // Filtrar por departamento

    if (usuariosError) {
      throw usuariosError;
    }

    if (!usuarios || usuarios.length === 0) {
      console.log("No se encontraron usuarios en este departamento.");
      return [];
    }

    // Obtener los códigos de usuario en el departamento
    const codigosUsuarios = usuarios.map((usuario) => usuario.Codigo);

    // Obtener los reportes solo de los usuarios en el departamento
    const { data: reportes, error: reportesError } = await supabase
      .from('Reportes') // Tabla de reportes
      .select('*')
      .in('CodigoUsuario', codigosUsuarios); // Filtrar por los códigos de usuario

    if (reportesError) {
      throw reportesError;
    }

    // Mapear los reportes agregando el nombre del estudiante
    const reportesConNombres = reportes.map((reporte) => {
      const usuario = usuarios.find((u) => u.Codigo === reporte.CodigoUsuario);
      return {
        ...reporte,
        NombreEstudiante: usuario ? usuario.Nombre : 'Desconocido',
      };
    });

    return reportesConNombres; // Retornar los reportes con nombres
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    return null;
  }
};
