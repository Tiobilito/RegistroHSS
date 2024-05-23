import { React, useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  Button,
} from "react-native";
import * as SQLite from "expo-sqlite/legacy";
import PagerView from "react-native-pager-view";

const Scale = Dimensions.get("window").width;

export default function PaginaIngreso({ navigation }) {
  const [Usuario, DefUsuario] = useState("");
  const [Contraseña, DefContraseña] = useState("");
  const refIni = useRef();

  const db = SQLite.openDatabase("Horario.db");

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `    
          CREATE TABLE IF NOT EXISTS Horas (
            ID INTEGER NOT NULL UNIQUE,
            Inicio TEXT,
            Final TEXT,
            Total REAL,
            PRIMARY KEY(ID AUTOINCREMENT)
          );
        `
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        `    
          CREATE TABLE IF NOT EXISTS Usuarios (
            ID INTEGER NOT NULL UNIQUE,
            Usuario TEXT NOT NULL,
            Inicio TEXT,
            Contraseña TEXT NOT NULL,
            PRIMARY KEY(ID AUTOINCREMENT)
          );
        `
      );
    });
  }, []);

  return (
    <View style={styles.background}>
      <PagerView style={styles.pager} initialPage={0} orientation="horizontal">
        <View key="1">
          <Text style={styles.text}>Nombre</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              DefUsuario(text);
            }}
            value={Usuario}
            placeholder="Nombre"
          />
        </View>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            DefContraseña(text);
          }}
          value={Contraseña}
          placeholder="Contraseña"
          secureTextEntry={true}
        />
        <Button title="Ingresar" onPress={() => navigation.navigate("Tab")} />
      </PagerView>
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
  pager: {
    flex: 1,
    alignSelf: "stretch",
  },
});
