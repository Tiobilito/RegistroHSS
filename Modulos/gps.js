import { Alert } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { ObtenerDatosUsuario } from "./InfoUsuario";
import NetInfo from "@react-native-community/netinfo";

const LOCATION_TASK_NAME = "background-location-task";

export const obtenerUbicacion = async () => {
  try {
    // Solicitar permiso en primer plano
    let { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== "granted") {
      console.log("Permiso de ubicación en primer plano denegado.");
      return null;
    }
    // Solicitar permiso en segundo plano
    let { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== "granted") {
      console.log("Permiso de ubicación en segundo plano denegado.");
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
    timeInterval: 30000, // 30 segundos
  });

  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data }) => {
    if (data) {
      const { locations } = data;
      if (locations.length > 0) {
        const location = locations[0];
        console.log("Ubicación obtenida (Background):", location);
        await activateActivity();
        const isInside = await validation(location);
        if (!isInside) {
          await deactivateActivity();
          console.log("¡Usuario salió del rango! Deteniendo cronómetro...");
          await stopCronometro();
        }
      }
    }
  });
};

export const stopBackgroundLocation = async () => {
  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  await deactivateActivity();
  console.log("Seguimiento de ubicación en segundo plano detenido.");
};

export const activateActivity = async () => {
  const data = await ObtenerDatosUsuario();
  const { isConnected } = await NetInfo.fetch();
  if (isConnected) {
    console.log("Activando Status...");
    try {
      await fetch(`http://10.214.110.80:8000/activity/${data.Codigo}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.log("Error reportando actividad:", error);
    }
  }
};

export const deactivateActivity = async () => {
  const data = await ObtenerDatosUsuario();
  const { isConnected } = await NetInfo.fetch();
  if (isConnected) {
    console.log("Desactivando Status...");
    try {
      await fetch(`http://10.214.110.80:8000/deactivate/${data.Codigo}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.log("Error desactivando usuario:", error);
    }
  }
};
