import { Alert } from "react-native";
import * as Location from "expo-location";
import { ObtenerDatosUsuario } from "./InfoUsuario";

export const obtenerUbicacion = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return null;
    }
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    return location;
  } catch (error) {
    console.error("Error obteniendo la localización:", error);
    Alert.alert(
      "Permiso denegado",
      "Para usar la aplicación necesitas darme tu ubicación. ¿Quieres intentarlo de nuevo?",
      [{ text: "Reintentar", onPress: () => obtenerUbicacion() }]
    );
    return null;
  }
};

export const functionGetLocation = async (setLocation) => {
  const location = await obtenerUbicacion();
  console.log(location);
  if (location === null) {
    console.log("Los datos son nulos");
    return false;
  } else {
    console.log("Los datos no son nulos");
    setLocation(location);
    return true;
  }
};

export const validation = async (location) => {
  const data = await ObtenerDatosUsuario();
  const { latitude, longitude } = location.coords;
  const R = 6371; // Radio de la Tierra en kilómetros
  const lat1 = latitude * (Math.PI / 180);
  const lon1 = longitude * (Math.PI / 180);
  const lat2 = parseFloat(data.LatDepartamento) * (Math.PI / 180);
  const lon2 = parseFloat(data.LonDepartamento) * (Math.PI / 180);

  const dLon = lon2 - lon1;
  const dLat = lat2 - lat1;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // Distancia en metros

  if (distance <= 100) {
    console.log("Estás dentro del rango de 100 metros del departamento");
    return true;
  } else {
    console.log("No estás dentro del rango de 100 metros del departamento");
    return false;
  }
};
