import { supabase } from "./supabase";
import { GuardarDatosUsuario, ObtenerDatosUsuario } from "./InfoUsuario";
import { CommonActions } from "@react-navigation/native";

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

export async function AñadeUsuario(Nombre, tipoUsuario, codigo, contraseña) {
  const { data, error } = await supabase.from("Usuarios").insert([
    {
      Codigo: parseInt(codigo, 10),
      Nombre: Nombre,
      TipoServidor: tipoUsuario,
      Contraseña: contraseña,
    },
  ]);
  if (error) {
    console.log("Hubo un error", error);
    return;
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
    .from("Horas")
    .update({ Inicio: TiempoInicio })
    .eq("Codigo", parseInt(codigo, 10));
  if (error) {
    console.error("Error al actualizar el registro:", error);
    return null;
  } else {
    console.log("Registro actualizado:", data);
    return data;
  }
}

// Añade horas
export async function añadirHoras() {
  const usuario = await ObtenerDatosUsuario();
  const inicio = new Date(usuario.Inicio);
  const fin = new Date();
  const inicioFormateado = formatearFechaHora(inicio);
  const finFormateado = formatearFechaHora(fin);
  const total = calcularDiferenciaHoras(inicio, fin);
  const { data, error } = await supabase.from("Horas").insert([
    {
      Inicio: inicioFormateado,
      Final: finFormateado,
      Total: total,
      CodigoUsuario: parseInt(usuario.Codigo, 10),
    },
  ]);
  if (error) {
    console.log("Hubo un error", error);
    return;
  }
}

export async function EliminarUsuarioHoras() {
  const usuario = await ObtenerDatosUsuario();
  const { data: hoursData, error: hoursError } = await supabase
    .from("horas")
    .delete()
    .eq("CodigoUsuario", parseInt(usuario.Codigo, 10));
  if (error) {
    console.error("Error al borrar las horas asociadas:", hoursError);
    return null;
  } else {
    console.log("Horas asociadas borradas:", hoursData);
  }

  const { data: userData, error: userError } = await supabase
    .from("usuarios")
    .delete()
    .eq("id", parseInt(usuario.Codigo, 10));

  if (userError) {
    console.error("Error al borrar el usuario:", userError);
    return null;
  } else {
    console.log("Usuario borrado:", userData);
    return userData;
  }
}
