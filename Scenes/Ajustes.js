import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import db, { borrarUsuarios } from "../db";

export default function PaginaAjustes() {
  return (
    <View style={styles.container}>
      <Text>Ventana de ajustes</Text>
      <Button title="Borrar Usuarios" onPress={() => borrarUsuarios()} />
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
