import { React, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Dimensions } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as SQLite from 'expo-sqlite';

//Scenes
import PaginaPrincipal from "./Scenes/Principal";
import PaginaTablaHoras from "./Scenes/TablaHoras";

const Tab = createBottomTabNavigator();
const Scale = Dimensions.get("window").width;

const TabNatigation = () => {
  return (
    <Tab.Navigator initialRouteName="Principal">
      <Tab.Screen name="Principal" component={PaginaPrincipal} />
      <Tab.Screen name="TablaHoras" component={PaginaTablaHoras} />
    </Tab.Navigator>
  );
};

const Ingreso = () => {
  const [Usuario, DefUsuario] = useEffect("");
  const [Contraseña, DefContraseña] = useEffect("");

  return (
    <View style={styles.background}>
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
      <Text style={styles.text}>
        {"No tienes cuenta "}
        <Text
          style={{ color: "blue", textDecorationLine: "underline" }}
          onPress={() => console.log("Espere Funcionalidad")}
        >
          Registrate
        </Text>
      </Text>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Ingreso />
    </NavigationContainer>
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
