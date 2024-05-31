import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ObtenerDatosUsuario = async () => {
  const [Codigo, DefCodigo] = useState(0);
  try {
    const value = await AsyncStorage.getItem("Cod-Usuario");
    if (value !== null) {
      DefCodigo(parseInt(value, 10));
      console.log("Codigo: ", Codigo);
      return Codigo;
    }
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const GuardarDatosUsuario = async (Codigo) => {
  try {
    await AsyncStorage.setItem("Cod-Usuario", Codigo.toString());
  } catch (error) {
    console.log("Error: ", error);
  }
};
