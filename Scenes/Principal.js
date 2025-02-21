import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  Alert,
  Linking,
  useWindowDimensions,
  Animated,
} from "react-native";
import { añadirHoras } from "../Modulos/Base de Datos Sqlite/Horas";
import { ObtenerDatosUsuario, ActualizarInicio } from "../Modulos/InfoUsuario";
import { Cronometro } from "../Modulos/Cronometro";
import {
  functionGetLocation,
  validation,
  startBackgroundLocation,
  stopBackgroundLocation,
} from "../Modulos/gps";
import { Ionicons } from "@expo/vector-icons"; // Importamos Ionicons

export default function PaginaIngreso() {
  const { width } = useWindowDimensions();
  const [usuario, setUsuario] = useState(null);
  const [mostrarCrono, setMostrarCrono] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [ubicacion, setUbicacion] = useState(null);
  const [showIcon, setShowIcon] = useState(new Animated.Value(0)); // Valor para animación
  const [showAll, setShowAll] = useState(false); // Estado para controlar si mostrar el contenedor principal o "Cargando..."

  useEffect(() => {
    obtenerUsuario();
  }, []);

  const obtenerUsuario = async () => {
    let data = await ObtenerDatosUsuario();
    if (data) {
      setUsuario(data);
      if (data.Inicio !== "null") {
        setFechaInicio(new Date(data.Inicio));
        setMostrarCrono(true);
      }
    }
    setShowAll(true); // Cambiar a true después de que los datos han sido cargados
  };

  const solicitarUbicacion = async () => {
    const location = await functionGetLocation(setUbicacion);
    if (!location) {
      Alert.alert("Permiso necesario", "Debes habilitar la ubicación en segundo plano.", [
        { text: "Cancelar", style: "cancel" },
        { text: "Abrir Configuración", onPress: () => Linking.openSettings() },
      ]);
      return null;
    }
    return location;
  };

  const iniciarTiempo = async () => {
    const permiso = await solicitarUbicacion();
    if (!permiso || !ubicacion) return;
    if (await validation(ubicacion)) {
      const now = new Date();
      setFechaInicio(now);
      ActualizarInicio(now.toISOString());
      setMostrarCrono(true);
      startBackgroundLocation(detenerTiempo);
    } else {
      Alert.alert("Ubicación incorrecta", "No estás dentro del Departamento.");
    }
  };

  const detenerTiempo = async () => {
    añadirHoras();
    setMostrarCrono(false);
    stopBackgroundLocation(); 
  };

  return (
    <ImageBackground
      source={require("../assets/fondo.webp")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Registro de horas</Text>
        </View>
        <View style={styles.timerContainer}>
          <View style={styles.timerDisplay}>
            {mostrarCrono ? (
              <Cronometro startDate={fechaInicio} />
            ) : (
              <Text style={styles.timeText}>00:00:00</Text>
            )}
          </View>
          <Pressable
            style={styles.btnChrono}
            onPress={mostrarCrono ? detenerTiempo : iniciarTiempo}
          >
            <Text style={styles.btnText}>
              {mostrarCrono ? "Detener tiempo" : "Iniciar tiempo"}
            </Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 20,
    color: "#555",
  },
  timerContainer: {
    backgroundColor: "#fff",
    width: "90%",
    height: "50%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    position: "relative",
    marginTop: -80,
  },
  timerDisplay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
  },
  btnChrono: {
    backgroundColor: "#2272A7",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
    position: "absolute",
    bottom: 20,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
