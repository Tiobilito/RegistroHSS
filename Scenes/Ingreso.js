import { React, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  Button,
} from "react-native";
import * as SQLite from "expo-sqlite";

const Scale = Dimensions.get("window").width;

export default function PaginaIngreso({ navigation }) {
  //const db = await SQLite.openDatabaseAsync("Horario");
  const [Usuario, DefUsuario] = useState("");
  const [Contraseña, DefContraseña] = useState("");

  useEffect(() => {
    //await db.execAsync('');
  }, []);

  return (
    <View style={styles.background}>
      <Text style={styles.text}>Inicio de sesión</Text>
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
        secureTextEntry={true}
      />
      <Text style={styles.text}>
        {"No tienes cuenta "}
        <Text
          style={{ color: "blue", textDecorationLine: "underline" }}
          onPress={() => navigation.navigate("Registro")}
        >
          Registrate
        </Text>
      </Text>
      <Button title="Ingresar" onPress={() => navigation.navigate("Tab")} />
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
