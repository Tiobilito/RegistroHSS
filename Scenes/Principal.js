import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { añadirHoras } from "../Modulos/db";
import { ObtenerDatosUsuario, ActualizarInicio } from "../Modulos/InfoUsuario";
import { Cronometro } from "../Modulos/Cronometro";
import { functionGetLocation } from "../Modulos/gps";
import { Ionicons } from "@expo/vector-icons";

export default function PaginaIngreso() {
  const { width, height } = useWindowDimensions();
  const scaleFactor = width / 375;

  // Definir dimensiones para el botón oval
  const buttonWidth = 100 * scaleFactor; // Ajusta este valor
  const buttonHeight = 60 * scaleFactor; // Ajusta este valor
  const iconSize = buttonHeight * 0.8; // El ícono ocupará el 80% de la altura del botón

  const [usuario, DefUsuario] = useState(null);
  const [MostrarCr, DefMostrarCr] = useState(false);
  const [FechaInicio, DefFechaInicio] = useState(new Date());
  const [Ubicacion, DefUbicacion] = useState(null);
  let showAll = false;

  const tomarUsuario = async () => {
    let data = await ObtenerDatosUsuario();
    if (data) {
      DefUsuario(data);
      if (data.Inicio !== "null") {
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

  // Dimensiones para el contenedor oval
  const ovalWidth = width * 0.9;
  const ovalHeight = height * 0.5; // Puedes ajustar este valor según tus necesidades

  return (
    <ImageBackground
      source={image}
      style={[styles.container, { width, height }]}
      resizeMode="cover"
    >
      <View
        style={[
          styles.header,
          {
            marginTop: height * 0.1,
            marginBottom: height * 0.05,
            width: width * 0.9,
          },
        ]}
      >
        <Text style={[styles.title, { fontSize: 24 * scaleFactor }]}>
          Bienvenido
        </Text>
        <Text style={[styles.subtitle, { fontSize: 20 * scaleFactor }]}>
          Registro de horas
        </Text>
      </View>
      {showAll ? (
        <View
          style={[
            styles.card,
            {
              width: ovalWidth,
              height: ovalHeight,
              borderRadius: ovalHeight / 2, // Crea la forma oval
              // Agregamos el "margen" (borde) de color azul oscuro
              borderWidth: 4,
              borderColor: "#0c6296",
            },
          ]}
        >
          {MostrarCr ? (
            <View
              style={[
                styles.content,
                { justifyContent: "flex-end", paddingBottom: 40 * scaleFactor },
              ]}
            >
              <Cronometro startDate={FechaInicio} />
              <Pressable
                style={[
                  styles.buttonOval,
                  styles.buttonStop,
                  {
                    width: buttonWidth,
                    height: buttonHeight,
                    borderRadius: buttonHeight / 2,
                  },
                ]}
                onPress={async () => {
                  añadirHoras();
                  DefMostrarCr(false);
                }}
              >
                <Ionicons
                  name="stop-circle-outline"
                  size={iconSize}
                  color="#fff"
                />
              </Pressable>
            </View>
          ) : (
            <View
              style={[
                styles.content,
                { justifyContent: "flex-end", paddingBottom: 40 * scaleFactor },
              ]}
            >
              <Text
                style={[
                  styles.timeText,
                  { fontSize: 48 * scaleFactor, marginBottom: 70 * scaleFactor },
                ]}
              >
                00:00:00
              </Text>
              <Pressable
                style={[
                  styles.buttonOval,
                  styles.buttonPlay,
                  {
                    width: buttonWidth,
                    height: buttonHeight,
                    borderRadius: buttonHeight / 2,
                  },
                ]}
                onPress={async () => {
                  const now = new Date();
                  await functionGetLocation(DefUbicacion);
                  // Puedes agregar validación de ubicación si lo deseas
                  DefFechaInicio(now);
                  ActualizarInicio(now.toISOString());
                  DefMostrarCr(true);
                }}
              >
                <Ionicons
                  name="play-circle-outline"
                  size={iconSize}
                  color="#fff"
                />
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
  },
  header: {
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    color: "black",
  },
  subtitle: {
    fontWeight: "normal",
    color: "black",
  },
  card: {
    backgroundColor: "#ffffff",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  timeText: {
    fontWeight: "bold",
  },
  // Estilo base para el botón en forma de óvalo
  buttonOval: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  // Estilos específicos para cada botón (fondo)
  buttonStop: {
    backgroundColor: "red",
  },
  buttonPlay: {
    backgroundColor: "#2272A7",
  },
});
