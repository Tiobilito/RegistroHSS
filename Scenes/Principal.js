import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  ImageBackground,
  Pressable,
} from "react-native";
import { añadirHoras } from "../Modulos/db";
import { ObtenerDatosUsuario, ActualizarInicio } from "../Modulos/InfoUsuario";
import { Cronometro } from "../Modulos/Cronometro";
import { functionGetLocation, validation } from "../Modulos/gps";

const Scale = Dimensions.get("window").width;

export default function PaginaIngreso() {
  const [usuario, DefUsuario] = useState(null);
  const [MostrarCr, DefMostrarCr] = useState(false);
  const [FechaInicio, DefFechaInicio] = useState(new Date());
  const [Ubicacion, DefUbicacion] = useState(null);
  let showAll = false;

  const tomarUsuario = async () => {
    let data = await ObtenerDatosUsuario();
    if (data) {
      DefUsuario(data);
      if (data.Inicio != "null") {
        DefFechaInicio(new Date(data.Inicio));
        DefMostrarCr(true);
      }
    } else {
      console.log("No hay Usuario");
    }
  };

  if (usuario && Ubicacion) {
    showAll = true;
  }

  useEffect(() => {
    tomarUsuario();
    functionGetLocation(DefUbicacion);
  }, []);

  const image = require("../assets/fondo.webp");

  return (
    <ImageBackground source={image} style={styles.container}>
      <View
        style={{
          marginTop: "24%",
          marginBottom: "12%",
          height: "10%",
          width: "90%",
          gap: 16,
        }}
      >
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Registro de horas</Text>
      </View>
      {showAll ? (
        <View
          style={{
            backgroundColor: "#ffffff",
            width: "90%",
            height: "50%",
            borderRadius: 200,
          }}
        >
          {MostrarCr ? (
            <View
              style={{
                alignItems: "center",
                height: "100%",
                justifyContent: "flex-end",
                gap: 60,
              }}
            >
              <Cronometro startDate={FechaInicio} />
              <Pressable
                style={styles.btnChrono}
                onPress={async () => {
                  const VLocation = await functionGetLocation(DefUbicacion);
                  if (VLocation === true) {
                    if (await validation(Ubicacion)) {
                      añadirHoras();
                      DefMostrarCr(false);
                    } else {
                      Alert.alert("No estas en el departamento :(");
                    }
                  }
                }}
              >
                <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
                  Detener tiempo
                </Text>
              </Pressable>
            </View>
          ) : (
            <View
              style={{
                alignItems: "center",
                justifyContent: "flex-end",
                height: "100%",
                gap: 60,
              }}
            >
              <Text style={styles.timeText}>00:00:00</Text>
              <Pressable
                style={styles.btnChrono}
                onPress={async () => {
                  const now = new Date();
                  const VLocation = await functionGetLocation(DefUbicacion);
                  if (VLocation === true) {
                    if (await validation(Ubicacion)) {
                      DefFechaInicio(now);
                      ActualizarInicio(now.toISOString());
                      DefMostrarCr(true);
                    } else {
                      Alert.alert("No estas dentro del Departamento :(");
                    }
                  }
                }}
              >
                <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
                  Iniciar tiempo
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      ) : (
        <Text>Cargando...</Text>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    resizeMode: "cover",
  },
  Content: {
    margin: 50,
  },
  Boton: {
    color: "red",
  },
  title: {
    fontSize: Scale > 400 ? 24 : 20,
    fontWeight: "bold",
    color: "black",
  },
  subtitle: {
    fontSize: Scale > 400 ? 24 : 20,
    fontWeight: "regular",
    color: "black",
  },
  btnChrono: {
    backgroundColor: "#2272A7",
    height: "16%",
    width: "32%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "8%",
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
  timeText: {
    fontSize: 48,
    fontWeight: "bold",
  },
});
