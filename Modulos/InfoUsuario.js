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
      Inicio: "null",
    };
    const jsonData = JSON.stringify(data);
    await AsyncStorage.setItem("@UserData", jsonData);
    console.log("Datos guardados correctamente: ", jsonData);
    return codigo

  } catch (error) {
    console.error("Error al guardar los datos: ", error);
  }
};

export const ActualizarInicio = async (valorInicio) => {
  try {
    const jsonData = await AsyncStorage.getItem("@UserData");
    if (jsonData != null) {
      const userData = JSON.parse(jsonData);
      userData.Inicio = valorInicio;
      const updatedJsonData = JSON.stringify(userData);
      await AsyncStorage.setItem("@UserData", updatedJsonData);
      console.log("Valor de Inicio actualizado correctamente");
    } else {
      console.log("No se encontraron datos para actualizar.");
    }
  } catch (error) {
    console.error("Error al actualizar el valor de Inicio: ", error);
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
