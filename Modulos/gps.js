import { Alert } from "react-native";
import * as Location from "expo-location";

export const obtenerUbicacion = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return null;
    }
    let location = await Location.getCurrentPositionAsync({});
    const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
    });
    return reverseGeocodedAddress;
  } catch (error) {
    console.error("Error obteniendo la localización:", error);
    Alert.alert(
      "Permiso denegado",
      "Para usar la aplicacion necesuitas darme tu ubicacion. ¿Quieres intentarlo de nuevo?",
      [{ text: "Reintentar", onPress: () => obtenerUbicacion() }]
    );
    return null;
  }
};

export const functionGetLocation = async (setLocation) => {
  const location = await obtenerUbicacion();
  console.log(location);
  if (location === null) {
    console.log("los datos son nulos");
    return false;
  } else {
    console.log("los datos no son nulos");
    setLocation(location);
    return true;
  }
};

export const validation = (location) => {
  const localizacion =
    "Blvd. Gral. Marcelino García Barragán 1421, Olímpica, 44840 Guadalajara, Jal., México";
  const localizacionEng =
    "Blvd. Gral. Marcelino García Barragán 1421, Olímpica, 44840 Guadalajara, Jal., Mexico";
  const localizacion2 =
    "Centro Universitario de Ciencias Exactas e Ingenierías";

  if (location[0].formattedAddress) {
    if (
      location[0].formattedAddress == localizacion ||
      location[0].formattedAddress == localizacionEng
    ) {
      console.log("estas dentro de cucei");
      return true;
    } else {
      console.log("no estas dentro de cucei ");
      console.log(location[0].formattedAddress);
      console.log(localizacion);
      return false;
    }
  } else if (location[0].name) {
    if (location[0].name == localizacion2) {
      console.log("Estas dentro de cucei");
      return true;
    } else {
      console.log("no estas dentro de cucei ");
      return false;
    }
  }
};
