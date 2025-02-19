import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  Pressable,
  Alert,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { BorrarHora, obtenerHorasSemana, sumarTiempos } from "../Modulos/Base de Datos Sqlite/db";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function PaginaTablaHoras({ navigation }) {
  const { width, height } = useWindowDimensions();
  const scaleFactor = width / 375; // Ancho base: 375
  const route = useRoute();
  const { idSem } = route.params;
  
  const [Horas, setHoras] = useState([]);
  const [MostrarHoras, setMostrarHoras] = useState(false);

  const obtenerHoras = async () => {
    const HorasSemana = await obtenerHorasSemana(idSem);
    console.log("horas semana", HorasSemana);
    setHoras(HorasSemana);
    setMostrarHoras(HorasSemana);
  };

  useFocusEffect(
    React.useCallback(() => {
      obtenerHoras();
    }, [])
  );

  const image = require("../assets/fondo.webp");

  return (
    <ImageBackground
      source={image}
      style={[styles.container, { width, height }]}
      resizeMode="cover"
    >
      {/* Encabezado */}
      <View
        style={{
          width: width * 0.9,
          marginTop: height * 0.08,
        }}
      >
        <Text
          style={{
            fontSize: scaleFactor > 1 ? 24 : 20,
            fontWeight: "bold",
            color: "white",
          }}
        >
          Tabla de horas:
        </Text>
        <Text
          style={{
            fontSize: scaleFactor > 1 ? 24 : 20,
            fontWeight: "400",
            color: "white",
          }}
        >
          Horas formato de total HH:MM:SS
        </Text>
      </View>

      {/* Contenedor de la lista */}
      <View
        style={[
          styles.listContainer,
          {
            width: width * 0.9,
            height: height * 0.7,
            marginTop: height * 0.08,
            padding: width * 0.04,
          },
        ]}
      >
        {MostrarHoras ? (
          <>
            <FlatList
              data={Horas}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.item,
                    {
                      padding: width * 0.03,
                      marginTop: height * 0.02,
                    },
                  ]}
                >
                  {item.IsBackedInSupabase == 0 ? (
                    <Ionicons
                      name="cloud-offline"
                      size={30 * scaleFactor}
                      color="white"
                    />
                  ) : (
                    <Ionicons
                      name="cloud"
                      size={30 * scaleFactor}
                      color="white"
                    />
                  )}
                  <Text style={[styles.txt, { fontSize: 16 * scaleFactor }]}>
                    Inicio: {item.Inicio}
                  </Text>
                  <Text style={[styles.txt, { fontSize: 16 * scaleFactor }]}>
                    Final: {item.Final}
                  </Text>
                  <Text style={[styles.txt, { fontSize: 16 * scaleFactor }]}>
                    Total: {item.Total}
                  </Text>
                  <Pressable
                    style={{ padding: 10 }}
                    onPress={() => {
                      Alert.alert(
                        "Confirmación",
                        "¿Estás seguro de que quieres eliminar este registro?",
                        [
                          {
                            text: "Cancelar",
                            onPress: () =>
                              console.log("Borrado Cancelado"),
                            style: "cancel",
                          },
                          {
                            text: "Borrar",
                            onPress: () => {
                              BorrarHora(item.id, item.idSemana);
                            },
                          },
                        ],
                        { cancelable: false }
                      );
                    }}
                  >
                    <View
                      style={{
                        marginLeft: width * 0.5,
                        marginTop: -height * 0.08,
                      }}
                    >
                      <Ionicons
                        name="trash"
                        size={50 * scaleFactor}
                        color="white"
                      />
                    </View>
                  </Pressable>
                </View>
              )}
            />

            <View style={{ marginTop: height * 0.02 }}>
              <Text
                style={{
                  fontSize: 18 * scaleFactor,
                  fontWeight: "bold",
                  width: "auto",
                  color: "white",
                }}
              >
                Total acumulado en la semana: (
                {sumarTiempos(Horas.map((item) => item.Total))})
              </Text>
            </View>
          </>
        ) : (
          <Text style={{ color: "white", fontSize: 18 * scaleFactor }}>
            No hay registros
          </Text>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  txt: {
    color: "white",
  },
  listContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    // Sombras para Android
    elevation: 15,
    // Sombras para iOS
    shadowColor: "#333333",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  item: {
    backgroundColor: "#2272A7",
    borderRadius: 20,
    // Sombras para Android
    elevation: 15,
    // Sombras para iOS
    shadowColor: "#333333",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
