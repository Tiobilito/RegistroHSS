import { supabase } from "./supabase";

// Función para obtener centros universitarios
export async function obtenerCentros() {
  const { data, error } = await supabase
    .from("CentroUniversitario")
    .select("*");
  if (error) {
    console.error("Error al obtener centros universitarios:", error);
    return [];
  }
  return data;
}

// Función para obtener departamentos asociados a un centro universitario
export async function obtenerDepartamentos(idCentroUniversitario) {
  const { data, error } = await supabase
    .from("Departamento")
    .select("*")
    .eq("idCentroUniversitario", idCentroUniversitario);
  if (error) {
    console.error("Error al obtener departamentos:", error);
    return [];
  }
  return data;
}

export async function obtenerDepartamento(idDepartamento) {
  const { data, error } = await supabase
    .from("Departamento")
    .select("*")
    .eq("id", idDepartamento);
  if (error) {
    console.log("Hubo un error:", error);
    return null;
  }
  if (data.length > 0) {
    return data[0];
  } else {
    console.log("No se encontró el departamento con el id proporcionado.");
    return null;
  }
}

export async function obtenerCentro(idCentro) {
  const { data, error } = await supabase
    .from("CentroUniversitario")
    .select("*")
    .eq("id", idCentro);
  if (error) {
    console.log("Hubo un error:", error);
    return null;
  }
  if (data.length > 0) {
    return data[0];
  } else {
    console.log("No se encontró el centro con el id proporcionado.");
    return null;
  }
}

