import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { initializeDatabase } from "./Modulos/Base de Datos Sqlite/SQLiteIni";
import Supervisor from "./Scenes/Supervisor"; // Pantalla del Supervisor

import PaginaPrincipal from "./Scenes/Principal";
import PaginaRegistro from "./Scenes/Registro";
import PaginaTablaSemanas from "./Scenes/TablaSemanas";
import PaginaAjustes from "./Scenes/Ajustes";
import PaginaIngreso from "./Scenes/Ingreso";
import changepassword from "./Scenes/changePassword";
import PaginaAyuda from "./Scenes/Ayuda";
import PaginaModUsuario from "./Scenes/ModificarUsuario";
import PaginaHorario from "./Scenes/Horario";
import PaginaSupervisorHorario from "./Scenes/SupervisorHorario";
import PaginaSupervisorReportes from "./Scenes/Reportes";
import PaginaSupervisorAjustes from "./Scenes/SupervisorAjustes";
import PaginaSupervisorHoras from "./Scenes/SupervisorHoras";

const Tab = createBottomTabNavigator();
const TabSupervisor = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const TablaSemanasHoras = createNativeStackNavigator();
const PGAjuste = createNativeStackNavigator();

const TablaSemHoras = () => {
  return (
    <TablaSemanasHoras.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="TablaSemanas"
    >
      <TablaSemanasHoras.Screen
        name="TablaSemanas"
        component={PaginaTablaSemanas}
      />
    </TablaSemanasHoras.Navigator>
  );
};

const TabAjustes = () => {
  return (
    <PGAjuste.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Ajustes"
    >
      <PGAjuste.Screen name="AjustesP" component={PaginaAjustes} />
      <PGAjuste.Screen
        name="PaginaModificarUsusario"
        component={PaginaModUsuario}
      />
    </PGAjuste.Navigator>
  );
};

const TabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Principal"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Principal") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Horas") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Ajustes") {
            iconName = focused ? "cog" : "cog-outline";
          } else if (route.name === "Ayuda") {
            iconName = focused ? "help-circle" : "help-circle-outline";
          } else if (route.name === "Horario") {
            iconName = focused ? "today" : "today-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Principal" component={PaginaPrincipal} />
      <Tab.Screen name="Horas" component={TablaSemHoras} />
      <Tab.Screen name="Ayuda" component={PaginaAyuda} />
      <Tab.Screen name="Horario" component={PaginaHorario} />
      <Tab.Screen name="Ajustes" component={TabAjustes} />
    </Tab.Navigator>
  );
};

const SupervisorNavigation = () => {
  return (
    <TabSupervisor.Navigator
      initialRouteName="Principal"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Principal") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Horario") {
            iconName = focused ? "today" : "today-outline";
          } else if (route.name === "Reportes") {
            iconName = focused ? "reader" : "reader-outline";
          } else if (route.name === "Horas") {
            iconName = focused ? "time-outline" : "time-outline";
          } else if (route.name === "Ajustes") {
            iconName = focused ? "cog" : "cog-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <TabSupervisor.Screen name="Principal" component={Supervisor} />
      <TabSupervisor.Screen
        name="Horario"
        component={PaginaSupervisorHorario}
      />
      <TabSupervisor.Screen
        name="Reportes"
        component={PaginaSupervisorReportes} // Aquí se usan los reportes
      />
      <TabSupervisor.Screen
        name="Horas"
        component={PaginaSupervisorHoras} // Aquí se usan los reportes
      />
      <TabSupervisor.Screen
        name="Ajustes"
        component={PaginaSupervisorAjustes} // Aquí se usan los reportes
      />
    </TabSupervisor.Navigator>
  );
};

export default function App() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Ingreso" component={PaginaIngreso} />
        <Stack.Screen name="Registro" component={PaginaRegistro} />
        <Stack.Screen name="changepassword" component={changepassword} />
        <Stack.Screen name="Tab" component={TabNavigation} />
        <Stack.Screen name="Supervisor" component={SupervisorNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
