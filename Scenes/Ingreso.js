import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Pressable,
  Dimensions,
  TextInput,
  Alert,
  useWindowDimensions // <-- Se agregó para obtener dimensiones dinámicas
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import { EncontrarUsuario } from "../Modulos/VerificacionUsuario";
import { ObtenerDatosUsuario, ActualizarContraseña } from "../Modulos/InfoUsuario";
import * as LocalAuthentication from "expo-local-authentication";
import Ionicons from "@expo/vector-icons/Ionicons";

const Scale = Dimensions.get("window").width;

export default function PaginaIngreso({ navigation }) {
  const { width, height } = useWindowDimensions(); // <-- Hook para dimensiones dinámicas
  const [Codigo, DefCodigo] = useState("");
  const [Contraseña, DefContraseña] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const checkBiometricSupport = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const data = await ObtenerDatosUsuario();
    if(hasHardware && isEnrolled && data) {
      setBiometricAvailable(true);
    } 
    else {
      setBiometricAvailable(false);
    }
  };

  async function Autentificacion() {
    const result = await LocalAuthentication.authenticateAsync();
    const data = await ObtenerDatosUsuario();
    if (result.success && data) {
      DefCodigo(data.Codigo);
      DefContraseña(data.Contraseña);
      setIsAuthenticated(true);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      IngresoUsuario();
    }
  }, [Codigo, Contraseña, isAuthenticated]);

  useEffect(() => {
    checarUsuario();
    checkBiometricSupport();
  }, []);

  const IngresoUsuario = async () => {
    const BUsuario = await EncontrarUsuario(Codigo, Contraseña);
    if (BUsuario === true) {
      const data = await ObtenerDatosUsuario();
      if (data.Contraseña != Contraseña) {
        ActualizarContraseña(Contraseña);
      }
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Tab" }],
        })
      );
    } else {
      setIsAuthenticated(false);
      Alert.alert("Datos incorrectos");
    }
  };

  const checarUsuario = async () => {
    const data = await ObtenerDatosUsuario();
    if (data) {
      DefCodigo(data.Codigo);
    }
  };

  const image = require("../assets/Back.png");

  return (
    <ImageBackground source={image} style={styles.imgBackground}>
      {/* Nuevo spacer para bajar los elementos */}
      <View style={{ height: height * 0.05 }} />
      <View style={[styles.formContainer, { width: width * 0.8, marginTop: height * 0.05 }]}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { fontSize: width > 400 ? 24 : 20 }]}>Ingresa</Text>
        </View>
        <View style={{ height: height * 0.6 }}>
          <Text style={[styles.subtitle, { fontSize: width > 400 ? 18 : 14 }]}>Código</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              DefCodigo(text);
            }}
            keyboardType="numeric"
            value={Codigo}
          />
          <Text style={[styles.subtitle, { fontSize: width > 400 ? 18 : 14 }]}>Contraseña</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              DefContraseña(text);
            }}
            value={Contraseña}
            secureTextEntry={true}
          />

          <View style={styles.btnContainer}>
            <View
              // Se reduce el height para disminuir el espacio vertical y se iguala a la altura de los botones
              style={{
                height: height * 0.08, // antes era height * 0.1
                width: width * 0.65,
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Pressable
                style={[styles.btnIngresar, { width: width * 0.25, height: height * 0.06, marginTop: height * 0.02 }]}
                onPress={() => {
                  if (Codigo != "" && Contraseña != "") {
                    IngresoUsuario();
                  } else {
                    Alert.alert("Por favor completa los 2 campos");
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
                      alignItems: "center", // Centra el ícono dentro del botón
                      borderRadius: 999999,
                    },
                    { width: width * 0.2, height: height * 0.06, marginTop: height * 0.02 } // Se iguala la altura a la del botón "Ingresar"
                  ]}
                  onPress={() => Autentificacion()}
                >
                  <Ionicons name="finger-print" size={width * 0.1} color="black" />
                </Pressable>
              ) : null}
            </View>
            
            <View style={styles.separator}>
              <View style={[styles.line, { width: width * 0.3 }]} />
              <Text>Ó</Text>
              <View style={[styles.line, { width: width * 0.3 }]} />
            </View>
            <Text style={[styles.subtitle, { fontSize: width > 400 ? 18 : 14 }]}>Si no estas registrado</Text>
            <Pressable
              style={[styles.btnRegistro, { width: width * 0.3, height: height * 0.06, marginTop: height * 0.02 }]}
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
    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: Scale > 400 ? 24 : 20,
    fontWeight: "bold",
    //marginRight: 30,
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
    //De aqui para abajo son las sombras para los distintos sistemas
    elevation: 15, //Android
    shadowColor: "#333333", //A partir de aqui ios
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  //Terminan las sombras
  btnContainer: {
    //backgroundColor: "green",
    alignItems: "center",
    marginTop: "4%",
  },
  btnIngresar: {
    backgroundColor: "#2272A7",
    height: "100%",
    width: 109,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    elevation: 15, //Android
    shadowColor: "#333333", //A partir de aqui ios
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  btnRegistro: {
    backgroundColor: "#2272A7",
    height: "16%",
    width: 109,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: "8%",
    elevation: 15, //Android
    shadowColor: "#333333", //A partir de aqui ios
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  btnChangePass: {
    backgroundColor: "#2272A7",
    height: "16%",
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: "8%",
    elevation: 15, //Android
    shadowColor: "#333333", //A partir de aqui ios
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
    width: 120,
    backgroundColor: "black",
  },
});
