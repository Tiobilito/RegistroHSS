import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import { EncontrarUsuario } from "../Modulos/VerificacionUsuario";
import { ObtenerDatosUsuario, ActualizarContraseña } from "../Modulos/InfoUsuario";
import * as LocalAuthentication from "expo-local-authentication";
import Ionicons from "@expo/vector-icons/Ionicons";

const Scale = Dimensions.get("window").width;

export default function PaginaIngreso({ navigation }) {
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
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Ingresa</Text>
        </View>
        <View style={{ height: "60%" }}>
          <Text style={styles.subtitle}>Código</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              DefCodigo(text);
            }}
            keyboardType="numeric"
            value={Codigo}
          />
          <Text style={styles.subtitle}>Contraseña</Text>
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
              style={{
                height: "16%",
                width: "65%",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                style={styles.btnIngresar}
                onPress={() => {
                  if (Codigo != "" && Contraseña != "") {
                    IngresoUsuario();
                  } else {
                    Alert.alert("Por favor completa los 2 campos");
                  }
                }}
              >
                <Text style={styles.txtBtn}>Ingresar</Text>
              </TouchableOpacity>

              {biometricAvailable ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#57A9D9",
                    justifyContent: "center",
                    alignContent: "center",
                    width: "20%",
                    height: "100%",
                    borderRadius: 999999,
                  }}
                  onPress={() => Autentificacion()}
                >
                  <Ionicons name="finger-print" size={38} color="black" />
                </TouchableOpacity>
              ) : null}

            </View>
            <View style={styles.separator}>
              <View style={styles.line} />
              <Text>Ó</Text>
              <View style={styles.line} />
            </View>
            <Text style={styles.subtitle}>Si no estas registrado</Text>
            <TouchableOpacity
              style={styles.btnRegistro}
              onPress={() => {
                navigation.navigate("Registro");
              }}
            >
              <Text style={styles.txtBtn}>Registro</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnChangePass}
              onPress={() => {
                navigation.navigate("changepassword");
              }}
            >
              <Text style={styles.txtBtn}>Recuperar contraseña</Text>
            </TouchableOpacity>
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
