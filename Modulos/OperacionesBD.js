import { supabase } from "./supabase";
import { ObtenerDatosUsuario, ActualizarContraseña, ActualizarLatLong } from "./InfoUsuario";
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

export async function ModificaUsuario(
  Nombre,
  tipoUsuario,
  codigo,
  contraseña,
  idDepart,
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
    if(contraseña != data.Contraseña) {
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

// Añade horas
export async function añadirHorasSup(
  codigoUsuario,
  inicio,
  fin,
  total,
  Dinicio
) {
  const { data, error } = await supabase.from("Horas").insert([
    {
      Inicio: inicio,
      Final: fin,
      Total: total,
      CodigoUsuario: parseInt(codigoUsuario, 10),
      DateInicio: Dinicio,
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

// Función para obtener todos los estudiantes desde la base de datos
export async function obtenerEstudiantes() {
  const { data, error } = await supabase
    .from("Usuarios")
    .select("*");  // Seleccionamos todos los campos de todos los registros

  if (error) {
    console.error("Error al obtener estudiantes:", error);
    return [];  // En caso de error, retornamos un array vacío
  }

  // Filtrar los estudiantes que tienen un código con exactamente 9 caracteres
  const estudiantesConCodigoValido = data.filter((estudiante) => {
    // Verificar que el código tiene 9 caracteres
    const codigoString = estudiante.Codigo.toString();  // Asegurarse de que es un string
    return codigoString.length === 9;
  });

  console.log("Estudiantes obtenidos (con 9 caracteres en el código):", estudiantesConCodigoValido);  // Verifica los datos filtrados
  return estudiantesConCodigoValido;  // Retorna solo los estudiantes con código de 9 dígitos
}


// Función para actualizar el estado de un estudiante
export async function actualizarEstadoEstudiante(codigo, estado) {
  const { data, error } = await supabase
    .from("Usuarios")
    .update({ Validado: estado }) // Actualizar el campo 'Validado' con el nuevo estado
    .eq("Codigo", parseInt(codigo, 10)); // Filtrar por código del estudiante

  if (error) {
    console.error("Error al actualizar el estado:", error);
    return false;
  }
  return true; // Si todo fue bien, retornar true
}
