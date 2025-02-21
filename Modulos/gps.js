import { Alert } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { ObtenerDatosUsuario } from "./InfoUsuario";

const LOCATION_TASK_NAME = "background-location-task";

export const obtenerUbicacion = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permiso de ubicación denegado.");
      return null;
    }
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    console.log("Ubicación obtenida (Foreground):", location);
    return location;
  } catch (error) {
    console.error("Error obteniendo la ubicación:", error);
    return null;
  }
};

export const functionGetLocation = async (setLocation) => {
  const location = await obtenerUbicacion();
  if (!location) return null;
  setLocation(location);
  return location;
};

export const validation = async (location) => {
  const data = await ObtenerDatosUsuario();
  if (!location || !data) return false;

  const { latitude, longitude } = location.coords;
  const lat2 = parseFloat(data.LatDepartamento);
  const lon2 = parseFloat(data.LonDepartamento);
  if (isNaN(lat2) || isNaN(lon2)) return false;

  const R = 6371;
  const dLat = ((lat2 - latitude) * Math.PI) / 180;
  const dLon = ((lon2 - longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((latitude * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000;

  console.log(`Distancia al departamento: ${distance.toFixed(2)}m`);

  return distance <= 100;
};

export const startBackgroundLocation = async (stopCronometro) => {
  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.High,
    distanceInterval: 10,
  });

  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data }) => {
    if (data) {
      const { locations } = data;
      if (locations.length > 0) {
        const location = locations[0];
        console.log("Ubicación obtenida (Background):", location);
        const isInside = await validation(location);
        if (!isInside) {
          console.log("¡Usuario salió del rango! Deteniendo cronómetro...");
          stopCronometro();
        }
      }
    }
  });
};

export const stopBackgroundLocation = async () => {
  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  console.log("Seguimiento de ubicación en segundo plano detenido.");
};
