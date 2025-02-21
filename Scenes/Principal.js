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
import { añadirHoras } from "../Modulos/db";
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
  const { width, height } = useWindowDimensions();
  const scaleFactor = width / 375;

  // Definir dimensiones para el botón oval
  const buttonWidth = 110 * scaleFactor;
  const buttonHeight = 65 * scaleFactor;
  const iconSize = buttonHeight * 0.8;

  const [usuario, DefUsuario] = useState(null);
  const [MostrarCr, DefMostrarCr] = useState(false);
  const [FechaInicio, DefFechaInicio] = useState(new Date());
  const [Ubicacion, DefUbicacion] = useState(null);
  const [showIcon, setShowIcon] = useState(new Animated.Value(0)); // Valor para animación
  const [showAll, setShowAll] = useState(false); // Estado para controlar si mostrar el contenedor principal o "Cargando..."

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
    setShowAll(true); // Cambiar a true después de que los datos han sido cargados
  };

  const solicitarUbicacion = async () => {
    const permiso = await functionGetLocation(DefUbicacion);
    if (!permiso) {
      Alert.alert("Permiso necesario", "Debes habilitar la ubicación.", [
        { text: "Abrir Configuración", onPress: () => Linking.openSettings() },
      ]);
      return false;
    }
    return true;
  };

  const iniciarTiempo = async () => {
    const now = new Date();
    DefFechaInicio(now);
    ActualizarInicio(now.toISOString());
    DefMostrarCr(true);

    // Animación para mostrar el icono de detención
    Animated.timing(showIcon, {
      toValue: 1,
      duration: 500,  // Transición suave en 500ms
      useNativeDriver: true,
    }).start();
  };

  const detenerTiempo = async () => {
    añadirHoras();
    DefMostrarCr(false);
    stopBackgroundLocation();

    // Animación para mostrar el icono de inicio
    Animated.timing(showIcon, {
      toValue: 0,
      duration: 500,  // Transición suave en 500ms
      useNativeDriver: true,
    }).start();
  };

  return (
    <ImageBackground
      source={require("../assets/fondo.webp")}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Registro de horas</Text>
      </View>

      {showAll ? (  // Mostrar el contenedor del cronómetro solo cuando 'showAll' es verdadero
        <View style={styles.timerContainer}>
          {MostrarCr ? (
            <View style={styles.timerContent}>
              <Cronometro startDate={FechaInicio} />
              <Pressable
                style={{
                  ...styles.btnChrono,
                  height: buttonHeight,
                  width: buttonWidth,
                  backgroundColor: "#B22222",  // Fondo rojo oscuro cuando está detenido
                }}
                onPress={detenerTiempo}
              >
                <Animated.View
                  style={{
                    opacity: showIcon,  // Usamos la animación para transición suave
                  }}
                >
                  <Ionicons
                    name="stop-circle-outline"
                    size={iconSize}
                    color="white"  // Ícono blanco para detener el tiempo
                  />
                </Animated.View>
              </Pressable>
            </View>
          ) : (
            <View style={styles.timerContent}>
              <Text style={styles.timeText}>00:00:00</Text>
              <Pressable
                style={{
                  ...styles.btnChrono,
                  height: buttonHeight,
                  width: buttonWidth,
                  backgroundColor: "#2272A7",  // Fondo azul cuando está en pausa
                }}
                onPress={iniciarTiempo}
              >
                <Animated.View
                  style={{
                    opacity: showIcon.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0],
                    }),  // Transición suave entre iconos
                  }}
                >
                  <Ionicons
                    name="play-circle-outline"
                    size={iconSize}
                    color="#fff"  // Blanco para el ícono de iniciar
                  />
                </Animated.View>
              </Pressable>
            </View>
          )}
        </View>
      ) : (
        <Text style={styles.loadingText}>Cargando...</Text>  // Mostrar "Cargando..." si 'showAll' es false
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  header: {
    marginTop: "24%",
    marginBottom: "12%",
    height: "10%",
    width: "90%",
    gap: 16,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "black" },
  subtitle: { fontSize: 24, fontWeight: "regular", color: "black" },
  timerContainer: {
    backgroundColor: "#ffffff",
    width: "90%",
    height: "50%",
    borderRadius: 200,
    borderWidth: 3,
    borderColor: "#2272A7", // Bordes azules suaves en el fondo oval
    justifyContent: "center",
    alignItems: "center",
  },
  timerContent: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",  // Centrado de los elementos
    gap: 50,  // Espacio entre el cronómetro y el botón
    marginTop: 30,  // Ajuste para mover el cronómetro y el botón un poco más abajo
  },
  timeText: { fontSize: 48, fontWeight: "bold" },
  btnChrono: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1A4F6C", // Color del borde suave
  },
  btnText: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    marginBottom: "8%",
    borderRadius: 10,
  },
  loadingText: {  // Estilo para el texto de "Cargando..."
    fontSize: 24,
    color: "#2272A7", 
    fontWeight: "bold",
    marginTop: 100,  // Añadir margen superior para centrarlo
  },
});
