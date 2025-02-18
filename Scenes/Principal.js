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
} from "react-native";
import { añadirHoras } from "../Modulos/db";
import { ObtenerDatosUsuario, ActualizarInicio } from "../Modulos/InfoUsuario";
import { Cronometro } from "../Modulos/Cronometro";
import { functionGetLocation, validation, startBackgroundLocation, stopBackgroundLocation } from "../Modulos/gps";

export default function PaginaIngreso() {
  const { width, height } = useWindowDimensions();
  const scaleFactor = width / 375;

  // Definir dimensiones para el botón oval
  const buttonWidth = 100 * scaleFactor; // Ajusta este valor
  const buttonHeight = 60 * scaleFactor; // Ajusta este valor
  const iconSize = buttonHeight * 0.8; // El ícono ocupará el 80% de la altura del botón

  const [usuario, DefUsuario] = useState(null);
  const [MostrarCr, DefMostrarCr] = useState(false);
  const [FechaInicio, DefFechaInicio] = useState(new Date());
  const [Ubicacion, DefUbicacion] = useState(null);

  useEffect(() => {
    tomarUsuario();
  }, []);

  const tomarUsuario = async () => {
    let data = await ObtenerDatosUsuario();
    if (data) {
      DefUsuario(data);
      if (data.Inicio !== "null") {
        DefFechaInicio(new Date(data.Inicio));
        DefMostrarCr(true);
      }
    }
  };

  const solicitarUbicacion = async () => {
    const permiso = await functionGetLocation(DefUbicacion);
    if (!permiso) {
      Alert.alert(
        "Permiso necesario",
        "Debes habilitar la ubicación.",
        [{ text: "Abrir Configuración", onPress: () => Linking.openSettings() }]
      );
      return false;
    }
    return true;
  };

  const iniciarTiempo = async () => {
    const permisoConcedido = await solicitarUbicacion();
    if (!permisoConcedido) return;

    if (await validation(Ubicacion)) {
      const now = new Date();
      DefFechaInicio(now);
      ActualizarInicio(now.toISOString());
      DefMostrarCr(true);

      // Iniciar seguimiento en background
      startBackgroundLocation(detenerTiempo);
    } else {
      Alert.alert("Ubicación incorrecta", "No estás dentro del Departamento.");
    }
  };

  const detenerTiempo = async () => {
    añadirHoras();
    DefMostrarCr(false);
    stopBackgroundLocation(); // Detener la ubicación en background
  };

  return (
    <ImageBackground source={require("../assets/fondo.webp")} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Registro de horas</Text>
      </View>
      <View style={styles.timerContainer}>
        {MostrarCr ? (
          <View style={styles.timerContent}>
            <Cronometro startDate={FechaInicio} />
            <Pressable style={styles.btnChrono} onPress={detenerTiempo}>
              <Text style={styles.btnText}>Detener tiempo</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.timerContent}>
            <Text style={styles.timeText}>00:00:00</Text>
            <Pressable style={styles.btnChrono} onPress={iniciarTiempo}>
              <Text style={styles.btnText}>Iniciar tiempo</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  header: { marginTop: "24%", marginBottom: "12%", height: "10%", width: "90%", gap: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "black" },
  subtitle: { fontSize: 24, fontWeight: "regular", color: "black" },
  timerContainer: { backgroundColor: "#ffffff", width: "90%", height: "50%", borderRadius: 200 },
  timerContent: { alignItems: "center", height: "100%", justifyContent: "flex-end", gap: 60 },
  timeText: { fontSize: 48, fontWeight: "bold" },
  btnChrono: {
    backgroundColor: "#2272A7",
    height: "16%",
    width: "32%",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    marginBottom: "8%",
    borderRadius: 10,
  },
  btnText: { color: "#ffffff", fontWeight: "bold" },
});
