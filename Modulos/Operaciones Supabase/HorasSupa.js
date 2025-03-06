import { supabase } from "./supabase";
import { ObtenerDatosUsuario } from "../InfoUsuario";

// Añade horas
export async function añadirHorasSup(
  codigoUsuario,
  inicio,
  fin,
  total,
  Dinicio,
  Validada
) {
  const { data, error } = await supabase
    .from("Horas")
    .insert([
      {
        Inicio: inicio,
        Final: fin,
        Total: total,
        CodigoUsuario: parseInt(codigoUsuario, 10),
        DateInicio: Dinicio,
        Validada: Validada,
      },
    ])
    .select(); 

  if (error) {
    console.log("Hubo un error", error);
    return null;
  } else {
    return data[0].id; 
  }
}

export async function EliminarUsuarioHoras() {
  const Data = await ObtenerDatosUsuario();
  const { data: hoursData, error: hoursError } = await supabase
    .from("Horas")
    .delete()
    .eq("CodigoUsuario", parseInt(Data.Codigo, 10));
  if (hoursError) {
    console.error("Error al borrar las horas asociadas:", hoursError);
    return null;
  } else {
    console.log("Horas asociadas borradas:", hoursData);
  }
  const { data: userData, error: userError } = await supabase
    .from("Usuarios")
    .delete()
    .eq("Codigo", parseInt(Data.Codigo, 10));

  if (userError) {
    console.error("Error al borrar el usuario:", userError);
    return null;
  } else {
    console.log("Usuario borrado:", userData);
    return userData;
  }
}

// Función para obtener las horas asociadas a un usuario en especifico
export async function obtenerHoras(codigo) {
  const { data, error } = await supabase
    .from("Horas")
    .select("*")
    .eq("CodigoUsuario", parseInt(codigo, 10));
  if (error) {
    console.error("Error al obtener las horas:", error);
    return [];
  }
  return data;
}

// Función para borrar una hora
export async function BorrarHoraSupa(id) {
  const { data, error } = await supabase.from("Horas").delete().eq("id", id);
  if (error) {
    console.error("Error al borrar la hora:", error);
  } else {
    console.log("Hora borrada:", data);
  }
}
