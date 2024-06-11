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
