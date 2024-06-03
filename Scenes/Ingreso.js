import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import { EncontrarUsuario } from "../Modulos/OperacionesBD";
import { ObtenerDatosUsuario } from "../Modulos/InfoUsuario";

const Scale = Dimensions.get("window").width;

export default function PaginaIngreso({ navigation }) {
  const [Codigo, DefCodigo] = useState("");
  const [Contraseña, DefContraseña] = useState("");

  const IngresoUsuario = async () => {
    const BUsuario = await EncontrarUsuario(Codigo, Contraseña);
    if (BUsuario === true) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Tab" }],
        })
      );
    } else {
      console.log("No existe el usuario");
    }
  };

  const checarUsuario = async () => {
    try {
      const data = await ObtenerDatosUsuario();
      if (data) {
        DefCodigo(data.Codigo);
        DefContraseña(data.Contraseña);
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario: ", error);
    }
  };

  useEffect(() => {
    checarUsuario();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ingresa</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => {
          DefCodigo(text);
        }}
        value={Codigo}
        placeholder="Codigo"
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
      <Button
        color="blue"
        title="Ingresar"
        onPress={() => {
          if (Codigo != "" && Contraseña != "") {
            IngresoUsuario();
          } else {
            Alert.alert("Por favor completa los 2 campos");
          }
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
  );
}

const styles = StyleSheet.create({
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
