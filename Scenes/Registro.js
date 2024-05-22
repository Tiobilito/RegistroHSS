import { React, useState } from "react";
import { StyleSheet, Text, View, TextInput, Dimensions } from "react-native";

const Scale = Dimensions.get("window").width;

export default function PaginaRegistro({ navigation }) {
  const [Usuario, DefUsuario] = useState("");
  const [Contraseña, DefContraseña] = useState("");

  return (
    <View style={styles.background}>
      <Text style={styles.text}>Registro</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => {
          DefUsuario(text);
        }}
        value={Usuario}
        placeholder="Usuario"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => {
          DefContraseña(text);
        }}
        value={Contraseña}
        placeholder="Contraseña"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: Scale > 400 ? 60 : 40,
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: Scale > 400 ? 20 : 15,
    padding: 10,
    margin: 10,
    width: "80%",
    fontSize: Scale > 400 ? 30 : 15,
  },
  text: {
    fontSize: Scale > 400 ? 50 : 15,
    fontWeight: "bold",
    marginRight: 10,
    color: "black",
  },
});
