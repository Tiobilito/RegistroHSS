import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Dimensions,
} from "react-native";

const Scale = Dimensions.get("window").width;

export default function PaginaAjustes() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ventana de ajustes</Text>
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
                onPress: () => console.log("Espere funcionalidad"),
              },
            ],
            { cancelable: false }
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: Scale > 400 ? 50 : 15,
    fontWeight: "bold",
    margin: 20,
    color: "black",
  },
});
