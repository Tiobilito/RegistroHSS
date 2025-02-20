import { supabase } from "./supabase";
import {
  ObtenerDatosUsuario,
  ObtenerHorarioUsuario,
  GuardarHorarioUsuario,
} from "../InfoUsuario";
import { Alert } from "react-native";

// Función para respaldar el horario del usuario en la base de datos
export async function RespaldarHorarioUsuario() {
  try {
    const userData = await ObtenerDatosUsuario();
    const horario = await ObtenerHorarioUsuario();
    if (userData && horario) {
      const { data, error } = await supabase
        .from("Usuarios")
        .update({ Horario: horario })
        .eq("Codigo", parseInt(userData.Codigo, 10));
      if (error) {
        console.error("Error al respaldar el horario:", error);
      } else {
        console.log("Horario respaldado correctamente:");
        Alert.alert("Horario respaldado correctamente.");
      }
    } else {
      console.log("No se encontraron datos de usuario o horario.");
    }
  } catch (error) {
    console.error("Error al respaldar el horario:", error);
    Alert.alert("Error al respaldar el horario.");
  }
}

// Función para obtener el horario del usuario desde Supabase
export async function ObtenerHorarioDesdeSupa(Codigo) {
  const { data: usuario, error } = await supabase
    .from("Usuarios")
    .select("Horario")
    .eq("Codigo", parseInt(Codigo, 10))
    .single();

  if (error) {
    console.error("Error al obtener el horario desde Supabase:", error);
    return;
  }

  if (usuario && usuario.Horario) {
    await GuardarHorarioUsuario(usuario.Horario);
    console.log("Horario importado y guardado localmente.");
  } else {
    console.log("No se encontró horario para el usuario.");
  }
}
