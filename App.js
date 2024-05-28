import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import db, { initializeDatabase } from "./Modulos/db";

import PaginaPrincipal from "./Scenes/Principal";
import PaginaInicio from "./Scenes/Inicio";
import PaginaTablaHoras from "./Scenes/TablaHoras";
import PaginaAjustes from "./Scenes/Ajustes";

import DB from "./Modulos/conexionDB"

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Principal"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Principal") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "TablaHoras") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Ajustes") {
            iconName = focused ? "cog" : "cog-outline";
          }
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Principal" component={PaginaPrincipal} />
      <Tab.Screen name="TablaHoras" component={PaginaTablaHoras} />
      <Tab.Screen name="Ajustes" component={PaginaAjustes} />
      <Tab.Screen name="Database" component={DB}/>
    </Tab.Navigator>
  );
};

export default function App() {
  const [irInicio, setIrInicio] = useState(null);

  useEffect(() => {
    initializeDatabase();
    console.log("Base de datos inicializada");
    VerificarUsuario();
  }, []);

  const VerificarUsuario = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM Usuarios;`,
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            console.log("Si hay un usuario: ", rows._array);
            setIrInicio(true);
          } else {
            console.log("No hay registros en la tabla Usuarios");
            setIrInicio(false);
          }
        },
        (_, error) => {
          console.log("Error al verificar usuarios:", error);
          setIrInicio(false);
        }
      );
    });
  };

  if (irInicio === null) {
    return null;
  }

  return (
    <NavigationContainer>
      {irInicio ? (
        <TabNavigation />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Inicio" component={PaginaInicio} />
          <Stack.Screen name="Tab" component={TabNavigation} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
