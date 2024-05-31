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

export async function AñadeUsuario(Nombre, tipoUsuario, codigo) {
  const { data, error } = await supabase
    .from("Usuarios")
    .insert([{ Codigo: codigo, Nombre: Nombre, TipoServidor: tipoUsuario }]);
  if (error) {
    console.log("Hubo un error", error);
    return;
  }
  console.log("El usuario se inserto en la tabla exitosamente: ", data);
}

export async function EncontrarUsuario(Nombre, Codigo) {
  const { data, error } = await supabase
    .from("usuarios2")
    .select("*")
    .eq("nombre", Nombre)
    .eq("codigo", Codigo);
  if (error) {
    console.log("hubo un error: " + error);
  }
  if (data.length > 0) {
    console.log("hay datos=", data);
    GuardarDatosUsuario(Codigo);
    //navigation.navigate("Inicio");
    /*navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Tab" }],
      })
    );*/
  } else {
    console.log("El usuario no existe");
  }
}