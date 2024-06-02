import { supabase } from "./supabase";
import { GuardarDatosUsuario, getGlobalData } from "./InfoUsuario";
import { CommonActions } from "@react-navigation/native";

export async function conexion() {
  const { data, error } = await supabase.from("usuarios2").select("nombre");
  if (error) {
    console.log("Algo salió mal:", error);
    return;
  }
  console.log("Data:", data[0]);
  const user = getGlobalData("user");
  console.log("El usuario es", user);
  console.log("el usuario de la base de dartos es=", data[0].nombre);
  if (data[0].nombre == user) {
    console.log("el usuario si esta ");
  } else {
    console.log("el usaurio no esta");
  }
}

export async function AñadeUsuario(Nombre, tipoUsuario, codigo, contraseña) {
  const { data, error } = await supabase
    .from("Usuarios")
    .insert([
      {
        Codigo: codigo,
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
    .eq("Codigo", Codigo)
    .eq("Contraseña", Contraseña);
  if (error) {
    console.log("hubo un error: " + error);
  }
  if (data.length > 0) {
    GuardarDatosUsuario(Codigo, Contraseña);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Tab" }],
      })
    );
  } else {
    console.log("El usuario no existe");
  }
}
