import { supabase } from "./supabase";
import { GuardarDatosUrls } from "../InfoUsuario";

export async function getUrls() {
  const { data, error } = await supabase
    .from("Urls")
    .select("url")
    .in("id", [1, 2]);

  if (error) {
    console.error("Error al obtener las URLs:", error);
    return null;
  }

  if (data && data.length === 2) {
    const [api, chatbot] = data.map((item) => item.url || "");
    await GuardarDatosUrls(api, chatbot);
  }

  return data;
}
