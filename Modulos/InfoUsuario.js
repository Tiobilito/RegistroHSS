import AsyncStorage from "@react-native-async-storage/async-storage";

export const ObtenerDatosUsuario = async () => {
  try {
    const jsonData = await AsyncStorage.getItem("@UserData");
    if (jsonData != null) {
      return JSON.parse(jsonData);
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al obtener los datos: ", error);
    return null;
  }
};

export const GuardarDatosUsuario = async (codigo, contraseña) => {
  try {
    const data = {
      Codigo: codigo.toString(),
      Contraseña: contraseña,
    };
    const jsonData = JSON.stringify(data);
    await AsyncStorage.setItem("@UserData", jsonData);
    console.log("Datos guardados correctamente: ", jsonData);
    return codigo

  } catch (error) {
    console.error("Error al guardar los datos: ", error);
    
  }
};

export const BorrarDatosUsuario = async () => {
  try {
    await AsyncStorage.removeItem("@UserData");
    console.log("Datos borrados correctamente");
  } catch (error) {
    console.error("Error al borrar los datos: ", error);
  }
};
