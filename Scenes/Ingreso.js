import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  Dimensions,
  TextInput,
  Modal,
  ActivityIndicator,
  useWindowDimensions,
  Animated,
  Image,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import { EncontrarUsuario } from "../Modulos/VerificacionUsuario";
import {
  ObtenerDatosUsuario,
  ActualizarContraseña,
} from "../Modulos/InfoUsuario";
import * as LocalAuthentication from "expo-local-authentication";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Crypto from "expo-crypto";

const Scale = Dimensions.get("window").width;

export default function PaginaIngreso({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [Codigo, setCodigo] = useState("");
  const [Contraseña, setContraseña] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Estado de animación para el fondo
  const slideAnim = useRef(new Animated.Value(-height)).current; // Empieza fuera de la pantalla (arriba)
  const backgroundAnim = useRef(new Animated.Value(-height)).current; // Fondo inicia fuera de pantalla

  const checkBiometricSupport = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const data = await ObtenerDatosUsuario();
    if (hasHardware && isEnrolled && data) {
      setBiometricAvailable(true);
    } else {
      setBiometricAvailable(false);
    }
  };

  async function Autentificacion() {
    const result = await LocalAuthentication.authenticateAsync();
    const data = await ObtenerDatosUsuario();
    if (result.success && data) {
      setCodigo(data.Codigo);
      setContraseña(data.Contraseña);
      setIsAuthenticated(true);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      IngresoUsuario();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Codigo, Contraseña, isAuthenticated]);

  useEffect(() => {
    checarUsuario();
    checkBiometricSupport();
  }, []);

  useEffect(() => {
    Animated.timing(backgroundAnim, {
      toValue: 0, // Se desliza a su posición normal
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const IngresoUsuario = async () => {
    setIsLoading(true);
    try {
      const data = await ObtenerDatosUsuario();
      // Hash de la contraseña ingresada por el usuario
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Contraseña
      );
      // Compara los hashes
      const result = await EncontrarUsuario(Codigo, hashedPassword);
      
      if (result === true) {
        const data = await ObtenerDatosUsuario();
        if (data.Contraseña !== Contraseña) {
          await ActualizarContraseña(Contraseña);
        }
        if (
          data.TipoServidor &&
          data.TipoServidor.toLowerCase() === "supervisor"
        ) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Supervisor" }],
            })
          );
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Tab" }],
            })
          );
        }
      } else if (result === "not_validated") {
        setErrorMessage("El usuario no está validado.");
        setErrorModalVisible(true);
      } else {
        setErrorMessage("Datos incorrectos.");
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);
      setErrorMessage("Ocurrió un error, inténtalo de nuevo.");
      setErrorModalVisible(true);
    } finally {
      // Se asegura de desactivar el modal en cualquier caso
      setIsLoading(false);
    }
  };

  const checarUsuario = async () => {
    const data = await ObtenerDatosUsuario();
    if (data) {
      setCodigo(data.Codigo);
    }
  };

  const image = require("../assets/Back.png");
  const icon = require("../assets/icon.png");

  return (
    <Animated.View style={{ flex: 1 }}>
    {/* Fondo blanco detrás del ImageBackground */}
    <View style={styles.whiteBackground} />

    {/* Fondo animado del ImageBackground */}
    <Animated.View
      style={{
        flex: 1,
        transform: [{ translateY: backgroundAnim }],
      }}
    >
    <ImageBackground source={image} style={styles.imgBackground}>
      <View style={{ height: height * 0.05 }} />
      <View
        style={[
          styles.formContainer,
          { width: width * 0.8, marginTop: height * 0.05 },
        ]}
      >
        <View style={styles.titleContainer}>
          {/* Icono encima del título */}
          <Image source={icon} style={styles.iconImage} />
          <Text style={[styles.title]}>
            Ingresa
          </Text>
        </View>
        <View style={{ height: height * 0.6 }}>
          <Text style={[styles.subtitle]}>
            Código
          </Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setCodigo(text)}
            keyboardType="numeric"
            value={Codigo}
            placeholder="Ingrese su codigo"
            placeholderTextColor="gray"
          />
          </View>
          <Text style={[styles.subtitle]}>
            Contraseña
          </Text>
          <View style={styles.inputContainer}>
            <Ionicons name="key-outline" size={20} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setContraseña(text)}
            value={Contraseña}
            secureTextEntry={true}
            placeholder="Ingrese su contraseña"
            placeholderTextColor="gray"
          />
          </View>
          <View style={styles.btnContainer}>
            <View
              style={{
                height: height * 0.08,
                width: width * 0.65,
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Pressable
                style={[
                  styles.btnIngresar,
                  {
                    width: width * 0.25,
                    height: height * 0.06,
                    marginTop: height * 0.02,
                  },
                ]}
                onPress={() => {
                  if (Codigo !== "" && Contraseña !== "") {
                    IngresoUsuario();
                  } else {
                    setErrorMessage("Por favor completa los 2 campos");
                    setErrorModalVisible(true);
                  }
                }}
              >
                <Text style={styles.txtBtn}>Ingresar</Text>
              </Pressable>

              {biometricAvailable ? (
                <Pressable
                  style={[
                    {
                      backgroundColor: "#57A9D9",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 9999,
                    },
                    {
                      width: width * 0.2,
                      height: height * 0.06,
                      marginTop: height * 0.02,
                    },
                  ]}
                  onPress={() => Autentificacion()}
                >
                  <Ionicons
                    name="finger-print"
                    size={width * 0.1}
                    color="black"
                  />
                </Pressable>
              ) : null}
            </View>

            <View style={styles.separator}>
              <View style={[styles.line, { width: width * 0.3 }]} />
              <Text>Ó</Text>
              <View style={[styles.line, { width: width * 0.3 }]} />
            </View>
            <Text
              style={[styles.subtitle, { fontSize: width > 400 ? 18 : 14 }]}
            >
              Si no estás registrado
            </Text>

            <Pressable
              style={[
                styles.btnRegistro,
                {
                  width: width * 0.7,
                  height: height * 0.06,
                  marginTop: height * 0.02,
                },
              ]}
              onPress={() => navigation.navigate("Registro")}
            >
              <Text style={styles.txtBtn}>Registro</Text>
            </Pressable>

            <Pressable
              style={[
                styles.btnChangePass,
                {
                  width: width * 0.7,
                  height: height * 0.06,
                  marginTop: height * 0.02,
                },
              ]}
              onPress={() => navigation.navigate("changepassword")}
            >
              <Text style={styles.txtBtn}>Recuperar contraseña</Text>
            </Pressable>
          </View>
        </View>
      </View>
      </ImageBackground>
    </Animated.View>

      {/* Modal de carga */}
      <Modal transparent={true} animationType="fade" visible={isLoading}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{ marginTop: 10 }}>Cargando...</Text>
          </View>
        </View>
      </Modal>

      {/* Modal de error */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={errorModalVisible}
      >
        <View style={styles.modalBackground}>
          <View style={styles.errorModalWrapper}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Pressable
              style={styles.errorButton}
              onPress={() => setErrorModalVisible(false)}
            >
              <Text style={styles.errorButtonText}>Aceptar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: Scale*0.08,
    fontWeight: "bold",
    color: "black",
  },
  subtitle: {
    fontSize: Scale > 400 ? 18 : 14,
    marginLeft: "4%",
    color: "black",
    fontWeight: "bold",
  },
  txtBtn: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16, 
  },
  animatedContainer: {
    flex: 1,
  },
  imgBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "cover",
  },
  formContainer: {
    width: "80%",
    justifyContent: "center",
    marginTop: "5%",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: "10%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C5E0F2",
    borderRadius: 50,
    elevation: 15,
    shadowColor: "#333333",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    paddingHorizontal: 10,
    margin: 12,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 10,
    backgroundColor: "transparent",
  },
  btnContainer: {
    alignItems: "center",
    marginTop: "4%",
  },
  btnIngresar: {
    backgroundColor: "#2272A7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    elevation: 15,
    shadowColor: "#333333",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  btnRegistro: {
    backgroundColor: "#2272A7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: "8%",
    elevation: 15,
    shadowColor: "#333333",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  btnChangePass: {
    backgroundColor: "#2272A7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: "8%",
    elevation: 15,
    shadowColor: "#333333",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  separator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: "5%",
    marginBottom: "5%",
  },
  line: {
    height: 1,
    backgroundColor: "black",
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
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
  errorModalWrapper: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  errorButton: {
    backgroundColor: "#2272A7",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  errorButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  whiteBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white", // Fondo blanco
    zIndex: -1, // Para asegurarse de que esté detrás de todo
  },
  iconImage: {
    width: 100, // Ajusta el tamaño del icono
    height: 100, // Ajusta el tamaño del icono
    marginBottom: 10, // Espaciado debajo del icono
    marginTop: -50, // Ajusta el icono hacia arriba
  },
});
