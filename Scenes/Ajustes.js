import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Dimensions,
  ImageBackground,
} from "react-native";
import { EliminarUsuarioHoras } from "../Modulos/OperacionesBD";
import { BorrarDatosUsuario } from "../Modulos/InfoUsuario";

const Scale = Dimensions.get("window").width;

const image = require("../assets/fondo.webp");

export default function PaginaAjustes({ navigation }) {
  return (
    <ImageBackground source={image} style={styles.container}>
      <View
        style={{
          width: "90%",
          marginTop: 50,
          marginBottom: 250,
          marginLeft: 125
        }}
      >
        <Text style={styles.text}>Ajustes</Text>
      </View>
      <Button
        title="Editar usuario"
        onPress={() => {
          navigation.navigate("PaginaModificarUsusario");
        }}
      />
      <Button
        title="Borrar El Usuario"
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
      />
      <Button
        title="Cerrar Sesion"
        onPress={() => {
          navigation.navigate("Ingreso");
        }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
    //justifyContent: "center",
  },
  text: {
    fontSize: Scale > 400 ? 40 : 35,
    fontWeight: "bold",
    //margin: 20,
    color: "black",
  },
});