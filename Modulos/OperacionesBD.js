import { supabase } from "./supabase";
import { GuardarDatosUsuario, ObtenerDatosUsuario } from "./InfoUsuario";
import { Alert } from "react-native";

// Función para formatear la fecha y hora
const formatearFechaHora = (fecha) => {
  const opciones = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  return fecha.toLocaleString("es-ES", opciones).replace(",", " a las");
};

// Función para calcular la diferencia en formato HH:MM:SS
const calcularDiferenciaHoras = (inicio, fin) => {
  const diffMs = fin - inicio;
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffMins = Math.floor((diffMs % 3600000) / 60000);
  const diffSecs = Math.floor((diffMs % 60000) / 1000);
  return `${diffHrs.toString().padStart(2, "0")}:${diffMins
    .toString()
    .padStart(2, "0")}:${diffSecs.toString().padStart(2, "0")}`;
};

export async function AñadeUsuario(Nombre, tipoUsuario, codigo, contraseña, idDepart) {
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

export async function EncontrarUsuario(Codigo, Contraseña) {
  const { data, error } = await supabase
    .from("Usuarios")
    .select("*")
    .eq("Codigo", parseInt(Codigo, 10))
    .eq("Contraseña", Contraseña);
  if (error) {
    console.log("hubo un error: " + error);
  }
  if (data.length > 0) {
    GuardarDatosUsuario(Codigo, Contraseña);
    return true;
  } else {
    console.log("El usuario no existe");
    return false;
  }
}

// Inicia el tiempo
export async function IniciarTiempoUsuario(TiempoInicio, codigo) {
  const { data, error } = await supabase
    .from("Usuarios")
    .update({ Inicio: TiempoInicio })
    .eq("Codigo", parseInt(codigo, 10));
  if (error) {
    console.error("Error al actualizar el registro:", error);
  } else {
    console.log("Tiempo iniciado");
  }
}

export async function checkUser(user) {
  const { data, error } = await supabase
    .from("Usuarios")
    .select("*")
    .eq("Codigo", user);
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
    Alert.alert("Contraseña cambiada");
  }
}

// Obtiene los datos de la base de datos (supabase) retorna toda la informacion del usuario
export async function ObtenerDatosUSB() {
  const usuario = await ObtenerDatosUsuario();
  const { data, error } = await supabase
    .from("Usuarios")
    .select("*")
    .eq("Codigo", parseInt(usuario.Codigo, 10));
  if (error) {
    console.error("Error al obtener los datos del usuario:", error);
    return null;
  } else {
    return data;
  }
}

// Añade horas
export async function añadirHoras(codigoUsuario) {
  const DatosUsuario = await ObtenerDatosUSB();
  const usuarioDatos = DatosUsuario[0];
  const inicio = new Date(usuarioDatos.Inicio);
  const fin = new Date();
  const inicioFormateado = formatearFechaHora(inicio);
  const finFormateado = formatearFechaHora(fin);
  const total = calcularDiferenciaHoras(inicio, fin);
  const { data, error } = await supabase.from("Horas").insert([
    {
      Inicio: inicioFormateado,
      Final: finFormateado,
      Total: total,
      CodigoUsuario: parseInt(codigoUsuario, 10),
    },
  ]);
  if (error) {
    console.log("Hubo un error", error);
    return;
  }
  const { data: DUsuario, error: EUsuario } = await supabase
    .from("Usuarios")
    .update({ Inicio: null })
    .eq("Codigo", parseInt(codigoUsuario, 10));
  if (EUsuario) {
    console.error("Error al actualizar el registro:", EUsuario);
  } else {
    console.log("Registro actualizado:", DUsuario);
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
  const { data, error } = await supabase.from("CentroUniversitario").select("*");
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