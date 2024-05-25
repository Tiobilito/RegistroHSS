import React from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import db, { borrarUsuarios } from "../db";

export default function PaginaAjustes() {
  return (
    <View style={styles.container}>
      <Text>Ventana de ajustes</Text>
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
                onPress: () => borrarUsuarios(),
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
});
