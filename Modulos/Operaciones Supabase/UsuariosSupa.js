import { supabase } from "./supabase";
import {
  ObtenerDatosUsuario,
  ActualizarContraseña,
  ActualizarLatLong,
} from "../InfoUsuario";
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
    } else {
      Alert.alert(
        "Usuario Registrado Correctamente",
        "Solo puede iniciar sesión después de ser validado por el administrador"
      );
    }
  }
}

export async function ModificaUsuario(
  Nombre,
  tipoUsuario,
  codigo,
  contraseña,
  idDepart
) {
  const { data, error } = await supabase
    .from("Usuarios")
    .update({
      Nombre: Nombre,
      TipoServidor: tipoUsuario,
      Contraseña: contraseña,
      idDepartamento: idDepart,
    })
    .eq("Codigo", parseInt(codigo, 10));
  if (error) {
    console.log("Hubo un error", error);
    return;
  } else {
    const data = await ObtenerDatosUsuario();
    if (contraseña != data.Contraseña) {
      await ActualizarContraseña(contraseña);
    }
    const departamento = await obtenerDepartamento(idDepart);
    await ActualizarLatLong(departamento.Latitud, departamento.Longitud);
    Alert.alert("Usuario actualizado correctamente");
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

export async function ObtenerDatosUsuarioSupa(codigo) {
  const { data, error } = await supabase
    .from("Usuarios")
    .select("*")
    .eq("Codigo", codigo);
  if (error) {
    console.log("Hubo un error:", error);
    return null;
  }
  if (data.length > 0) {
    return data[0];
  } else {
    console.log("No se encontró el usuario con el código proporcionado.");
    return null;
  }
}

// Función para obtener todos los estudiantes desde la base de datos
export async function obtenerPrestadores(idDepartamento) {
  const { data, error } = await supabase
    .from("Usuarios")
    .select("*")
    .eq("idDepartamento", idDepartamento);
  if (error) {
    console.error("Error al obtener los aspirantes:", error);
    return [];
  }
  return data;
}

// Función para actualizar el estado de un prestador de servicio
export async function actualizarEstadoPrestador(codigo, estado) {
  const { data, error } = await supabase
    .from("Usuarios")
    .update({ Validado: estado })
    .eq("Codigo", parseInt(codigo, 10));
  if (error) {
    console.error("Error al actualizar el estado:", error);
    return false;
  }
  return true;
}
