import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";

import PaginaPrincipal from "./Scenes/Principal";
import PaginaRegistro from "./Scenes/Registro";
import PaginaTablaHoras from "./Scenes/TablaHoras";
import PaginaAjustes from "./Scenes/Ajustes";
import PaginaIngreso from "./Scenes/Ingreso";
import { Gps } from "./Scenes/gps";

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
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Principal" component={PaginaPrincipal} />
      <Tab.Screen name="TablaHoras" component={PaginaTablaHoras} />
      <Tab.Screen name="Ajustes" component={PaginaAjustes} />
     
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Ingreso" component={PaginaIngreso} />
        <Stack.Screen name="Registro" component={PaginaRegistro} />
        <Stack.Screen name="Tab" component={TabNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
