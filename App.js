import { React, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PaginaPrincipal from "./Scenes/Principal";
import PaginaInicio from "./Scenes/Inicio";
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
  const IrInicio = false;

  return (
    <NavigationContainer>
      {IrInicio ? (
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
