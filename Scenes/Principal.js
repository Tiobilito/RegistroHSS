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
  Modal,  // Importar Modal
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';  // Importar AsyncStorage
import { Picker } from "@react-native-picker/picker";
import { añadirHoras } from "../Modulos/Base de Datos Sqlite/Horas";
import { ObtenerDatosUsuario, ActualizarInicio, ActualizarLatLong } from "../Modulos/InfoUsuario";
import { Cronometro } from "../Modulos/Cronometro";
import { functionGetLocation, validation, startBackgroundLocation, stopBackgroundLocation } from "../Modulos/gps";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { obtenerHorasAcumuladas } from "../Modulos/Base de Datos Sqlite/Horas";
import PrivacyModal from '../Modulos/Modales/PrivacyModal'; // Ruta relativa
import robotGif from '../assets/Robot-O-unscreen.gif';
import { ScrollView } from "react-native";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);  // Estado para el modal de privacidad
  const [bubbleModalVisible, setBubbleModalVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      verificarAceptacionPrivacidad();
    }, 500);  //  Esperar 500ms antes de verificar AsyncStorage
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

  useEffect(() => {
    // Mostrar el modal de carga al inicio
    setIsLoading(true);
    
    obtenerUsuario();
    obtenerTotalHoras();
    verificarAceptacionPrivacidad();  // Verificar si el usuario ya aceptó la privacidad
  
    // Una vez que todo haya cargado, oculta el modal
    setIsLoading(false);
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

  const verificarAceptacionPrivacidad = async () => {
    const data = await ObtenerDatosUsuario();
    if (!data || !data.Codigo) return;

    const claveUsuario = `privacyAccepted_${data.Codigo}`;
    const hasAccepted = await AsyncStorage.getItem(claveUsuario);
    console.log('Valor en AsyncStorage:', hasAccepted);
    console.log(`Usuario con código ${data.Codigo} - ¿Aceptó privacidad?`, hasAccepted === 'true');

    if (hasAccepted !== 'true') {
      console.log('No se ha aceptado la privacidad para este usuario, mostrando el modal.');
      setPrivacyModalVisible(true);
    }
  };

  const handleAcceptPrivacy = async () => {
    const data = await ObtenerDatosUsuario();
    if (!data || !data.Codigo) return;

    const claveUsuario = `privacyAccepted_${data.Codigo}`;
    await AsyncStorage.setItem(claveUsuario, 'true');
    setPrivacyModalVisible(false);
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
    setIsLoading(true);
    console.log("isLoading should be true now");

    const permiso = await solicitarUbicacion();
    if (!permiso || !ubicacion) {
      Alert.alert("Ubicación obtenida, presiona de nuevo el boton");
      setIsLoading(false);
      return;
    }

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
      setIsLoading(false);
    } else {
      setIsLoading(false);
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
        <Pressable
          onPress={() => setBubbleModalVisible(true)}
          style={styles.iconButton}
        >
          <Image source={require("../assets/icon.png")} style={styles.icon} />
        </Pressable>
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
                style={[styles.btnChrono, { backgroundColor: mostrarCrono ? "#B22222" : "#2272A7" }]}
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
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

      {/* Usar PrivacyModal en lugar del modal manual */}
      <PrivacyModal
        visible={privacyModalVisible}
        onAccept={handleAcceptPrivacy}  // Aceptar privacidad
      />

      {/* Modal de carga */}
      <Modal transparent={true} animationType="fade" visible={isLoading}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{ marginTop: 10 }}>Cargando...</Text>
          </View>
        </View>
      </Modal>

      <Modal transparent={true} visible={bubbleModalVisible} animationType="fade">
        <View style={styles.bubbleModalOverlay}>
          <View style={styles.bubbleContainer}>
            <ScrollView style={styles.scrollArea} contentContainerStyle={{ alignItems: 'center' }}>
              <Image
                source={robotGif}
                style={[
                  styles.bubbleGif,
                  {
                    width: width * 0.25,
                    height: width * 0.25,
                  },
                ]}
                resizeMode="contain"
              />

              <Text style={styles.bubbleText}>
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                Bienvenido al sistema de registro de horas de servicio social.{"\n\n"}
                </Text>
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                ¿Cómo funciona el cronómetro?{"\n"}
                </Text>
                Este cronómetro te permite llevar un control preciso del tiempo que dedicas a tu servicio social. Cada vez que inicies el cronómetro, se registrará tu tiempo acumulado.{"\n\n"}
                Permiso de ubicación{"\n"}
                Antes de comenzar, se te pedirá permiso para acceder a tu ubicación. Este paso es obligatorio para asegurar que te encuentres en el lugar correcto durante tus prácticas.{"\n"}
                Una vez otorgado el permiso, deberás presionar nuevamente el botón para iniciar el cronómetro.{"\n\n"}
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                Control del tiempo{"\n"}
                </Text>
                Puedes detener el cronómetro en cualquier momento. Todo el tiempo registrado será sumado a tu progreso total.{"\n\n"}
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                Gráfica de progreso{"\n"}
                </Text>
                La gráfica circular a la izquierda se actualiza automáticamente con cada sesión que inicies, mostrando el porcentaje de horas acumuladas respecto al total de 480 horas requeridas.{"\n\n"}
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                Selecciona tu ubicación{"\n"}
                </Text>
                En el picker de la derecha, puedes elegir el edificio o espacio en el que estás realizando tu servicio social o prácticas. Esto ayuda a mantener un registro más detallado.
              </Text>
            </ScrollView>

            <Pressable style={styles.bubbleCloseButton} onPress={() => setBubbleModalVisible(false)}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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
            {(fill) => <Text style={styles.progressText}>{`${isNaN(fill) ? "0.00" : fill.toFixed(2)}%`}</Text>}
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
    fontSize: 32,
    fontWeight: "bold",
    color: "#2272A7",
    letterSpacing: 1,
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
    marginTop: "-76%",
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
    fontSize: 20,
    color: "#444",
    fontWeight: "bold",
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    height: 120,
    width: 120,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 70,
    height: 70,
    resizeMode: "contain", // opcional
  },  
  bubbleModalOverlay: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.3)",
  },
  bubbleContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    width: "90%",
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 8,
  },
  bubbleText: {
    fontSize: 16,
    color: "#333",
    textAlign: "justify",
    lineHeight: 22,
  },
  bubbleCloseButton: {
    backgroundColor: "#2272A7",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignSelf: "center",
  },
  iconButton: {
    position: "absolute",
    top: 10,  // Puedes ajustar según el notch del dispositivo
    left: -80,
    zIndex: 10,
  },
  bubbleGif: {
    width: 120, // Ajusta el tamaño según lo que necesites
    height: 120,
    marginBottom: 15,       // Añadir espacio entre el GIF y el texto
  },
  scrollArea: {
    maxHeight: 500,  // Ajusta según tu preferencia
    width: '100%',
    marginBottom: 20
  },
});
