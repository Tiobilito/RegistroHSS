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
  const [showIcon, setShowIcon] = useState(new Animated.Value(0)); // Inicializar en 0 para mostrar el ícono "Play"
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

  // Comentar la función que solicita la ubicación
  // const solicitarUbicacion = async () => {
  //   const location = await functionGetLocation(setUbicacion);
  //   if (!location) {
  //     Alert.alert("Permiso necesario", "Debes habilitar la ubicación en segundo plano.", [
  //       { text: "Cancelar", style: "cancel" },
  //       { text: "Abrir Configuración", onPress: () => Linking.openSettings() },
  //     ]);
  //     return null;
  //   }
  //   return location;
  // };

  const iniciarTiempo = async () => {
    // Comentar la validación de ubicación para la prueba
    // const permiso = await solicitarUbicacion();
    // if (!permiso || !ubicacion) return;
    // if (await validation(ubicacion)) {
    const now = new Date();
    setFechaInicio(now);
    ActualizarInicio(now.toISOString());
    setMostrarCrono(true);
    startBackgroundLocation(detenerTiempo);

    // Animación para suavizar la transición al mostrar el ícono "Stop"
    Animated.timing(showIcon, {
      toValue: 1, // Cambiar a 1 para mostrar el ícono "Stop"
      duration: 500, // Duración de la animación
      useNativeDriver: true, // Usar el driver nativo para mejor rendimiento
    }).start();
    // } else {
    //   Alert.alert("Ubicación incorrecta", "No estás dentro del Departamento.");
    // }
  };

  const detenerTiempo = async () => {
    añadirHoras();
    setMostrarCrono(false);
    stopBackgroundLocation();

    // Animación para suavizar la transición al mostrar el ícono "Play"
    Animated.timing(showIcon, {
      toValue: 0, // Cambiar a 0 para mostrar el ícono "Play"
      duration: 500, // Duración de la animación
      useNativeDriver: true, // Usar el driver nativo para mejor rendimiento
    }).start();
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

        {showAll ? (
          <View style={styles.timerContainer}>
            <View style={styles.timerContent}>
              {mostrarCrono ? (
                <Cronometro startDate={fechaInicio} />
              ) : (
                <Text style={styles.timeText}>00:00:00</Text>
              )}

              <Pressable
                style={{
                  ...styles.btnChrono,
                  backgroundColor: mostrarCrono ? "#B22222" : "#2272A7", // Rojo cuando detenido, azul cuando en pausa
                }}
                onPress={mostrarCrono ? detenerTiempo : iniciarTiempo}
              >
                <Animated.View
                  style={{
                    opacity: 1, // Cambiar la opacidad para suavizar la transición
                    transform: [
                      {
                        scale: showIcon.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.2], // Agrandar el ícono ligeramente cuando es "Stop"
                        }),
                      },
                    ],
                  }}
                >
                  <Ionicons
                    name={mostrarCrono ? "stop-circle-outline" : "play-circle-outline"}
                    size={60}
                    color="#fff"
                  />
                </Animated.View>
              </Pressable>
            </View>
          </View>
        ) : (
          <Text style={styles.loadingText}>Cargando...</Text>
        )}
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
    height: "60%",
    borderRadius: 200, // Haciendo el contenedor ovalado
    padding: 60,
    alignItems: "center",
    elevation: 9,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    position: "relative",
    marginTop: -80,
    borderWidth: 3,
    borderColor: "#2272A7", // Bordes azules suaves
  },
  timerContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 70,  // Espacio entre el cronómetro y el botón
    marginTop: 40,  // Ajuste para mover el cronómetro y el botón un poco más abajo
  },
  timeText: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
  },
  btnChrono: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,  // Asegura que el botón sea redondo
    padding: 15,
    borderWidth: 1,
    borderColor: "#1A4F6C",
  },
  loadingText: {
    fontSize: 24,
    color: "#2272A7",
    fontWeight: "bold",
    marginTop: 100,
  },
});
