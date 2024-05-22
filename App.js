import { React } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PaginaPrincipal from "./Scenes/Principal";
import PaginaIngreso from "./Scenes/Ingreso";
import PaginaRegistro from "./Scenes/Registro";
import PaginaTablaHoras from "./Scenes/TablaHoras";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Principal" component={PaginaPrincipal} />
      <Tab.Screen name="TablaHoras" component={PaginaTablaHoras} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Ingreso" component={PaginaIngreso}/>
        <Stack.Screen name="Registro" component={PaginaRegistro}/>
        <Stack.Screen name="Tab" component={TabNavigation}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}