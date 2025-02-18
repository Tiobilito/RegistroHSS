import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ImageBackground,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { EliminarUsuarioHoras } from "../Modulos/OperacionesBD";
import { BorrarDatosUsuario } from "../Modulos/InfoUsuario";
import Ionicons from "@expo/vector-icons/Ionicons";

const image = require("../assets/fondo.webp");

export default function PaginaAjustes({ navigation }) {
  const { width, height } = useWindowDimensions();
  const scaleFactor = width / 375; // Ancho base para escalado

  return (
    <ImageBackground
      source={image}
      style={[styles.container, { width, height }]}
      resizeMode="cover"
    >
      {/* Título "Ajustes" más arriba */}
      <View style={[styles.headerContainer, { marginTop: height * 0.03 }]}>
        <Text style={[styles.headerText, { fontSize: scaleFactor > 1 ? 40 : 35 }]}>
          Ajustes
        </Text>
      </View>

      {/* Contenedor de botones, subido un poco */}
      <View style={[styles.buttonsContainer, { marginTop: height * 0.03 }]}>
        <Pressable
          style={styles.customButton}
          onPress={() => {
            navigation.navigate("PaginaModificarUsusario");
          }}
        >
          <Ionicons
            name="person-outline"
            size={24 * scaleFactor}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={[styles.buttonText, { fontSize: 18 * scaleFactor }]}>
            Editar usuario
          </Text>
        </Pressable>

        <Pressable
          style={styles.customButton}
          onPress={() => {
            Alert.alert(
              "Confirmación",
              "¿Estás seguro de que quieres continuar?",
              [
                {
                  text: "Cancelar",
                  onPress: () => console.log("Borrado Cancelado"),
                  style: "cancel",
                },
                {
                  text: "Borrar",
                  onPress: () => {
                    EliminarUsuarioHoras();
                    BorrarDatosUsuario();
                    navigation.navigate("Ingreso");
                  },
                },
              ],
              { cancelable: false }
            );
          }}
        >
          <Ionicons
            name="trash-outline"
            size={24 * scaleFactor}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={[styles.buttonText, { fontSize: 18 * scaleFactor }]}>
            Borrar Usuario
          </Text>
        </Pressable>

        <Pressable
          style={styles.customButton}
          onPress={() => {
            navigation.navigate("Ingreso");
          }}
        >
          <Ionicons
            name="log-out-outline"
            size={24 * scaleFactor}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={[styles.buttonText, { fontSize: 18 * scaleFactor }]}>
            Cerrar Sesion
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    width: "100%",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    color: "black",
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
  },
  customButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2272A7", // Color azul
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: "90%",
    alignSelf: "center",
    elevation: 3, // Sombra en Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
