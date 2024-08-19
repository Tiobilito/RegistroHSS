import { supabase } from "./supabase";
import { ExportarASupaBD, ImportarDeSupaBD } from "./db";
import { GuardarDatosUsuario, ObtenerDatosUsuario } from "./InfoUsuario";
import { Alert } from "react-native";

// Función que envuelve el Alert en una promesa
const alertLoging = () => {
    return new Promise((resolve) => {
      Alert.alert(
        "Confirmación",
        "El usuario es diferente al ya registrado, si se logea el tiempo (si ya inicio) sera cancelado, esta seguro de continuar ? (El nuevo usuario no tendra su tiempo iniciado)",
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
    // Buscar el usuario en la tabla Usuarios
    const { data: usuarios, error: errorUsuario } = await supabase
      .from("Usuarios")
      .select("*")
      .eq("Codigo", parseInt(Codigo, 10))
      .eq("Contraseña", Contraseña);
  
    if (errorUsuario) {
      console.log("Hubo un error: " + errorUsuario);
      return false;
    }
    // Verificar si se encontró algún usuario correspontidente a la informacion optenida del usuario
    if (usuarios.length > 0) {
      const idDepartamento = usuarios[0].idDepartamento;
      // Buscar el departamento correspondiente al usuario
      const { data: departamentos, error: errorDepartamento } = await supabase
        .from("Departamento")
        .select("Latitud, Longitud")
        .eq("id", idDepartamento);
      if (errorDepartamento) {
        console.log(
          "Hubo un error al buscar el departamento: " + errorDepartamento
        );
        return false;
      }
      // Verificar si se encontró algún departamento
      if (departamentos.length > 0) {
        const latitud = departamentos[0].Latitud;
        const longitud = departamentos[0].Longitud;
        // Verificar si hay un usuario registrado localmente el la app o no
        const data = await ObtenerDatosUsuario();
        if (data) {
          // Si el usuario local no coincide con el código, solicitar confirmación y actualizar datos
          if (data.Codigo != Codigo) {
            const result = await alertLoging();
            if (result) {
              await GuardarDatosUsuario(
                Codigo,
                Contraseña,
                latitud.toString(),
                longitud.toString()
              );
              await ImportarDeSupaBD();
              //await ExportarASupaBD();
              return true;
            } else {
              return false;
            }
          } else {
            // Si el usuario local coincide con el código, retornar true
            return true;
          }
        } else {
          // Si no hay usuario local, guardar los datos del usuario actual
          await GuardarDatosUsuario(
            Codigo,
            Contraseña,
            latitud.toString(),
            longitud.toString()
          );
          await ImportarDeSupaBD();
          await ExportarASupaBD();
          return true;
        }
      } else {
        console.log("No se encontró el departamento");
        return false;
      }
    } else {
      console.log("El usuario no existe");
      return false;
    }
  }