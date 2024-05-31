import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  TextInput,
  SafeAreaView,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import { EncontrarUsuario } from "../Modulos/OperacionesBD";

const Scale = Dimensions.get("window").width;

export default function Main({ navigation }) {
  const [user, SetUser] = useState("");
  const [password, SetPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.text2}>
        <Text style={styles.text}>Logeate</Text>
        <TextInput
          style={styles.input}
          onChangeText={SetUser}
          value={user}
          placeholder="Usuario"
        />
        <TextInput
          style={styles.input}
          onChangeText={SetPassword}
          placeholder="Contraseña"
          secureTextEntry
        />
        <Button
          color="blue"
          title="Iniciar tiempo"
          onPress={() => {
            EncontrarUsuario(user, password);
          }}
        />
        <Button
          color="red"
          title="Registro"
          onPress={() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "Registro" }],
              })
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text2: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: Scale > 400 ? 50 : 15,
    fontWeight: "bold",
    marginRight: 20,
    color: "black",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%", // Para que el input tenga un ancho razonable
  },
});
