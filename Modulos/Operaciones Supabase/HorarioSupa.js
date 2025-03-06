// HorarioSupa.js
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

// Función para obtener y agrupar los horarios de todos los usuarios desde Supabase
export async function fetchHorarios(idDepartamento) {
  // Se consultan todos los usuarios obteniendo "Nombre" y "Horario"
  const { data, error } = await supabase
    .from("Usuarios")
    .select("Nombre, Horario")
    .eq("idDepartamento", idDepartamento);
  if (error) {
    console.error("Error al obtener usuarios:", error);
    return null;
  }
  // Definimos los días de la semana utilizados en la aplicación
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  // Inicializamos la estructura: para cada día, horas de 7 a 21 con un arreglo vacío
  const aggregatedData = days.reduce((acc, day) => {
    const hoursObj = {};
    for (let hour = 7; hour <= 21; hour++) {
      hoursObj[hour] = [];
    }
    acc[day] = hoursObj;
    return acc;
  }, {});
  // Recorremos cada usuario y agrupamos sus horarios
  data.forEach((usuario) => {
    const { Nombre, Horario } = usuario;
    // Se asume que "Horario" es un objeto con claves: Lunes, Martes, etc.
    for (let day in Horario) {
      if (aggregatedData.hasOwnProperty(day)) {
        Horario[day].forEach((hour) => {
          // Solo se agregan las horas entre 7 y 21
          if (hour >= 7 && hour <= 21) {
            aggregatedData[day][hour].push({ name: Nombre });
          }
        });
      }
    }
  });
  return aggregatedData;
}

export async function ObtenerActivos(idDepartamento) {
  const { data, error } = await supabase
    .from("Usuarios")
    .select("Codigo, Nombre")
    .eq("idDepartamento", idDepartamento)
    .eq("Status", "Activo");
  if (error) {
    console.error("Error al obtener usuarios:", error);
    return null;
  }
  return data;
}
