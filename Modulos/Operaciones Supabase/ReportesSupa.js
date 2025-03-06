import { supabase } from "./supabase";

export const insertarReporte = async (reporte) => {
  const { error } = await supabase.from("Reportes").insert([reporte]);
  if (error) {
    console.error("Error al insertar el reporte:", error);
  }
  console.log("Reporte insertado con éxito:");
};

// Las otras funciones (obtenerReportes y eliminarReporte) se mantienen igual.
export const obtenerReportes = async (idDepartamento) => {
  try {
    const { data: usuarios, error: usuariosError } = await supabase
      .from("Usuarios")
      .select("Codigo, Nombre")
      .eq("idDepartamento", idDepartamento);

    if (usuariosError) throw usuariosError;
    if (!usuarios || usuarios.length === 0) {
      console.log("No se encontraron usuarios en este departamento.");
      return [];
    }

    const codigosUsuarios = usuarios.map((usuario) => usuario.Codigo);

    const { data: reportes, error: reportesError } = await supabase
      .from("Reportes")
      .select("*")
      .in("CodigoUsuario", codigosUsuarios);
    if (reportesError) throw reportesError;

    const reportesConNombres = reportes.map((reporte) => {
      const usuario = usuarios.find((u) => u.Codigo === reporte.CodigoUsuario);
      return {
        ...reporte,
        NombreEstudiante: usuario ? usuario.Nombre : "Desconocido",
      };
    });

    return reportesConNombres;
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return null;
  }
};

export const eliminarReporte = async (id) => {
  const { data, error } = await supabase.from("Reportes").delete().eq("id", id);
  if (error) {
    console.error("Error al borrar el reporte: ", error);
  } else {
    console.log("Reporte borrado:", data);
  }
};

export const obtenerReportesPorUsuario = async (codigo) => {
  const { data: reportes, error } = await supabase
    .from("Reportes")
    .select("*")
    .eq("CodigoUsuario", codigo);
  if (error) {
    console.error("Error al obtener los reportes:", error);
    return null;
  } else {
    return reportes;
  }
};