import React from "react";
import { StyleSheet, Text, View,Button } from "react-native";
import db, { borrarUsuarios } from "../db";

export default function PaginaIngreso() {
  return (
    <View style={styles.container}>
      <Text>Principal</Text>
      <Button title="Borrar Usuarios" onPress={() => borrarUsuarios()}/>
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
