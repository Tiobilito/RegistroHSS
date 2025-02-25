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
import { AnimatedCircularProgress } from 'react-native-circular-progress'; // Importar CircularProgress
import { obtenerHorasUsuario } from "../Modulos/Base de Datos Sqlite/Horas"; // Asegúrate de importar esta función correctamente
import { sumarTiempos } from "../Modulos/Base de Datos Sqlite/Utilidades"; // Importar la función sumarTiempos para obtener las horas acumuladas

export default function PaginaIngreso() {
  const { width } = useWindowDimensions();
  const [usuario, setUsuario] = useState(null);
  const [mostrarCrono, setMostrarCrono] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [ubicacion, setUbicacion] = useState(null);
  const [showIcon, setShowIcon] = useState(new Animated.Value(0)); // Inicializar en 0 para mostrar el ícono "Play"
  const [showAll, setShowAll] = useState(false); // Estado para controlar si mostrar el contenedor principal o "Cargando..."
  const [totalHorasAcumuladas, setTotalHorasAcumuladas] = useState(0); // Estado para almacenar las horas acumuladas
  const [progress, setProgress] = useState(new Animated.Value(0)); // Usar Animated.Value para el valor de la barra circular
  const totalHoras = 480; // Total de horas para la barra de progreso
  const [actualFill, setActualFill] = useState(0); // Inicializa el fill a 0

  useEffect(() => {
    obtenerUsuario();
    obtenerHorasAcumuladas(); // Obtener las horas acumuladas al cargar la página
  }, []);

  // Función para convertir segundos a formato HH:MM
  const convertirAHorasMinutos = (segundos) => {
    const horas = Math.floor(segundos / 3600); // Obtener las horas completas
    const minutos = Math.floor((segundos % 3600) / 60); // Obtener los minutos restantes
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`; // Formatear a HH:MM
  };

  // Función para obtener las horas acumuladas desde la base de datos
  const obtenerHorasAcumuladas = async () => {
    const horas = await obtenerHorasUsuario(); // Obtener todas las horas
    if (horas && horas.length > 0) {
      const totalHorasSegundos = sumarTiempos(horas.map((hora) => hora.Total)); // Sumar todas las horas
      const totalSegundos = convertirAHorasEnSegundos(totalHorasSegundos); // Convertir a segundos
      setTotalHorasAcumuladas(totalSegundos); // Actualizar el estado con las horas acumuladas en segundos
      animateProgress(totalSegundos); // Animar el progreso
    } else {
      console.log("No se encontraron horas en la base de datos.");
    }
  };

  // Función para animar la barra circular
  const animateProgress = (totalSegundosAcumulados) => {
    const fillPercentage = (totalSegundosAcumulados / (totalHoras * 3600)) * 100; // Dividir por el total de segundos
    Animated.timing(progress, {
      toValue: fillPercentage,  // Animar el progreso
      duration: 1000,  // Duración de la animación
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    // Actualiza el valor de fill a medida que el progreso cambia
    const interval = setInterval(() => {
      setActualFill(progress.__getValue()); // Extrae el valor numérico de la animación
    }, 16); // Actualiza aproximadamente cada frame (60fps)

    return () => clearInterval(interval); // Limpiar intervalo cuando el componente se desmonte
  }, [progress]);

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
      Alert.alert(
        "Permiso necesario",
        "Debes habilitar la ubicación en segundo plano.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Abrir Configuración",
            onPress: () => Linking.openSettings(),
          },
        ]
      );
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

      // Animación para suavizar la transición al mostrar el ícono "Stop"
      Animated.timing(showIcon, {
        toValue: 1, // Cambiar a 1 para mostrar el ícono "Stop"
        duration: 500, // Duración de la animación
        useNativeDriver: true, // Usar el driver nativo para mejor rendimiento
      }).start();
    } else {
      Alert.alert("Ubicación incorrecta", "No estás dentro del Departamento.");
    }
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

      {/* Contenedor del gráfico circular en la parte inferior de la pantalla */}
      <View style={styles.progressContainer}>
        <AnimatedCircularProgress
          size={140}
          width={15}
          fill={actualFill}  // Ahora `actualFill` tiene un valor numérico
          tintColor="#00FF00"  // Color verde fijo para la barra de progreso
          backgroundColor="#e0e0e0"
          rotation={0}  // Rotar el gráfico para que comience desde la parte superior
          style={styles.progressCircle}
        >
          {(fill) => <Text style={styles.progressText}>{`${convertirAHorasMinutos(totalHorasAcumuladas)} / ${totalHoras}`}</Text>}
        </AnimatedCircularProgress>
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
    paddingVertical: 20,
  },
  header: {
    alignItems: "center",
    marginTop: -80,
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
    borderRadius: 200,
    padding: 60,
    alignItems: "center",
    elevation: 9,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    position: "relative",
    marginTop: -230,
    borderWidth: 3,
    borderColor: "#2272A7",
    overflow: 'visible',
  },
  timerContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 70,
    marginTop: 40,
  },
  timeText: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
  },
  btnChrono: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
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
  progressContainer: {
    position: "absolute",
    bottom: 0,
    left: 20,
    width: "100%",
    alignItems: "flex-start",
    paddingBottom: 20,
  },
  progressCircle: {},
  progressText: {
    fontSize: 18,
    color: "black",
  },
});
