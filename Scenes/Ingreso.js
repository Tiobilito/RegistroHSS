import React, { useState, useEffect } from "react";
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
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import { EncontrarUsuario } from "../Modulos/VerificacionUsuario";
import {
  ObtenerDatosUsuario,
  ActualizarContraseña,
} from "../Modulos/InfoUsuario";
import * as LocalAuthentication from "expo-local-authentication";
import Ionicons from "@expo/vector-icons/Ionicons";

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

  const IngresoUsuario = async () => {
    setIsLoading(true);
    const result = await EncontrarUsuario(Codigo, Contraseña);
    setIsLoading(false);
    if (result === true) {
      const data = await ObtenerDatosUsuario();
      if (data.Contraseña !== Contraseña) {
        ActualizarContraseña(Contraseña);
      }
      // Si el usuario es supervisor, redirige a la navegación de supervisores; de lo contrario, al tab normal.
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
  };

  const checarUsuario = async () => {
    const data = await ObtenerDatosUsuario();
    if (data) {
      setCodigo(data.Codigo);
    }
  };

  const image = require("../assets/Back.png");

  return (
    <ImageBackground source={image} style={styles.imgBackground}>
      <View style={{ height: height * 0.05 }} />
      <View
        style={[
          styles.formContainer,
          { width: width * 0.8, marginTop: height * 0.05 },
        ]}
      >
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { fontSize: width > 400 ? 24 : 20 }]}>
            Ingresa
          </Text>
        </View>
        <View style={{ height: height * 0.6 }}>
          <Text style={[styles.subtitle, { fontSize: width > 400 ? 18 : 14 }]}>
            Código
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setCodigo(text)}
            keyboardType="numeric"
            value={Codigo}
          />
          <Text style={[styles.subtitle, { fontSize: width > 400 ? 18 : 14 }]}>
            Contraseña
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setContraseña(text)}
            value={Contraseña}
            secureTextEntry={true}
          />

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
                  width: width * 0.3,
                  height: height * 0.06,
                  marginTop: height * 0.02,
                },
              ]}
              onPress={() => {
                navigation.navigate("Registro");
              }}
            >
              <Text style={styles.txtBtn}>Registro</Text>
            </Pressable>
            <Pressable
              style={[styles.btnChangePass, { width: width * 0.7 }]}
              onPress={() => {
                navigation.navigate("changepassword");
              }}
            >
              <Text style={styles.txtBtn}>Recuperar contraseña</Text>
            </Pressable>
          </View>
        </View>
      </View>

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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: Scale > 400 ? 24 : 20,
    fontWeight: "bold",
    color: "black",
  },
  subtitle: {
    fontSize: Scale > 400 ? 18 : 14,
    marginLeft: "4%",
    color: "black",
  },
  txtBtn: {
    color: "white",
    fontWeight: "bold",
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
  input: {
    height: 40,
    margin: 12,
    padding: 10,
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
});
