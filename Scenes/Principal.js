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
import { Picker } from "@react-native-picker/picker";
import { añadirHoras } from "../Modulos/Base de Datos Sqlite/Horas";
import { ObtenerDatosUsuario, ActualizarInicio, ActualizarLatLong } from "../Modulos/InfoUsuario";
import { Cronometro } from "../Modulos/Cronometro";
import {
  functionGetLocation,
  validation,
  startBackgroundLocation,
  stopBackgroundLocation,
} from "../Modulos/gps";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { obtenerHorasAcumuladas } from "../Modulos/Base de Datos Sqlite/Horas";

export default function PaginaIngreso() {
  const { width } = useWindowDimensions();
  const [mostrarCrono, setMostrarCrono] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [ubicacion, setUbicacion] = useState(null);
  const [showIcon, setShowIcon] = useState(new Animated.Value(0));
  const [showAll, setShowAll] = useState(false);
  const [progress, setProgress] = useState(new Animated.Value(0));
  const totalHoras = 480;
  const [actualFill, setActualFill] = useState(0);
  const [localizaciones, setLocalizaciones] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    obtenerUsuario();
    obtenerTotalHoras();
  }, []);

  const obtenerTotalHoras = async () => {
    const Total = await obtenerHorasAcumuladas();
    animateProgress(Total);
  };

  const animateProgress = (totalSegundosAcumulados) => {
    const fillPercentage = Math.min(
      (totalSegundosAcumulados / (totalHoras * 3600)) * 100,
      100
    );
    Animated.timing(progress, {
      toValue: fillPercentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    progress.addListener(({ value }) => {
      setActualFill(value);
    });
    return () => progress.removeAllListeners();
  }, []);

  const obtenerUsuario = async () => {
    let data = await ObtenerDatosUsuario();
    if (data) {
      if (data.Inicio !== "null") {
        setFechaInicio(new Date(data.Inicio));
        setMostrarCrono(true);
      }
      if (data.Localizaciones) {
        setLocalizaciones(data.Localizaciones);
        
        // Buscar ubicación que coincide con coordenadas almacenadas
        const defaultLocation = data.Localizaciones.find(loc => 
          loc.latitud.toString() === data.LatDepartamento &&
          loc.longitud.toString() === data.LonDepartamento
        ) || data.Localizaciones[0];
        
        setSelectedLocation(defaultLocation);
        ActualizarLatLong(defaultLocation.latitud, defaultLocation.longitud);
      }
    }
    setShowAll(true);
  };

  const handleLocationChange = (itemValue) => {
    const loc = localizaciones.find((l) => l.nombre === itemValue);
    setSelectedLocation(loc);
    ActualizarLatLong(loc.latitud, loc.longitud);
  };

  const solicitarUbicacion = async () => {
    const location = await functionGetLocation(setUbicacion);
    if (!location) {
      Alert.alert(
        "Permiso necesario",
        "Debes habilitar la ubicación en segundo plano.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Abrir Configuración", onPress: () => Linking.openSettings() },
        ]
      );
    }
    return location;
  };

  const iniciarTiempo = async () => {
    const permiso = await solicitarUbicacion();
    if (!permiso || !ubicacion) return;
    
    const data = await ObtenerDatosUsuario();
    if (await validation(ubicacion, data.LatDepartamento, data.LonDepartamento)) {
      const now = new Date();
      setFechaInicio(now);
      ActualizarInicio(now.toISOString());
      setMostrarCrono(true);
      startBackgroundLocation(detenerTiempo);

      Animated.timing(showIcon, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Alert.alert("Ubicación incorrecta", "No estás dentro del área seleccionada.");
    }
  };

  const detenerTiempo = async () => {
    añadirHoras();
    setMostrarCrono(false);
    stopBackgroundLocation();

    Animated.timing(showIcon, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
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
                style={[
                  styles.btnChrono,
                  { backgroundColor: mostrarCrono ? "#B22222" : "#2272A7" }
                ]}
                onPress={mostrarCrono ? detenerTiempo : iniciarTiempo}
              >
                <Animated.View
                  style={{
                    transform: [
                      {
                        scale: showIcon.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.2],
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

      {/* Contenedor inferior */}
      <View style={styles.bottomContainer}>
        <View style={styles.progressContainer}>
          <AnimatedCircularProgress
            size={140}
            width={15}
            fill={actualFill}
            tintColor="#00FF00"
            backgroundColor="#e0e0e0"
            rotation={0}
          >
            {(fill) => <Text style={styles.progressText}>{`${fill.toFixed(2)}%`}</Text>}
          </AnimatedCircularProgress>
        </View>

        {localizaciones.length > 0 && (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedLocation?.nombre}
              onValueChange={handleLocationChange}
              style={styles.picker}
              dropdownIconColor="#2272A7"
              mode="dropdown"
            >
              {localizaciones.map((loc, index) => (
                <Picker.Item
                  key={index}
                  label={loc.nombre}
                  value={loc.nombre}
                  color="#2272A7"
                />
              ))}
            </Picker>
          </View>
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
    overflow: "visible",
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
  bottomContainer: {
    position: "absolute",
    bottom: "1%",
    left: "3%",
    right: "3%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressContainer: {
    backgroundColor: "white",
    borderRadius: 100,
    padding: 10,
    elevation: 5,
  },
  pickerContainer: {
    flex: 1,
    marginLeft: 15,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
    maxWidth: 200,
  },
  picker: {
    height: 50,
    color: "#2272A7",
  },
  progressText: {
    fontSize: 18,
    color: "black",
  },
});