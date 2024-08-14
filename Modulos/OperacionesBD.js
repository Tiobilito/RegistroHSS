import { supabase } from "./supabase";
import { ObtenerDatosUsuario, ActualizarContraseña } from "./InfoUsuario";
import { Alert } from "react-native";

export async function AñadeUsuario(
  Nombre,
  tipoUsuario,
  codigo,
  contraseña,
  idDepart
) {
  let ChkUser = await checkUser(codigo);
  if (ChkUser) {
    Alert.alert("Ya existe un usuario asociado al codigo");
  } else {
    const { data, error } = await supabase.from("Usuarios").insert([
      {
        Codigo: parseInt(codigo, 10),
        Nombre: Nombre,
        TipoServidor: tipoUsuario,
        Contraseña: contraseña,
        idDepartamento: idDepart,
      },
    ]);
    if (error) {
      console.log("Hubo un error", error);
      return;
    }
  }
}

export async function checkUser(codigo) {
  const { data, error } = await supabase
    .from("Usuarios")
    .select("*")
    .eq("Codigo", codigo);
  if (error) {
    console.log("hubo un error", error);
  }
  if (data.length > 0) {
    return true;
  } else {
    return false;
  }
}

// Cambiar las contraseñas
export async function changePassword(password, code) {
  const { data, error } = await supabase
    .from("Usuarios")
    .update({ Contraseña: password })
    .eq("Codigo", code);
  if (error) {
    console.log("Error al cambiar la contraseña");
  } else {
    ActualizarContraseña(password);
    Alert.alert("Contraseña cambiada");
  }
}

// Añade horas
export async function añadirHorasSup(codigoUsuario, inicio, fin, total) {
  const { data, error } = await supabase.from("Horas").insert([
    {
      Inicio: inicio,
      Final: fin,
      Total: total,
      CodigoUsuario: parseInt(codigoUsuario, 10),
    },
  ]);
  if (error) {
    console.log("Hubo un error", error);
    return 0;
  } else {
    return 1;
  }
}

export async function EliminarUsuarioHoras() {
  const usuarioDatos = await ObtenerDatosUsuario();
  const usuario = usuarioDatos[0];
  const { data: hoursData, error: hoursError } = await supabase
    .from("Horas")
    .delete()
    .eq("CodigoUsuario", parseInt(usuario.Codigo, 10));
  if (hoursError) {
    console.error("Error al borrar las horas asociadas:", hoursError);
    return null;
  } else {
    console.log("Horas asociadas borradas:", hoursData);
  }
  const { data: userData, error: userError } = await supabase
    .from("Usuarios")
    .delete()
    .eq("Codigo", parseInt(usuario.Codigo, 10));

  if (userError) {
    console.error("Error al borrar el usuario:", userError);
    return null;
  } else {
    console.log("Usuario borrado:", userData);
    return userData;
  }
}

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