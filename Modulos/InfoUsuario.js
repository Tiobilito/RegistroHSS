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

export const GuardarDatosUsuario = async (codigo, contraseña, Dlatitud, Dlongitud) => {
  try {
    const data = {
      Codigo: codigo.toString(),
      Contraseña: contraseña,
      Inicio: "null",
      LatDepartamento: Dlatitud,
      LonDepartamento: Dlongitud
    };
    const jsonData = JSON.stringify(data);
    await AsyncStorage.setItem("@UserData", jsonData);
    console.log("Datos guardados correctamente: ", jsonData);
    return codigo;
  } catch (error) {
    console.error("Error al guardar los datos: ", error);
  }
};

export const ActualizarInicio = async (valorInicio) => {
  try {
    const jsonData = await AsyncStorage.getItem("@UserData");
    console.log("lo que llega a actualizar inicio es", jsonData);
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

export const ActualizarLatLong = async (Lat, Long) => {
  try {
    const jsonData = await AsyncStorage.getItem("@UserData");
    if (jsonData != null) {
      const userData = JSON.parse(jsonData);
      userData.LatDepartamento = Lat;
      userData.LonDepartamento = Long;
      const updatedJsonData = JSON.stringify(userData);
      await AsyncStorage.setItem("@UserData", updatedJsonData);
      console.log("La latitud y la longitud se actualizaron correctamente");
    } else {
      console.log("No se encontraron datos para actualizar.");
    }
  } catch (error) {
    console.error("Error al actualizar la latitud y longitud ", error);
  }
};

export const ActualizarContraseña = async (valorContraseña) => {
  try {
    const jsonData = await AsyncStorage.getItem("@UserData");
    if (jsonData != null) {
      const userData = JSON.parse(jsonData);
      userData.Contraseña = valorContraseña;
      const updatedJsonData = JSON.stringify(userData);
      await AsyncStorage.setItem("@UserData", updatedJsonData);
      console.log("Valor Contraseña se actualizo correctamente");
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

export const GuardarHorarioUsuario = async (horario) => {
  try {
    const jsonData = JSON.stringify(horario);
    await AsyncStorage.setItem("@Horario", jsonData);
    console.log("Horario guardado correctamente");
  } catch (error) {
    console.error("Error al guardar el horario: ", error);
  }
};

export const ObtenerHorarioUsuario = async () => {
  try {
    const jsonData = await AsyncStorage.getItem("@Horario");
    if (jsonData != null) {
      return JSON.parse(jsonData);
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el horario: ", error);
    return null;
  }
};

export const BorrarHorarioUsuario = async () => {
  try {
    await AsyncStorage.removeItem("@Horario");
    console.log("Horario borrado correctamente");
  } catch (error) {
    console.error("Error al borrar el horario: ", error);
  }
};