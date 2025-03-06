import { supabase } from "./Operaciones Supabase/supabase";
import { BorrarTSemHoras } from "./Base de Datos Sqlite/Semanas";
import {
  ExportarASupaBD,
  ImportarDeSupaBD,
} from "./Base de Datos Sqlite/ImportarRespaldar";
import { GuardarDatosUsuario, ObtenerDatosUsuario } from "./InfoUsuario";
import { Alert } from "react-native";

// Función que envuelve el Alert en una promesa
const alertLoging = () => {
  return new Promise((resolve) => {
    Alert.alert(
      "Confirmación",
      "El usuario es diferente al ya registrado, si se logea el todo lo que no este respaldado se borrará, ¿está seguro de continuar? (El nuevo usuario no tendrá su tiempo iniciado)",
      [
        {
          text: "Cancelar",
          onPress: () => {
            resolve(false);
          },
          style: "cancel",
        },
        {
          text: "Logearse",
          onPress: () => {
            resolve(true);
          },
        },
      ],
      { cancelable: false }
    );
  });
};

export async function EncontrarUsuario(Codigo, Contraseña) {
  // Buscar el usuario en la tabla Usuarios sin filtrar por Validado
  const { data: usuarios, error: errorUsuario } = await supabase
    .from("Usuarios")
    .select("*")
    .eq("Codigo", parseInt(Codigo, 10))
    .eq("Contraseña", Contraseña);

  if (errorUsuario) {
    console.log("Hubo un error: " + errorUsuario);
    return false;
  }

  // Verificar si se encontró algún usuario
  if (usuarios.length > 0) {
    const usuarioEncontrado = usuarios[0];

    // Comprobar si el usuario está validado
    if (!usuarioEncontrado.Validado) {
      console.log("El usuario existe pero no está validado");
      return "not_validated";
    }

    const tipoServidor = usuarioEncontrado.TipoServidor;
    const idDepartamento = usuarioEncontrado.idDepartamento;

    // Buscar el departamento correspondiente al usuario
    const { data: departamentos, error: errorDepartamento } = await supabase
      .from("Departamento")
      .select("Localizaciones")
      .eq("id", idDepartamento);

    if (errorDepartamento) {
      console.log(
        "Hubo un error al buscar el departamento: " + errorDepartamento
      );
      return false;
    }

    if (departamentos.length > 0) {
      const localizaciones = departamentos[0].Localizaciones;

      // Verificar que hay al menos una localización
      if (!localizaciones || localizaciones.length === 0) {
        console.log("El departamento no tiene localizaciones registradas");
        return false;
      }

      // Verificar si hay un usuario registrado localmente en la app o no
      const dataLocal = await ObtenerDatosUsuario();
      if (dataLocal) {
        // Si el usuario local no coincide con el código, solicitar confirmación y actualizar datos
        if (dataLocal.Codigo != Codigo) {
          const result = await alertLoging();
          if (result) {
            await BorrarTSemHoras();
            await GuardarDatosUsuario(
              Codigo,
              Contraseña,
              localizaciones,
              tipoServidor,
              idDepartamento
            );
            await ImportarDeSupaBD();
            return true;
          } else {
            return false;
          }
        } else {
          // Si el usuario local coincide con el código, exportar datos y retornar true
          await ExportarASupaBD();
          return true;
        }
      } else {
        // Si no hay usuario local, guardar los datos del usuario actual
        await GuardarDatosUsuario(
          Codigo,
          Contraseña,
          localizaciones,
          tipoServidor,
          idDepartamento
        );
        await ImportarDeSupaBD();
        return true;
      }
    } else {
      console.log("No se encontró el departamento");
      return false;
    }
  } else {
    console.log("El usuario no existe o las credenciales son incorrectas");
    return false;
  }
}
